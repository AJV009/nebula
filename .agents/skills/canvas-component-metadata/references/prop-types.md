# Prop Type Definitions

YAML examples for each prop type supported in `component.yml`.

## Text

```yaml
type: string
examples:
  - Hello, world!
```

## Formatted text

Rich text with HTML, displayed in a block context.

```yaml
type: string
contentMediaType: text/html
x-formatting-context: block
examples:
  - <p>This is <strong>formatted</strong> text with HTML.</p>
```

## Link

`uri` accepts only absolute URLs. `uri-reference` accepts both absolute and
relative.

```yaml
type: string
format: uri-reference
examples:
  - /about/contact
```

**Do not use `#` as an example value** for `uri-reference` props -- it causes
validation failures during upload. Use realistic paths:

```yaml
# Correct
examples:
  - /resources
  - /about/team
  - https://example.com/page

# Wrong
examples:
  - "#"
  - ""
```

## Image

Reference to an image object. Only `src` is required; all other metadata is
optional.

```yaml
type: object
$ref: json-schema-definitions://canvas.module/image
examples:
  - src: >-
      https://images.unsplash.com/photo-1484959014842-cd1d967a39cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80
    alt: Woman playing the violin
    width: 1770
    height: 1180
```

## Video

Reference to a video object. Only `src` is required; all other metadata is
optional.

```yaml
type: object
$ref: json-schema-definitions://canvas.module/video
examples:
  - src: https://media.istockphoto.com/id/1340051874/video/aerial-top-down-view-of-a-container-cargo-ship.mp4?s=mp4-640x640-is&k=20&c=5qPpYI7TOJiOYzKq9V2myBvUno6Fq2XM3ITPGFE8Cd8=
    poster: https://example.com/600x400.png
```

## Boolean

```yaml
type: boolean
examples:
  - false
```

## Integer

Whole number, no decimals.

```yaml
type: integer
examples:
  - 42
```

## Number

Supports decimal places.

```yaml
type: number
examples:
  - 3.14
```

## List: text

Predefined text options. Pair with `meta:enum` for UI labels.

```yaml
type: string
enum:
  - option1
  - option2
  - option3
meta:enum:
  option1: Option 1
  option2: Option 2
  option3: Option 3
examples:
  - option1
```

## List: integer

Predefined integer options.

```yaml
type: integer
enum:
  - 1
  - 2
  - 3
meta:enum:
  1: Option 1
  2: Option 2
  3: Option 3
examples:
  - 1
```
