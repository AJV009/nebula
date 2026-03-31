---
name: nebula-storybook-stories
description:
  Create Storybook stories for Canvas components. Use when (1) Creating a new
  component that needs a story, (2) Adding or modifying component stories, (3)
  Verifying story files exist, (4) Organizing stories for larger projects.
  Covers CSF3 format, argTypes, decorators, atomic design hierarchy, asset
  management, and test stories.
---

**CRITICAL: Every component MUST have an individual story file.**

Each component in `src/components/` requires a corresponding story file in
`src/stories/`. The story file:

- Must be named `<component-name>.stories.jsx` (kebab-case with hyphens)
- Must import the component from `@/components/<component-name>`
- Must showcase the component's props and variants

**Example structure:**

```
src/components/my-card/
├── index.jsx
└── component.yml

src/stories/my-card.stories.jsx  # Required story file for my-card component
```

## Name mapping

Use this canonical mapping for component/story naming:

- `component.yml machineName`: `my-card`
- Component folder: `src/components/my-card/`
- Component import: `@/components/my-card`
- Story file: `src/stories/my-card.stories.jsx`

**Story file requirements:**

- Use Storybook CSF3 format (object-based stories).
- Include `argTypes` for props with predefined options (like enums).
- Create multiple story exports to showcase different variants.
- Use decorators when components need specific backgrounds (e.g., dark
  backgrounds for light-colored components).

After creating components, verify story files exist:

```bash
# List all story files
ls src/stories/*.stories.jsx

# Verify a specific component has its story
ls src/stories/<component-name>.stories.jsx
```

## Organizing with Atomic Design (recommended for larger projects)

For projects with many components (15+) or when building full page compositions,
organize stories using an Atomic Design hierarchy. This groups components by
structural complexity and makes the Storybook sidebar navigable.

**This is optional.** For small projects with a few components, the flat
`src/stories/<name>.stories.jsx` structure works fine. Adopt atomic design when
the flat list becomes hard to navigate.

### Folder structure

```
src/stories/
├── atoms/            # smallest building blocks
│   ├── button.stories.jsx
│   ├── heading.stories.jsx
│   ├── text.stories.jsx
│   ├── image.stories.jsx
│   └── spacer.stories.jsx
├── molecules/        # combinations of atoms
│   ├── card.stories.jsx
│   ├── blockquote.stories.jsx
│   └── breadcrumb.stories.jsx
├── organisms/        # complex UI sections
│   ├── hero.stories.jsx
│   ├── card-container.stories.jsx
│   ├── header.stories.jsx
│   └── footer.stories.jsx
├── example-pages/    # full page compositions (see nebula-page-stories)
│   └── home.stories.jsx
└── tests/            # interactive test stories
    └── slot-testing.stories.jsx
```

### Title convention

Use the level name as a title prefix to group stories in the sidebar:

```jsx
// Atoms
export default { title: "Atoms/Button", component: Button };

// Molecules
export default { title: "Molecules/Card", component: Card };

// Organisms
export default { title: "Organisms/Hero", component: Hero };
```

### Classification guide

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

## Story assets

Store shared story assets in `src/stories/assets/` with a barrel export for
clean imports:

```
src/stories/assets/
├── hero-bg.jpg
├── logo.svg
├── team-photo.jpg
└── index.js
```

```js
// src/stories/assets/index.js
export { default as heroBg } from "./hero-bg.jpg";
export { default as logo } from "./logo.svg";
export { default as teamPhoto } from "./team-photo.jpg";
```

Then import in stories:

```jsx
import { heroBg, logo } from "../assets";
```

For placeholder images when real assets aren't available, use
`https://placehold.co/<width>x<height>` URLs directly in story args.

## Test stories

Stories that exist for testing specific behaviors (not component documentation)
go in the `Tests/` category with auto-docs disabled:

```jsx
export default {
  title: "Tests/Slot Testing",
  parameters: {
    docs: { disable: true },
  },
};

export const EmptySlots = {
  render: () => <Section />,
};

export const NestedSlots = {
  render: () => <Section content={<Card heading="Nested" />} />,
};
```

Use test stories for: slot composition testing, responsive behavior
verification, edge cases (very long text, missing props), and interactive state
testing.
