# CRUD Operations & Media Upload

## Prerequisites

JSON:API must have write mode enabled. Drupal defaults to read-only. If write
operations return HTTP 405, enable writes in Drupal admin or via drush:

```sh
drush config:set jsonapi.settings read_only false -y
```

## Create an entity

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
          /* component tree — see page-structure.md */
        ],
      },
    },
  }),
});
```

## Update an entity

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

## Delete an entity

```js
await fetch(`${siteUrl}/${jsonapiPrefix}/node/page/${uuid}`, {
  method: "DELETE",
  headers: {
    Accept: "application/vnd.api+json",
    Authorization: `Bearer ${token}`,
  },
});
```

## Media upload

Images must be uploaded to the media library before referencing them in
components:

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
