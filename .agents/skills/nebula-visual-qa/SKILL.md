---
name: nebula-visual-qa
description:
  Visual quality assurance for Canvas components. Compares Storybook renders
  against design reference screenshots using Playwright CLI. Guides side-by-side
  comparison at multiple viewports, severity classification, issue
  documentation, and iterative fix-and-verify loops. Use after building
  components to verify visual fidelity before upload. Requires Playwright CLI
  and Storybook running.
---

# Visual QA for Canvas Components

Compare Storybook component renders against design reference screenshots.
Identify visual discrepancies, classify by severity, fix iteratively, and verify
until components match the design.

## Prerequisites

- Playwright CLI installed (`@playwright/cli` — included in Nebula)
- Storybook running (`npm run dev`)
- Reference screenshots available (from `nebula-design-extraction`,
  `nebula-figma-extraction`, or manual capture)

## Arguments

- `$1` — **Reference path** (required). Path to source screenshots directory.
- `$2` — **Components** (optional). Comma-separated list of components to QA.
  Defaults to all components with stories.
- `$3` — **Design tokens path** (optional). Path to design-tokens.md for color
  matching. Defaults to `docs/clone/design-tokens.md`.

## Workflow

### Step 1: Capture reference screenshots (if needed)

If reference screenshots don't already exist from an extraction phase:

```bash
playwright-cli open <source-url> -s=source
playwright-cli screenshot --full-page --filename=ref-desktop.png -s=source
playwright-cli resize 375 812 -s=source
playwright-cli screenshot --full-page --filename=ref-mobile.png -s=source
playwright-cli close -s=source
```

### Step 2: Capture Storybook renders

For each component, capture its Storybook story at matching viewports:

```bash
# Desktop (1280px default)
playwright-cli open "http://localhost:6006/iframe.html?id=<story-id>&viewMode=story" -s=storybook
playwright-cli screenshot --full-page --filename=built-hero-desktop.png -s=storybook

# Mobile
playwright-cli resize 375 812 -s=storybook
playwright-cli screenshot --full-page --filename=built-hero-mobile.png -s=storybook

# Reset for next component
playwright-cli resize 1280 900 -s=storybook
```

Use named sessions to keep source and Storybook open simultaneously:

```bash
playwright-cli -s=source open <source-url>
playwright-cli -s=storybook open http://localhost:6006/iframe.html?id=...
playwright-cli -s=source screenshot --full-page
playwright-cli -s=storybook screenshot --full-page
```

### Step 3: Side-by-side comparison

Read both screenshots (source reference and Storybook render) and compare:

**Layout**

- Element positioning, flex/grid structure, alignment
- Column count, row layout, wrapping behavior
- Responsive reflow: does it stack correctly at mobile?

**Colors**

- Compare against `design-tokens.md` hex values, not just visual impression
- Check: backgrounds, text colors, accent colors, borders, shadows
- Example: source shows `#1a365d`, built shows `#2d3748` → HIGH severity

**Typography**

- Font family, weight, size, line-height, letter-spacing
- Heading hierarchy consistency
- Text alignment and truncation behavior

**Spacing**

- Padding, margins, gaps between elements
- Section-level spacing consistency
- Container max-widths

**Effects**

- Box shadows, border-radius, gradients
- Opacity, backdrop-blur, overlays
- Hover/focus states (if reference shows them)

**Content**

- All text matches reference exactly
- Images present and correctly sized
- Links/buttons all present

### Step 4: Classify issues

| Severity     | Definition                                  | Examples                                                                            |
| ------------ | ------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Critical** | Component is structurally wrong or unusable | Wrong color scheme, missing element, layout broken, text invisible                  |
| **High**     | Noticeable visual mismatch                  | Color off by more than one shade, wrong font weight, significant spacing difference |
| **Medium**   | Minor visual difference                     | Slight spacing off, subtle color shade difference, minor border-radius mismatch     |
| **Low**      | Negligible platform differences             | Sub-pixel rendering, anti-aliasing, browser-specific font smoothing                 |

### Step 5: Document issues

Create issue artifacts for each discrepancy found:

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

Issue format:

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

### Step 6: Fix loop

For each issue, starting from highest severity:

1. **Fix ONE issue** — apply the minimal targeted change
2. **Re-screenshot** the Storybook render at all viewports
3. **Compare again** against the reference
4. **Check for regressions** — did the fix break other components?
5. **Update issue.md** — set status to `resolved`
6. **Next issue** — repeat until no critical/high issues remain

**Fix ONE at a time.** Never batch multiple fixes. Each fix gets its own verify
cycle so regressions can be attributed to the specific change.

### Common fix patterns

| Issue Type       | Fix Location                      | Pattern                                |
| ---------------- | --------------------------------- | -------------------------------------- |
| Wrong color      | CVA variant or `@theme` token     | Map to correct design token            |
| Wrong typography | `@theme` font or component styles | Match font-family, weight, size        |
| Wrong spacing    | Tailwind classes                  | Match padding/margin/gap values        |
| Layout broken    | Flex/grid structure               | Compare direction, alignment, wrapping |
| Missing effect   | Component styles                  | Add shadow, gradient, blur             |
| Responsive issue | Responsive Tailwind classes       | Add breakpoint-specific classes        |

### Global.css impact awareness

When fixing a design token in `global.css`, it may affect other components:

```
Changed --color-primary-900 in global.css.
This affects: hero, header, footer, main-navigation.
Re-verify these components after the fix.
```

### Step 7: QA summary

Generate `docs/qa/qa-summary.md`:

```markdown
# Visual QA Summary

## Overview

- Components checked: 8
- Viewports: desktop (1280px), mobile (375px)
- Issues found: 5 (1 critical, 2 high, 1 medium, 1 low)
- Issues resolved: 4
- Issues deferred: 1 (low — sub-pixel rendering difference)

## Per-Component Status

| Component  | Desktop | Mobile            | Issues     | Status   |
| ---------- | ------- | ----------------- | ---------- | -------- |
| hero       | PASS    | PASS              | 1 resolved | verified |
| card       | PASS    | PASS              | 0          | verified |
| header     | PASS    | PASS              | 0          | verified |
| footer     | PASS    | 1 medium resolved | 1 resolved | verified |
| cta-banner | PASS    | PASS              | 0          | verified |

## Deferred Issues

- Low: footer border-radius differs by 1px at mobile (browser rendering)
```

## Iteration Behavior

- **Iteration 1:** Full scan — screenshot ALL components at all viewports,
  compare each against source, document all issues
- **Iteration 2+:** Targeted — only re-check components that were fixed or share
  design tokens with fixed components
- **Regression detection:** After every fix, verify adjacent components

## Exit Criteria

- Zero critical issues
- Zero high issues
- Medium/low issues documented with rationale for deferral
- All viewports verified (desktop + mobile minimum)

## Standalone vs Sub-Agent Usage

**Standalone:** Invoke directly to QA specific components after building them.
Useful during development for continuous visual verification.

**As sub-agent (via nebula-clone-page):** The orchestrator spawns a sub-agent
with this skill loaded, passing the reference screenshots path, component list,
and design-tokens.md path. The sub-agent runs the full QA loop and returns
`qa-summary.md`.

## Cleanup

```bash
playwright-cli close-all
```
