---
name: canvas-data-fetching
description:
  Fetch and manage Drupal content via JSON:API. Use when building content lists,
  composing pages programmatically, uploading media, or querying entities with
  SWR.
compatibility:
  Requires .env with CANVAS_SITE_URL, CANVAS_CLIENT_ID, CANVAS_CLIENT_SECRET
---

# Data Fetching

## Reading content with SWR + JSON:API

Use `JsonApiClient` from `drupal-canvas` with `DrupalJsonApiParams` for query
building and SWR for caching/revalidation.

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
```

**Do not mock JSON:API resources in Storybook.** Components that fetch data will
display their loading or empty states in Storybook.

### Including relationships

Use `addInclude` for related entities and `addFields` to limit the response:

```jsx
const params = new DrupalJsonApiParams();
params.addSort("created", "DESC");
params.addInclude(["field_category", "field_image"]);
params.addFields("node--article", [
  "title",
  "created",
  "field_category",
  "field_image",
]);
params.addFields("taxonomy_term--categories", ["name"]);
params.addFields("file--file", ["uri", "url"]);
```

**Avoid circular references.** Do not include self-referential fields (e.g.,
`field_related_articles` on an article query). SWR deep-equality checks fail
with "too much recursion" on circular data. Fetch same-type related content in a
separate query.

## Building content list components

### Setup gate

Before any JSON:API discovery, verify connectivity:

1. Check `.env` exists with `CANVAS_SITE_URL`. Read `CANVAS_JSONAPI_PREFIX` if
   present; default to `jsonapi`.
2. Send HTTP request to `{CANVAS_SITE_URL}/{CANVAS_JSONAPI_PREFIX}`. Success =
   HTTP 200.
3. If unsuccessful or values missing, ask the user whether to configure
   connectivity now or proceed with static content.
4. Do not modify Vite config to troubleshoot connectivity.

### Workflow

1. **Analyze the list structure** -- what fields, sort order, filters, and
   pagination does the design require?
2. **Identify or request the content type** -- verify via JSON:API that a
   matching content type exists. If not, stop and prompt the user to create one
   with a suggested name and field structure.
3. **Build the component** -- only use fields verified to exist on the content
   type.

### Handling filters

Do not hardcode filter options. Fetch available options dynamically via JSON:API
(e.g., all taxonomy terms in a vocabulary) so filters stay in sync with content.

## Write operations

When creating, updating, or deleting entities, or uploading media, read
[references/crud-operations.md](references/crud-operations.md) for fetch()
patterns and the media upload workflow.

## Page component structure

When composing page component trees (flat array with `parent_uuid`/`slot`
nesting), read [references/page-structure.md](references/page-structure.md) for
the JSON structure and field definitions.

## Input format reference

When mapping `component.yml` prop types to JSON:API input values, read
[references/input-formats.md](references/input-formats.md) for the
type-to-format conversion table.

## Common pitfalls

1. **`target_id` must be a string.** Image references use `"target_id": "31"`
   (string), not `"target_id": 31` (integer). Integer causes type errors or
   silent failures.

2. **Link props are plain strings, not objects.** Props with
   `format: uri-reference` must be plain strings like `"/about"`. Do NOT use
   `{"uri": "/about", "options": []}`.

3. **Formatted text needs the wrapper object.** Props with
   `contentMediaType: text/html` require
   `{"value": "<p>...</p>", "format": "canvas_html_block"}`. A plain string
   causes rendering failures.

4. **Media entity ID vs file entity ID.** Always use the **media** entity's
   internal ID in component inputs, not the file entity's
   `drupal_internal__target_id`. Wrong ID causes "image.src NULL value found"
   errors.

5. **JSON:API read-only mode.** HTTP 405 on writes means read-only mode. Enable
   via `drush config:set jsonapi.settings read_only false -y`.

6. **Omit `langcode` on create.** The API may reject it with permission errors.
