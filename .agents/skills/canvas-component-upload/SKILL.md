---
name: canvas-component-upload
description:
  Upload validated components to Drupal Canvas with a pre-upload validation
  pipeline and post-upload verification. Use after component work is complete.
  Covers preflight checks (lint, validate, SSR test), upload execution, failure
  recovery, and verification in the Canvas Code Editor.
---

## Upload to Canvas

Before uploading, confirm the user has Drupal Canvas CLI installed and
configured for their target site.

### Setup gate

Before running any upload command:

1. Check that a `.env` file exists in the project root.
2. If `.env` exists, verify these values are set:
   - `CANVAS_SITE_URL`
   - `CANVAS_CLIENT_ID`
   - `CANVAS_CLIENT_SECRET`
3. If `.env` is missing, or any required value is missing, **stop** and ask the
   user to complete setup first.
4. **Do not guess setup steps**. Point the user to the official docs:
   - Drupal Canvas OAuth module setup:
     <https://git.drupalcode.org/project/canvas/-/tree/1.x/modules/canvas_oauth#2-setup>
   - Drupal Canvas CLI package/docs:
     <https://www.npmjs.com/package/@drupal-canvas/cli>
5. Continue only after the user confirms setup is complete.

## Pre-upload validation

Run these checks in order before uploading. Each catches different issues and
saves time compared to debugging failures after upload.

### 1. Fix formatting and linting

```bash
npm run code:fix
```

Auto-fixes Prettier formatting, ESLint issues, and import ordering. If issues
remain after the fix, resolve them manually before continuing.

### 2. Validate component metadata

```bash
npx canvas validate
```

Validates all `component.yml` files against the Canvas schema. Common failures:

- Missing `title` on props
- Missing `examples` on required props
- `machineName` doesn't match folder name
- Invalid prop type
- `className` included in metadata (composition-only, not a declared prop)

### 3. Test server-side rendering

```bash
npx canvas ssr-test
```

Renders each component in a Node.js environment (no browser). Catches:

- Runtime errors (undefined variables, null access on optional props)
- Missing imports
- Browser-only APIs used without guards (`window`, `document`)
- Components that crash with default/example prop values

If SSR fails, the component will crash in Canvas — fix before uploading.

### 4. Verify in Storybook

Before uploading, open Storybook and verify components render correctly with
realistic content. Check:

- Components render actual content, not empty states or placeholders
- Images load correctly (not broken references)
- Slots accept and render children
- All theme variants produce distinct visual output
- Desktop and mobile viewports both work

### Preflight convenience script

Optionally add a combined preflight script to `package.json`:

```json
{
  "scripts": {
    "canvas:preflight": "npm run code:fix && npx canvas validate && npx canvas ssr-test"
  }
}
```

Then run `npm run canvas:preflight` before every upload.

## Run upload

When pre-upload validation passes, ask the user if they would like to upload the
modified components to Canvas. Make sure to use the right package manager. For
example, if using npm, run the following command:

```bash
npx canvas upload -c component1,component2,component3 -y
```

Replace `component1,component2,component3` with the actual component names that
were created or modified (e.g., `canvas upload -c button,card,hero`).

## Handling upload failures

Default behavior: **always retry failed uploads** unless the error is clearly a
connection/setup failure.

Retry uploads when the failure indicates the Canvas app connection is already
working (for example, dependency/order-related component errors). Do **not**
retry connection/setup failures.

### Connection/setup failures: Stop, do not retry

If upload fails with authentication, authorization, or network/connection
errors, stop and ask the user to complete or verify setup first. This includes
errors like invalid credentials, unauthorized/forbidden responses, DNS issues,
connection refused, host unreachable, request timeout before reaching Canvas, or
TLS/SSL handshake/certificate failures.

Point the user to the official setup docs:

- Drupal Canvas OAuth module setup:
  <https://git.drupalcode.org/project/canvas/-/tree/1.x/modules/canvas_oauth#2-setup>
- Drupal Canvas CLI package/docs:
  <https://www.npmjs.com/package/@drupal-canvas/cli>

Ask them to verify and update `.env` values (`CANVAS_SITE_URL`,
`CANVAS_CLIENT_ID`, `CANVAS_CLIENT_SECRET`) and OAuth/CLI setup, then retry the
upload only after they confirm setup updates are complete.

### Dependency-related failures

When uploading multiple new components where one component depends on another
(e.g., `hero` imports `heading`), the upload may fail with a message indicating
that a component doesn't exist. This happens when a component that includes
another gets uploaded before its dependency.

**This is expected behavior.** Simply retry the upload command. On subsequent
attempts, the dependencies that were successfully uploaded in the previous run
will already exist, allowing the dependent components to upload successfully.

Example scenario:

1. First upload attempt: `hero` fails because `heading` doesn't exist yet, but
   `heading` uploads successfully.
2. Second upload attempt: `hero` now succeeds because `heading` exists.

If uploads continue to fail after multiple retries, check that all dependency
components are included in the upload command.

## Post-upload verification

After a successful upload, verify each component in the Canvas Code Editor:

```
<CANVAS_SITE_URL>/canvas/code-editor/component/<machine-name>
```

Check that:

- The component appears in the component list
- The props panel shows the correct fields from `component.yml`
- The preview renders without errors
- The source code tab shows the uploaded version

If a component doesn't appear after upload, verify that the `machineName` in
`component.yml` matches the component folder name exactly.
