# Page Component Structure

Pages in Canvas contain a `components` attribute — a flat array where nesting is
encoded via `parent_uuid` and `slot` fields.

## Example

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

## Component fields

| Field          | Description                                                              |
| -------------- | ------------------------------------------------------------------------ |
| `uuid`         | Unique identifier for this component instance. Generate before creation. |
| `component_id` | Component type (e.g., `js.heading`, `js.card`)                           |
| `inputs`       | Object containing prop values matching component.yml                     |
| `parent_uuid`  | UUID of parent component (`null` for root-level)                         |
| `slot`         | Slot name in parent (`null` for root-level, e.g., `"content"`)           |

Root-level components have `parent_uuid: null` and `slot: null`. Child
components reference their parent's UUID and the slot name they occupy.
