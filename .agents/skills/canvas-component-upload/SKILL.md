---
name: canvas-component-upload
description:
  Upload Canvas components with pre-upload validation and post-upload
  verification. Use when components are ready to deploy. Covers preflight checks
  (lint, validate, SSR test), Storybook visual verification, upload execution,
  dependency-order failure recovery, and Canvas Code Editor verification.
compatibility:
  Requires .env in project root with CANVAS_SITE_URL, CANVAS_CLIENT_ID,
  CANVAS_CLIENT_SECRET.
---

## Setup gate

Before running any upload command, verify `.env` exists in the project root with
`CANVAS_SITE_URL`, `CANVAS_CLIENT_ID`, and `CANVAS_CLIENT_SECRET` set. If
missing, stop and point the user to
<https://git.drupalcode.org/project/canvas/-/tree/1.x/modules/canvas_oauth#2-setup>
and <https://www.npmjs.com/package/@drupal-canvas/cli>. Continue only after the
user confirms setup is complete.

## Pre-upload validation pipeline

Run these checks in order. Each catches different issues and saves time compared
to debugging failures after upload.

### Preflight checklist

- [ ] Run `npm run code:fix` (formatting + linting)
- [ ] Run `npx canvas validate` (component.yml schema)
- [ ] Run `npx canvas ssr-test` (server-side rendering)
- [ ] Verify in Storybook (visual check)
- [ ] Upload: `npx canvas upload -c <components> -y`
- [ ] Verify in Canvas Code Editor

### 1. Fix formatting and linting

```bash
npm run code:fix
```

Auto-fixes Prettier formatting, ESLint issues, and import ordering. Resolve any
remaining issues manually before continuing.

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

Renders each component in Node.js (no browser). Catches runtime errors, missing
imports, unguarded browser-only APIs (`window`, `document`), and components that
crash with default/example prop values. If SSR fails, the component will crash
in Canvas -- fix before uploading.

### 4. Verify in Storybook

Open Storybook and confirm components render correctly with realistic content:

- Components render actual content, not empty states or placeholders
- Images load (no broken references)
- Slots accept and render children
- All theme variants produce distinct visual output
- Desktop and mobile viewports both work

### Preflight convenience script

Optionally add to `package.json`:

```json
{
  "scripts": {
    "canvas:preflight": "npm run code:fix && npx canvas validate && npx canvas ssr-test"
  }
}
```

## Run upload

When validation passes, ask the user to confirm, then upload:

```bash
npx canvas upload -c component1,component2,component3 -y
```

Replace component names with actual modified components (e.g.,
`button,card,hero`).

## Handling upload failures

Default: **always retry** unless the error is clearly a connection/setup
failure.

### Connection/setup failures -- stop, do not retry

If upload fails with auth, network, DNS, TLS, or timeout errors, stop and ask
the user to verify `.env` values and OAuth/CLI setup. Point to the setup docs
above. Retry only after the user confirms fixes.

### Dependency-order failures -- retry

When uploading multiple new components where one depends on another (e.g.,
`hero` imports `heading`), the upload may fail because a dependency hasn't been
uploaded yet. **This is expected.** Retry the same upload command -- previously
uploaded dependencies will now exist. If uploads keep failing after 3 retries,
check that all dependency components are included in the upload command.

## Post-upload verification

After successful upload, verify each component in the Canvas Code Editor:

```
<CANVAS_SITE_URL>/canvas/code-editor/component/<machine-name>
```

Confirm:

- Component appears in the component list
- Props panel shows correct fields from `component.yml`
- Preview renders without errors
- Source code tab shows the uploaded version

If a component doesn't appear, verify `machineName` in `component.yml` matches
the folder name exactly.
