# Issue Template

Create one directory per issue under `docs/qa/issues/`:

```
docs/qa/issues/
├── 01-hero-wrong-color/
│   ├── issue.md
│   ├── source-desktop.png
│   └── built-desktop.png
├── 02-card-spacing/
│   ├── issue.md
│   ├── source-desktop.png
│   └── built-desktop.png
└── qa-summary.md
```

## issue.md format

```markdown
# Issue 01: Hero Wrong Background Color

**Component:** hero **Severity:** HIGH **Viewport:** desktop **Status:** open

## Description

Hero background uses gray-800 instead of primary-900.

## Expected

Background: #1a365d (design-tokens.md → --color-primary-900)

## Actual

Background: #2d3748 (bg-gray-800 in component)

## Fix

Change CVA variant `dark` background from `bg-gray-800` to `bg-primary-900` in
hero/index.jsx.

## Resolution

[To be filled after fix]
```
