---
name: nebula-storybook-stories
description:
  Create Storybook stories for Canvas components. Use when creating a new
  component, adding variants, or organizing stories for larger projects. Covers
  CSF3 format, argTypes, decorators, atomic design hierarchy, and story assets.
---

**CRITICAL: Every component MUST have an individual story file.**

Each component in `src/components/` requires a corresponding story in
`src/stories/`. Story files are named `<component-name>.stories.jsx`
(kebab-case), importing from `@/components/<component-name>`.

**Story pattern:**

```jsx
import Card from "@/components/card";

export default {
  title: "Molecules/Card",
  component: Card,
  argTypes: {
    variant: { options: ["default", "featured"], control: "select" },
  },
};

export const Default = { args: { heading: "Card Title" } };
export const Featured = { args: { heading: "Featured", variant: "featured" } };
```

- Include `argTypes` for props with predefined options (enums).
- Create multiple exports to showcase variants.
- Use decorators when components need specific backgrounds (e.g., dark bg for
  light-colored components).

## Atomic design organization

For projects with many components (15+), organize stories into atomic design
subfolders. For small projects, the flat `src/stories/` structure works fine.

### Classification

| Level    | Description                            | Examples                                          |
| -------- | -------------------------------------- | ------------------------------------------------- |
| Atom     | Single-purpose, no child components    | button, heading, text, image, spacer, logo, video |
| Molecule | Combines 2-3 atoms into a unit         | card, blockquote, search form, breadcrumb         |
| Organism | Complex section with multiple children | hero, card container, header, footer, navigation  |
| Template | Page layout wrapper                    | PageLayout (see `nebula-page-stories`)            |
| Page     | Full page composition                  | Home, About (see `nebula-page-stories`)           |
| Test     | Stories for testing behaviors          | Slot testing, responsive testing                  |

**How to classify:** If the component imports and renders other components from
`@/components/`, it's at least a molecule. If it composes multiple molecules
into a page section, it's an organism. If it stands alone with no child
component imports, it's an atom.

### Folder structure and title convention

Place stories in `src/stories/<level>/` and prefix titles with the level name:

```
src/stories/
├── atoms/            # title: "Atoms/Button"
├── molecules/        # title: "Molecules/Card"
├── organisms/        # title: "Organisms/Hero"
├── example-pages/    # see nebula-page-stories
└── tests/            # title: "Tests/Slot Testing"
```

## Story assets

Store shared assets in `src/stories/assets/` with a barrel export:

```js
// src/stories/assets/index.js
export { default as heroBg } from "./hero-bg.jpg";
export { default as logo } from "./logo.svg";
```

```jsx
import { heroBg, logo } from "../assets";
```

For placeholders, use `https://placehold.co/<width>x<height>` URLs directly in
story args.

## Test stories

Stories for testing behaviors (not component documentation) go in `Tests/` with
auto-docs disabled:

```jsx
export default {
  title: "Tests/Slot Testing",
  parameters: { docs: { disable: true } },
};

export const EmptySlots = {
  render: () => <Section />,
};

export const NestedSlots = {
  render: () => <Section content={<Card heading="Nested" />} />,
};
```

Use test stories for: slot composition, responsive behavior, edge cases (long
text, missing props), and interactive state testing.
