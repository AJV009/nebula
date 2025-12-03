# Drupal Canvas Code Components rules and best practices

# Project structure

This project uses a two-folder structure to separate example code from working
code:

```
src/
├── components/     # Your working components (Storybook reads from here)
│   └── global.css  # Base styles imported by Storybook
├── stories/        # Your working stories (Storybook reads from here)
└── lib/            # Library utilities and mocks

examples/
├── components/     # Example component implementations (for reference)
└── stories/        # Example stories (for reference)
```

# Package manager

Detect the package manager by checking for lock files in the project root:

- `package-lock.json` → npm (`npm run`, `npx`)
- `yarn.lock` → yarn (`yarn`, `yarn dlx`)
- `pnpm-lock.yaml` → pnpm (`pnpm`, `pnpm dlx`)
- `bun.lockb` → bun (`bun run`, `bunx`)

Use the detected package manager for all commands in these instructions.

# Creating new components

**Always start from an example.** When asked to create a new component:

1. Browse `examples/components/` to find a similar component that can serve as a
   starting point (e.g., use `blockquote` as a base for an "alert" component, or
   `button` for any interactive element)
2. Copy the example component folder to `src/components/<new_name>/`
3. Copy the corresponding story from `examples/stories/` to `src/stories/`
4. Modify the copied files to implement the new component

**CRITICAL: Every component MUST have its own individual story file.** When
copying from examples, always copy both the component folder AND its
corresponding story file. The story file naming convention is
`<component-name>.stories.jsx` (using kebab-case with hyphens).

This approach ensures consistent patterns for `component.yml` structure, JSX
conventions, and Storybook story format across all components.

**Example:** To create a new "Alert" component based on the Blockquote example:

```bash
cp -r examples/components/blockquote src/components/alert
cp examples/stories/blockquote.stories.jsx src/stories/alert.stories.jsx
```

Then modify the copied files to implement the Alert component.

Components use the `@/components` import alias, which points to
`src/components`. When you copy and modify examples, the imports will work
automatically.

## Required component folder structure

**CRITICAL:** Every component folder in `src/components/` MUST contain exactly
two files:

```
src/components/<component_name>/
├── index.jsx      # React component source code (REQUIRED)
└── component.yml  # Component metadata and props (REQUIRED)
```

**Never create a component folder without both files.** The `index.jsx` contains
the actual React component implementation. The `component.yml` defines the
component's metadata, props, and slots for Drupal Canvas.

The directory name must match machineName. The component folder name must
exactly match the `machineName` value defined in `component.yml`. Use
`kebab-case` (with hyphens) as the preferred format, though `snake_case` is also
supported.

After creating components, verify the folder structure:

```bash
# List all component folders and their contents
ls -la src/components/*/

# Verify each new component has both required files
ls src/components/<component_name>/index.jsx
ls src/components/<component_name>/component.yml
```

If a component folder is missing either file, the component is incomplete and
will not work. Both `index.jsx` and `component.yml` are required.

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

# Validating changes

After creating or modifying components, always validate your code by running the
`code:fix` script. Make sure to use the right package manager. For example, if
using npm, run the following command:

```bash
npm run code:fix
```

This command runs Prettier and ESLint with auto-fix enabled, ensuring consistent
formatting, common issues, and Drupal Canvas Code Component requirements. Run
this before considering any component work complete.

If the command reports errors that couldn't be automatically fixed, address them
manually in the code and re-run the command until it passes without errors.

# Uploading components

When component work is complete and validated, ask the user if they would like
to upload the modified components to Canvas. Make sure to use the right package
manager. For example, if using npm, run the following command:

```bash
npm run canvas -- upload -c component1,component2,component3
```

Replace `component1,component2,component3` with the actual component names that
were created or modified (e.g., `canvas upload -c button,card,hero`).

# Component metadata files (`component.yml`)

Each component requires a `component.yml` file that defines its metadata, props,
and slots.

## File structure

Every `component.yml` must include these top-level keys:

```yaml
name: Component Name # Human-readable display name
machineName: component_name # Machine name in snake_case
status: true # Whether the component is enabled
required: [] # Array of required prop names
props:
  properties:
    # ... prop definitions
slots: [] # Array of slot definitions or empty
```

**Props must have title and examples.**

Every prop definition must include a `title` for the UI label. The `examples`
array is required for required props and recommended for all others. Only the
first example value is used by Drupal Canvas.

```yaml
props:
  properties:
    heading:
      title: Heading
      type: string
      examples:
        - Enter a heading...
```

**Prop IDs must be camelCase versions of their titles.**

The prop ID (the key under `properties`) must be the camelCase conversion of the
`title` value.

```yaml
# Correct - prop ID is camelCase of title
props:
  properties:
    buttonText:           # camelCase of "Button Text"
      title: Button Text
      type: string
    backgroundColor:      # camelCase of "Background Color"
      title: Background Color
      type: string
    isVisible:            # camelCase of "Is Visible"
      title: Is Visible
      type: boolean

# Wrong - prop IDs don't match titles
props:
  properties:
    btn_text:             # should be "buttonText" for title "Button Text"
      title: Button Text
    bgColor:              # should be "backgroundColor" for title "Background Color"
      title: Background Color
```

## Prop types

### Text

Basic text input. Stored as a string value.

```yaml
type: string
examples:
  - Hello, world!
```

### Formatted text

Rich text content with HTML formatting support, displayed in a block context.

```yaml
type: string
contentMediaType: text/html
x-formatting-context: block
examples:
  - <p>This is <strong>formatted</strong> text with HTML.</p>
```

### Link

URL or URI reference for links to internal or external resources.

```yaml
type: string
format: uri-reference
examples:
  - https://example.com
```

**Note:** The format can be either `uri` (accepts only absolute URLs) or
`uri-reference` (accepts both absolute and relative URLs).

### Image

Reference to an image object with metadata like alt text, dimensions, and file
URL. Only the file URL is required to exist, all other metadata is always
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

### Video

Reference to a video object with metadata like dimensions and file URL. Only the
file URL is required to exist, all other metadata is always optional.

```yaml
type: object
$ref: json-schema-definitions://canvas.module/video
examples:
  - src: https://media.istockphoto.com/id/1340051874/video/aerial-top-down-view-of-a-container-cargo-ship.mp4?s=mp4-640x640-is&k=20&c=5qPpYI7TOJiOYzKq9V2myBvUno6Fq2XM3ITPGFE8Cd8=
    poster: https://example.com/600x400.png
```

### Boolean

True or false value.

```yaml
type: boolean
examples:
  - false
```

### Integer

Whole number value without decimal places.

```yaml
type: integer
examples:
  - 42
```

### Number

Numeric value that can include decimal places.

```yaml
type: number
examples:
  - 3.14
```

### List: text

A predefined list of text options that the user can select from.

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

### List: integer

A predefined list of integer options that the user can select from.

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

## Enum value naming

Enum values must use lowercase, machine-friendly identifiers. Use `meta:enum` to
provide human-readable display labels for the UI.

**Note:** Enum values cannot contain dots.

```yaml
# Correct
enum:
  - left_aligned
  - center_aligned
meta:enum:
  left_aligned: Left aligned
  center_aligned: Center aligned
examples:
  - left_aligned

# Wrong - using display labels as enum values
enum:
  - Left aligned
  - Center aligned
```

The `examples` value must be the enum value, not the display label.

### Enum values must match JSX component variants

When using class-variance-authority (CVA) or similar libraries in the JSX
component, the variant keys must exactly match the enum values defined in
`component.yml`.

```jsx
// component.yml defines: enum: [left_aligned, center_aligned]
// CVA variants must match:
const variants = cva("base-classes", {
  variants: {
    layout: {
      left_aligned: "text-left", // matches enum value
      center_aligned: "text-center", // matches enum value
    },
  },
});
```

## Slots

Slots allow other components to be embedded within a component. In React, slots
are received as props containing the rendered children.

```yaml
slots:
  content:
    title: Content
  buttons:
    title: Buttons
```

In the JSX component, slots are destructured as props and rendered directly:

```jsx
const Section = ({ width, content }) => {
  return <div className={sectionVariants({ width })}>{content}</div>;
};
```

Use an empty array when the component has no slots:

```yaml
slots: []
```
