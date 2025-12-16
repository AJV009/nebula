# Requirements for creating or modifying components

**Always study `examples/` first and follow their patterns.**

## Technology stack

- React 19;
- Tailwind CSS 4.1+;
- class-variance-authority (CVA) for component variants;
- `clsx` and `tailwind-merge` via the `cn()` utility;
- `FormattedText` component from `@/lib/FormattedText` for rendering HTML
  content.

## Component patterns

- Use CVA (`cva()`) to define variant styles for components.
- Use the `cn()` utility from `@/lib/utils` to merge class names.
- Always export components as default exports.
- Accept a `className` prop for style customization.
- Use the `@/components` import alias when importing other components.
- Only use dependencies listed in the technology stack; do not add third-party
  imports or create new library utilities.
- Place each component in its own folder under `src/components/` with an
  `index.jsx` and `component.yml` file. Do not create nested folder structures.

## Styling conventions

- Use Tailwind's theme colors (`primary-*`, `gray-*`) defined in `global.css`.
- Avoid hardcoded color values; use theme tokens instead.
- Follow the existing focus, hover, and active state patterns from examples.

## Color props must use variants, not color codes

**Never create props that allow users to pass color codes** (hex values, RGB,
HSL, or any raw color strings). Instead, define a small set of human-readable
variants using CVA that map to the design tokens in `global.css`.

**Always check `global.css` for available design tokens.** The tokens defined
there (such as `primary-*`, `gray-*`, etc.) are the source of truth for color
values in this project.

**Wrong - allowing raw color values:**

```yaml
# ❌ BAD: Allows arbitrary color codes as prop values
props:
  properties:
    backgroundColor:
      title: Background Color
      type: string
      examples:
        - "#3b82f6"
```

```jsx
// ❌ BAD: Uses inline style with raw color value
const Card = ({ backgroundColor }) => (
  <div style={{ backgroundColor }}>{/* ... */}</div>
);
```

**Correct - using CVA variants with design tokens:**

```yaml
# ✅ GOOD: Offers curated color scheme options
props:
  properties:
    colorScheme:
      title: Color Scheme
      type: string
      enum:
        - default
        - primary
        - muted
        - dark
      meta:enum:
        default: Default (White)
        primary: Primary (Blue)
        muted: Muted (Light Gray)
        dark: Dark
      examples:
        - default
```

```jsx
// ✅ GOOD: Uses CVA variants mapped to design tokens
import { cva } from "class-variance-authority";

const cardVariants = cva("rounded-lg p-6", {
  variants: {
    colorScheme: {
      default: "bg-white text-black",
      primary: "bg-primary-600 text-white",
      muted: "bg-gray-100 text-gray-700",
      dark: "bg-gray-900 text-white",
    },
  },
  defaultVariants: {
    colorScheme: "default",
  },
});

const Card = ({ colorScheme, children }) => (
  <div className={cardVariants({ colorScheme })}>{children}</div>
);
```

This approach ensures:

- Consistent colors across the design system
- Users select from curated, meaningful options (not arbitrary values)
- Easy theme updates by modifying `global.css` tokens
- Better accessibility through tested color combinations

## Storybook stories

**CRITICAL: Every component MUST have an individual story file.**

Each component in `src/components/` requires a corresponding story file in
`src/stories/`. The story file:

- Must be named `<component-name>.stories.jsx` (kebab-case with hyphens)
- Must import the component from `@/components/<component_name>`
- Must showcase the component's props and variants

**Example structure:**

```
src/components/my_card/
├── index.jsx
└── component.yml

src/stories/my-card.stories.jsx  # Required story file for my_card component
```

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

### Page stories

Page stories showcase how components work together in realistic layouts.

**Page story location and naming:**

- Page stories MUST be placed in `src/stories/example-pages/`
- Page story files should be named `<page-name>.stories.jsx`
- The Storybook title MUST use this format: `title: "Example pages/[Title]"`

Example:

```jsx
// src/stories/example-pages/saas-home.stories.jsx
export default {
  title: "Example pages/SaaS Home",
  component: SaaSHomePage,
  parameters: {
    layout: "fullscreen",
  },
};
```

- When creating new components, consider adding them to existing page stories if
  they fit naturally, or create new page stories to demonstrate the component in
  context.
- When modifying existing components, review page stories in
  `src/stories/example-pages/` to ensure changes work well in composed layouts
  and update them if needed.

**CRITICAL: Page stories must only IMPORT and COMPOSE components.**

Page stories should:

- Import components from `@/components/<component_name>`
- Pass props and compose components together
- Define sample data (strings, objects, arrays) for component props

Page stories must NOT:

- Define reusable React components inline (these belong in `src/components/`)
- Contain component logic that should be extracted to a proper component
- Duplicate component code that already exists

**Wrong - defining components inline in a story:**

```jsx
// ❌ BAD: This component should be in src/components/logo/index.jsx
const Logo = ({ color }) => (
  <div className="flex items-center">
    <svg>...</svg>
    <span style={{ color }}>Brand Name</span>
  </div>
);

const Page = () => (
  <div>
    <Logo color="#000" />
  </div>
);
```

**Correct - importing components:**

```jsx
// ✅ GOOD: Import the component from src/components/
import Logo from "@/components/logo";

const Page = () => (
  <div>
    <Logo color="#000" />
  </div>
);
```

If you find yourself defining a reusable UI element in a story, stop and create
it as a proper component in `src/components/` first.
