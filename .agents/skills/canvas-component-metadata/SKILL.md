---
name: canvas-component-metadata
description:
  Define component.yml metadata and handle props defensively at runtime. Use
  when creating components, adding props/slots, troubleshooting prop errors, or
  guarding against null props.
---

## File structure

Every `component.yml` must include these top-level keys:

```yaml
name: Component Name
machineName: component-name
status: true
required: []
props:
  properties:
    # ... prop definitions
slots: [] # [] when no slots; otherwise an object map
```

## Props

### Rules

- Every prop needs a `title`. The `examples` array is required for required
  props, recommended otherwise. Only the first example value is used by Canvas.
- **Prop IDs must be camelCase of their title.** `buttonText` for "Button Text",
  `backgroundColor` for "Background Color".
- **Never include `className` in component.yml.** It is a composition prop for
  developers, not a Canvas editor control.
- Only include Canvas-editable props. Implementation-only React props stay in
  JSX only.
- If a prop is in `required`, do NOT add a fallback default in the JSX component
  signature. Required props must come from Canvas metadata/editor input.

```yaml
props:
  properties:
    heading:
      title: Heading
      type: string
      examples:
        - Enter a heading...
```

```jsx
// Correct: required prop has no fallback
const Hero = ({ heading }) => <h1>{heading}</h1>;

// Wrong: fallback masks missing required data
const Hero = ({ heading = "Default heading" }) => <h1>{heading}</h1>;
```

For prop type definitions and YAML examples (text, formatted text, link, image,
video, boolean, integer, number, list:text, list:integer), see
[references/prop-types.md](references/prop-types.md).

## Enums

- Values must be **lowercase, machine-friendly identifiers** (e.g.
  `left_aligned`).
- **No dots in enum values.**
- Use `meta:enum` for human-readable UI labels.
- `examples` must use the enum value, not the display label.

```yaml
enum:
  - left_aligned
  - center_aligned
meta:enum:
  left_aligned: Left aligned
  center_aligned: Center aligned
examples:
  - left_aligned
```

### CVA variants must match enum values exactly

```jsx
const variants = cva("base-classes", {
  variants: {
    layout: {
      left_aligned: "text-left",
      center_aligned: "text-center",
    },
  },
});
```

**Always provide `defaultVariants`** so the component doesn't break when an enum
prop is undefined:

```jsx
const styles = cva("base-class", {
  variants: {
    color: {
      primary: "bg-primary-600 text-white",
      secondary: "bg-gray-100 text-gray-900",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});
```

## Slots

This section is the slot schema source of truth. Other skills should reference
these rules.

- `slots` must be either an **object map** keyed by slot name, or **`[]`** when
  the component has no slots.
- Do not use arrays of slot objects.
- Do not map slots to `children`. If the slot key is `content`, consume it as
  `content` in JSX.
- Prefer explicit slot keys (`content`, `media`, `actions`) over `children`.
- Confirm slot usage with the user unless the use case is clearly compositional.

```yaml
slots:
  content:
    title: Content
  buttons:
    title: Buttons
```

```jsx
const Section = ({ width, content }) => (
  <div className={sectionVariants({ width })}>{content}</div>
);
```

### Slot minimum sizing

Empty slots in Canvas Editor are invisible without minimum dimensions, making
drag-and-drop impossible. Always add minimum sizing:

```jsx
// Wrong -- zero height, can't drop content
const Section = ({ content }) => <div>{content}</div>;

// Correct -- minimum size keeps empty slots interactive
const Section = ({ content }) => (
  <div className="min-h-8 min-w-32">{content}</div>
);
```

## Defensive prop handling

Any prop not in `required` can be null/undefined at runtime. Use `?.` and `&&`
guards for all optional props before accessing nested properties or rendering.

For null guard patterns per prop type and string-or-object dual format handling,
see [references/defensive-patterns.md](references/defensive-patterns.md). Load
this reference when implementing optional props in index.jsx.
