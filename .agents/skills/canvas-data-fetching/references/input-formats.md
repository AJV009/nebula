# Input Format Reference

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
