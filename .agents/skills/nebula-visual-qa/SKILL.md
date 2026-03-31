---
name: nebula-visual-qa
description:
  Compare Canvas component Storybook renders against design reference
  screenshots to find and fix visual discrepancies. Use after building
  components, when verifying renders against source screenshots or Figma
  exports, or when QA-ing visual fidelity before upload. Guides side-by-side
  comparison at multiple viewports, severity classification, issue
  documentation, and iterative fix-and-verify loops.
compatibility: Requires @playwright/cli and Storybook running (npm run dev).
---

# Visual QA for Canvas Components

Compare Storybook component renders against design reference screenshots.
Identify visual discrepancies, classify by severity, fix iteratively, and verify
until components match the design.

Can be invoked standalone or as a sub-agent (via nebula-clone-page), which
passes reference screenshots, component list, and design-tokens path
automatically.

## Arguments

- `$1` -- **Reference path** (required). Path to source screenshots directory.
- `$2` -- **Components** (optional). Comma-separated list of components to QA.
  Defaults to all components with stories.
- `$3` -- **Design tokens path** (optional). Path to design-tokens.md for color
  matching. Defaults to `docs/clone/design-tokens.md`.

## QA Workflow

- [ ] Capture reference screenshots (or use existing from extraction). See
      `references/capture-commands.md`.
- [ ] Capture Storybook renders at matching viewports. See
      `references/capture-commands.md`.
- [ ] Compare side-by-side: layout, colors, typography, spacing, effects,
      content (checklist below).
- [ ] Classify issues by severity (table below).
- [ ] Document issues. See `references/issue-template.md`.
- [ ] Fix loop: fix one issue, re-screenshot, compare, check regressions.
- [ ] Generate qa-summary.md. See `references/qa-summary-template.md`.

## Comparison Checklist

Read both screenshots (source reference and Storybook render) and compare:

- **Layout** -- element positioning, flex/grid structure, alignment, column
  count, responsive reflow/stacking at mobile
- **Colors** -- compare against `design-tokens.md` hex values (backgrounds,
  text, accents, borders, shadows)
- **Typography** -- font family, weight, size, line-height, heading hierarchy,
  text alignment
- **Spacing** -- padding, margins, gaps, section-level spacing, container
  max-widths
- **Effects** -- box shadows, border-radius, gradients, opacity, overlays,
  hover/focus states
- **Content** -- all text matches reference exactly, images present and
  correctly sized, links/buttons all present

## Severity Classification

| Severity     | Definition                                  | Examples                                                    |
| ------------ | ------------------------------------------- | ----------------------------------------------------------- |
| **Critical** | Component is structurally wrong or unusable | Wrong color scheme, missing element, layout broken          |
| **High**     | Noticeable visual mismatch                  | Color off by more than one shade, wrong font weight         |
| **Medium**   | Minor visual difference                     | Slight spacing off, subtle color shade, minor border-radius |
| **Low**      | Negligible platform differences             | Sub-pixel rendering, anti-aliasing, browser font smoothing  |

## Fix Loop Discipline

For each issue, starting from highest severity:

1. **Fix ONE issue** -- apply the minimal targeted change
2. **Re-screenshot** the Storybook render at all viewports
3. **Compare again** against the reference
4. **Check for regressions** -- did the fix break other components?
5. **Update issue.md** -- set status to `resolved`
6. **Next issue** -- repeat until no critical/high issues remain

Never batch multiple fixes. Each fix gets its own verify cycle so regressions
can be attributed to the specific change.

See `references/fix-patterns.md` for common fix patterns by issue type.

## Global.css Impact Awareness

When fixing a design token in `global.css`, it may affect other components.
After changing any shared token (e.g., `--color-primary-900`), identify all
components that use it and re-verify each one.

## Iteration Behavior

- **Iteration 1:** Full scan -- screenshot ALL components at all viewports,
  compare each against source, document all issues.
- **Iteration 2+:** Targeted -- only re-check components that were fixed or
  share design tokens with fixed components.
- **Regression detection:** After every fix, verify adjacent components.

## Exit Criteria

- Zero critical issues
- Zero high issues
- Medium/low issues documented with rationale for deferral
- All viewports verified (desktop + mobile minimum)
- `qa-summary.md` generated (see `references/qa-summary-template.md`)
