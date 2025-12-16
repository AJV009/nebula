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

## Copying existing example components

When the user asks to add a component and a matching or similar example already
exists in `examples/components/`, copy the example directly instead of creating
from scratch. Before copying, analyze dependencies and ensure all required
components are present.

**Workflow for copying example components:**

1. **Check for existing example:** If the requested component (e.g., "hero")
   exists in `examples/components/`, plan to copy it directly.

2. **Analyze dependencies:** Read the example component's `index.jsx` file and
   identify all `@/components/<name>` imports. These are component dependencies.

3. **Recursively discover nested dependencies:** For each dependency found,
   check its `index.jsx` for additional `@/components/<name>` imports. Continue
   until all dependencies are discovered. For example, `hero` imports
   `two_column_text`, which imports `heading` and `text`.

4. **Check what already exists:** List the contents of `src/components/` to see
   which components are already present.

5. **Copy only missing components:** Copy only the example components (and their
   stories) that don't already exist in `src/components/`. Do NOT overwrite
   existing components.

**Example scenario:** User asks for a "hero" component.

```bash
# Step 1: Check existing components in src/
ls src/components/

# Suppose output shows only: button/  global.css

# Step 2: Analyze hero dependencies (hero → two_column_text → heading, text)
# Missing components: hero, two_column_text, heading, text
# button already exists, so skip it if it were a dependency

# Step 3: Copy all missing components and stories in one batch
cp -r examples/components/hero src/components/
cp -r examples/components/two_column_text src/components/
cp -r examples/components/heading src/components/
cp -r examples/components/text src/components/

cp examples/stories/hero.stories.jsx src/stories/
cp examples/stories/two-column-text.stories.jsx src/stories/
cp examples/stories/heading.stories.jsx src/stories/
cp examples/stories/text.stories.jsx src/stories/
```

**Important rules:**

- Never overwrite components that already exist in `src/components/`.
- Always copy the corresponding story file for each component.
- After copying, the components are ready to use—no modifications needed unless
  the user specifically requests changes.
- If the user wants to customize a copied component, make those modifications
  after the copy is complete.

**Identifying component imports:** Component dependencies are identified by
import statements matching this pattern:

```jsx
import ComponentName from "@/components/component_name";
```

Only imports from `@/components/` are component dependencies. Ignore imports
from:

- `@/lib/` (library utilities)
- `react` or other npm packages
- `class-variance-authority`, `clsx`, etc.

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
