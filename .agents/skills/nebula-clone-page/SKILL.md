---
name: nebula-clone-page
description:
  Clone a web page or Figma design into Canvas components. Use when the user
  provides a URL or Figma link and wants to recreate it as Canvas components in
  Storybook. Orchestrates extraction, building, visual QA, and page story
  composition via sub-agents. This skill coordinates sub-agents with specialized
  skills -- it does not build components directly.
compatibility:
  Requires @playwright/cli, Storybook running. Figma path requires FIGMA_TOKEN.
---

# Clone Page into Canvas Components

## Content Fidelity Rule

> **Text extracted in Phase 1 MUST be used character-for-character in Phase 3
> (stories) and Phase 5 (page composition). NEVER generate, rephrase, or
> summarize text. This is non-negotiable.**
>
> Repeat this rule to every sub-agent that handles text.

## Input

```
Source: <site URL> or <Figma URL>
Scope: full page (default) | specific sections | single component
Output: docs/clone/ (default)
```

Detect source type from the URL:

- `figma.com/design/...` or `figma.com/make/...` --> Figma path
- Anything else --> site URL path

## Phase Checklist

- [ ] Phase 1: Extraction -- spawn sub-agent with `nebula-design-extraction` or
      `nebula-figma-extraction`
- [ ] Phase 2: Audit -- map sections to existing components (REUSE/ADAPT/BUILD)
- [ ] Phase 3: Build -- spawn sub-agents for each BUILD component
- [ ] Phase 4: Visual QA -- spawn sub-agent with `nebula-visual-qa`
- [ ] Phase 5: Page story -- compose all components into example page
- [ ] Phase 6: Upload (optional) -- spawn sub-agent with
      `canvas-component-upload`

## Phase 1: Extraction

Spawn a sub-agent for the detected source type. See
`references/sub-agent-prompts.md` for the exact prompt template.

After the sub-agent completes, verify these artifacts exist:

- `docs/clone/screenshots/desktop/` -- at least full-page.png
- `docs/clone/design-tokens.md`
- `docs/clone/content/` -- at least one page content file
- `docs/clone/section-reference.md`

If any are missing, check the sub-agent output for errors before proceeding.
Create `docs/clone/progress.md` (see `references/progress-template.md`).

## Phase 2: Audit & Map

Handle directly -- no sub-agent needed.

1. Read `docs/clone/section-reference.md` for section inventory
2. Read `docs/clone/design-tokens.md` for the design system
3. List existing components: read all `src/components/*/component.yml` files
4. Classify each section as REUSE, ADAPT, or BUILD
5. Output `docs/clone/component-map.md` (see
   `references/component-map-example.md`)

Update progress.md.

## Phase 3: Build Components

Before building, add extracted design tokens to `src/components/global.css` as
`@theme` variables.

For each **BUILD** item in component-map.md, spawn a sub-agent. See
`references/sub-agent-prompts.md` for the prompt template.

For each **ADAPT** item, add a new CVA variant, props, or slot to the existing
component -- handle directly or spawn a sub-agent.

**Parallel execution:** Independent BUILD components can run as parallel
sub-agents. Components with dependencies (e.g., a card importing a button) must
be built sequentially -- dependency first.

Update progress.md after each component.

## Phase 4: Visual QA Loop

Spawn a sub-agent with the visual QA prompt from
`references/sub-agent-prompts.md`.

After the sub-agent completes, read `docs/clone/qa/qa-summary.md`:

- Zero critical/high issues --> proceed to Phase 5
- Critical/high issues remain --> report to user for guidance

Update progress.md.

## Phase 5: Compose Page Story

Handle directly. Create the page story at
`src/stories/example-pages/<page-name>.stories.jsx`.

See `references/page-story-example.md` for the full JSX template.

1. Create or update `src/stories/example-pages/page-layout.jsx` if needed
2. Compose the page story using VERBATIM text from `docs/clone/content/`
3. Verify it renders in Storybook

Update progress.md.

## Phase 6: Upload (Optional)

Only if the user requests it. Spawn a sub-agent with the upload prompt from
`references/sub-agent-prompts.md`.

## Orchestrator Principles

1. **Lightweight coordinator** -- read artifacts and spawn sub-agents. Do NOT
   build components, extract CSS, or run visual comparisons directly.

2. **Verify after every phase** -- check expected output files exist before
   moving to the next phase. If artifacts are missing, diagnose before
   proceeding.

3. **Save evidence** -- screenshots, QA reports, and progress file persist to
   disk. If context is compacted, artifacts survive.

4. **Content fidelity** -- verbatim text from Phase 1 is the single source of
   truth. Repeat this rule to every sub-agent that handles text.

5. **Exploration mindset** -- when a sub-agent fails, read its output for
   diagnostics. Investigate root cause before retrying or escalating.

## Scope

This skill clones **one page at a time**. For multi-page sites, run it multiple
times -- components built in earlier runs are available for reuse.

This is NOT a full site migration. It does not handle CMS content composition,
media upload to CMS, site configuration, or post-deployment verification. For
those, use the migrate-site skill.

## Reference Files

- `references/sub-agent-prompts.md` -- prompt templates for all sub-agents
- `references/artifact-structure.md` -- full docs/clone/ directory tree
- `references/progress-template.md` -- progress.md template
- `references/page-story-example.md` -- page story JSX template
- `references/component-map-example.md` -- component-map.md format and
  classification rules
