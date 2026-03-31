---
name: canvas-data-fetching
description:
  Fetch and render Drupal content in Canvas components with JSON:API and SWR
  patterns. Also covers content write operations — creating pages, uploading
  media, composing component trees, and managing content entities via JSON:API.
  Use when building content lists, integrating with SWR, querying related
  entities, or programmatically composing pages. Covers JsonApiClient,
  DrupalJsonApiParams, relationship handling, filter patterns, CRUD operations,
  page component structure, input format reference, and common pitfalls.
---

# Data fetching

## Data fetching with SWR

Use [SWR](https://swr.vercel.app/) for all data fetching. It provides caching,
revalidation, and a clean hook-based API.

```jsx
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Profile() {
  const { data, error, isLoading } = useSWR(
    "https://my-site.com/api/user",
    fetcher,
  );

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;
  return <div>Hello, {data.name}!</div>;
}
```

## Fetching Drupal content with JSON:API

To fetch content from Drupal (e.g., articles, events, or other content types),
use the autoconfigured `JsonApiClient` from the `drupal-canvas` package combined
with `DrupalJsonApiParams` for query building.

**Important:** Do not mock JSON:API resources in Storybook stories. Components
that fetch data will display their loading or empty states in Storybook.

```jsx
import { getNodePath, JsonApiClient } from "drupal-canvas";
import { DrupalJsonApiParams } from "drupal-jsonapi-params";
import useSWR from "swr";

const Articles = () => {
  const client = new JsonApiClient();
  const { data, error, isLoading } = useSWR(
    [
      "node--article",
      {
        queryString: new DrupalJsonApiParams()
          .addSort("created", "DESC")
          .getQueryString(),
      },
    ],
    ([type, options]) => client.getCollection(type, options),
  );

  if (error) return "An error has occurred.";
  if (isLoading) return "Loading...";
  return (
    <ul>
      {data.map((article) => (
        <li key={article.id}>
          <a href={getNodePath(article)}>{article.title}</a>
        </li>
      ))}
    </ul>
  );
};

export default Articles;
```

### Including relationships with `addInclude`

When you need related entities (e.g., images, taxonomy terms), use `addInclude`
to fetch them in a single request.

**Avoid circular references in JSON:API responses.** SWR uses deep equality
checks to compare cached data, which fails with "too much recursion" errors when
the response contains circular references.

**Do not include self-referential fields.** Fields that reference the same
entity type being queried (e.g., `field_related_articles` on an article query)
create circular references: Article A references Article B, which references
back to Article A. If you need related content of the same type, fetch it in a
separate query.

**Use `addFields` to limit the response.** Always specify only the fields you
need. This improves performance and helps avoid circular reference issues:

```jsx
const params = new DrupalJsonApiParams();
params.addSort("created", "DESC");
params.addInclude(["field_category", "field_image"]);

// Limit fields for each entity type
params.addFields("node--article", [
  "title",
  "created",
  "field_category",
  "field_image",
]);
params.addFields("taxonomy_term--categories", ["name"]);
params.addFields("file--file", ["uri", "url"]);
```

## Creating content list components

When building a component that displays a list of content items (e.g., a news
listing, event calendar, or resource library), follow this workflow:

### Setup gate

Before any JSON:API discovery or content-type checks, verify local setup:

1. Check that a `.env` file exists in the project root.
2. If `.env` exists, verify `CANVAS_SITE_URL` is set. Read
   `CANVAS_JSONAPI_PREFIX` if present; otherwise, use `jsonapi`.
3. Send an HTTP request to `{CANVAS_SITE_URL}/{CANVAS_JSONAPI_PREFIX}`. Success
   means HTTP `200`.
4. If the request is successful, continue with Drupal data fetching.
5. If the request is unsuccessful (or required `.env` values are missing), ask
   the user whether they want to:
   - Configure Drupal connectivity now, or
   - Continue with static content instead of Drupal fetching.
6. If the user chooses to configure connectivity, provide `.env` instructions:
   - `CANVAS_SITE_URL=<their Drupal site URL>`
   - `CANVAS_JSONAPI_PREFIX=jsonapi` (optional; defaults to `jsonapi`) Then wait
     for the user to confirm they updated `.env`, and test the request again.
7. If the user chooses not to configure connectivity, proceed with static
   content.
8. Do not update Vite config (`vite.config.*`) to troubleshoot connectivity.
   Connectivity issues must be resolved via correct `.env` values and Drupal
   site availability, not build tooling changes.

### Step 1: Analyze the list structure

Examine the design to understand what data each list item needs:

- What fields are displayed (title, date, image, category, etc.)?
- How are items sorted (newest first, alphabetical, etc.)?
- Are there filters or pagination?

### Step 2: Identify or request the content type

Before writing code, verify that an appropriate content type exists in Drupal:

1. Check the JSON:API endpoint of your local Drupal site (configured via
   `CANVAS_SITE_URL` and `CANVAS_JSONAPI_PREFIX` environment variables) to find
   a content type that matches the required structure. Use a plain `fetch`
   request for this check, after passing the Setup gate.

2. If a matching content type exists, use it and note which fields are
   available.

3. If no matching content type exists, **stop and prompt the user** to create
   one. Provide:
   - A suggested content type name
   - The required field structure based on the list design

### Step 3: Build the component

Create the content list component using JSON:API to fetch content. Only use
fields that actually exist on the content type—do not assume fields exist
without verifying.

### Handling filters

If the list includes filters based on entity reference fields (e.g., filter by
category, filter by author):

- **Do not hardcode filter options.** Filter options should be fetched
  dynamically using JSON:API.
- Fetch the available options for each filter (e.g., all taxonomy terms in a
  vocabulary) and populate the filter UI from that data.

This ensures filters stay in sync with the actual content in Drupal and new
options appear automatically without code changes.

## Content write operations

The JSON:API supports creating, updating, and deleting content entities. These
operations use standard JSON:API request formats with `fetch()`.

**Prerequisites:** JSON:API must have write mode enabled. Drupal defaults to
read-only. If write operations return HTTP 405, enable writes in Drupal admin or
via drush (`drush config:set jsonapi.settings read_only false -y`).

### Create an entity

```js
const response = await fetch(`${siteUrl}/${jsonapiPrefix}/node/page`, {
  method: "POST",
  headers: {
    "Content-Type": "application/vnd.api+json",
    Accept: "application/vnd.api+json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    data: {
      type: "node--page",
      attributes: {
        title: "My Page",
        status: true,
        path: { alias: "/my-page" },
        components: [
          /* component tree — see Page Component Structure below */
        ],
      },
    },
  }),
});
```

### Update an entity

```js
await fetch(`${siteUrl}/${jsonapiPrefix}/node/page/${uuid}`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/vnd.api+json",
    Accept: "application/vnd.api+json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    data: {
      type: "node--page",
      id: uuid,
      attributes: {
        title: "Updated Title",
      },
    },
  }),
});
```

### Delete an entity

```js
await fetch(`${siteUrl}/${jsonapiPrefix}/node/page/${uuid}`, {
  method: "DELETE",
  headers: {
    Accept: "application/vnd.api+json",
    Authorization: `Bearer ${token}`,
  },
});
```

## Page component structure

Pages in Canvas contain a `components` attribute — a flat array where nesting is
encoded via `parent_uuid` and `slot` fields:

```json
{
  "data": {
    "type": "node--page",
    "attributes": {
      "title": "My Page",
      "status": true,
      "components": [
        {
          "uuid": "comp-001",
          "component_id": "js.section",
          "inputs": { "width": "Normal" },
          "parent_uuid": null,
          "slot": null
        },
        {
          "uuid": "comp-002",
          "component_id": "js.heading",
          "inputs": { "text": "Welcome", "level": "h2" },
          "parent_uuid": "comp-001",
          "slot": "content"
        }
      ]
    }
  }
}
```

### Component fields

| Field          | Description                                                              |
| -------------- | ------------------------------------------------------------------------ |
| `uuid`         | Unique identifier for this component instance. Generate before creation. |
| `component_id` | Component type (e.g., `js.heading`, `js.card`)                           |
| `inputs`       | Object containing prop values matching component.yml                     |
| `parent_uuid`  | UUID of parent component (`null` for root-level)                         |
| `slot`         | Slot name in parent (`null` for root-level, e.g., `"content"`)           |

Root-level components have `parent_uuid: null` and `slot: null`. Child
components reference their parent's UUID and the slot name they occupy.

## Input format reference

**Always read `component.yml` before composing inputs.** The prop type in
`component.yml` determines how the value must be formatted in the JSON:API
request body.

| component.yml type                                | JSON input format          | Example                                                            |
| ------------------------------------------------- | -------------------------- | ------------------------------------------------------------------ |
| `type: string` (plain)                            | Plain string               | `"heading": "Hello"`                                               |
| `type: string` with `contentMediaType: text/html` | Formatted text object      | `"text": {"value": "<p>Hello</p>", "format": "canvas_html_block"}` |
| `type: string` with `format: uri-reference`       | Plain string (path or URL) | `"link": "/about"`                                                 |
| `type: object` with `$ref: .../image`             | target_id object (string)  | `"image": {"target_id": "31"}`                                     |
| `type: string` with `enum`                        | Exact enum value string    | `"layout": "left"`                                                 |
| `type: boolean`                                   | Boolean                    | `"visible": true`                                                  |
| `type: integer` / `type: number`                  | Number                     | `"count": 3`                                                       |

## Media upload

Images must be uploaded to the media library before referencing them in
components. The workflow is:

1. Upload the file binary to create a file entity
2. Create a media entity referencing the file
3. Use the media entity's internal ID as `target_id` in component inputs

The `target_id` must be the **media entity's internal ID** (visible in the media
entity's `resourceVersion` or self link), not the underlying file entity's
`drupal_internal__target_id`.

### Referencing images in components

```json
{
  "component_id": "js.card",
  "inputs": {
    "heading": "My Card",
    "image": { "target_id": "31" },
    "text": { "value": "<p>Content</p>", "format": "canvas_html_block" }
  }
}
```

## Common pitfalls

1. **`target_id` must be a string.** Image references use `"target_id": "31"`
   (string), not `"target_id": 31` (integer). Using an integer may cause type
   errors or silent failures.

2. **Link props are plain strings, not objects.** Link/URL props
   (`format: uri-reference`) must be plain strings like `"/about"`. Do NOT use
   Drupal's link field format `{"uri": "/about", "options": []}` — that is for
   Drupal entity reference fields, not Canvas component inputs.

   ```json
   // Correct
   "link": "/services"

   // Wrong — will cause errors
   "link": { "uri": "/services", "options": [] }
   ```

3. **Formatted text needs the wrapper object.** Any prop with
   `contentMediaType: text/html` in component.yml must use the formatted text
   object. A plain string will cause rendering failures or empty output.

   ```json
   // Correct
   "text": { "value": "<p>Content here</p>", "format": "canvas_html_block" }

   // Wrong — plain string for an HTML field
   "text": "Content here"
   ```

4. **Media entity ID vs file entity ID.** When uploading images, there are two
   internal IDs. The file entity has `drupal_internal__target_id` in its
   relationships. The media entity has a separate internal ID. Always use the
   **media** entity's ID in component inputs — using the file ID causes
   "image.src NULL value found" errors.

5. **JSON:API read-only mode.** If all write operations return HTTP 405, the
   JSON:API is configured for read-only. Enable write operations in Drupal admin
   or via drush.

6. **Omit `langcode` on create.** When creating entities, omit the `langcode`
   field — the API may reject it with permission errors.
