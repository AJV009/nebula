---
name: nebula-clone-page
description:
  Clone a web page or Figma design into Canvas components with full visual QA.
  Orchestrates extraction, component auditing, building, visual comparison, and
  page story composition. Accepts a site URL or Figma URL. Use when the user
  wants to recreate a page, section, or design as Canvas components in
  Storybook. This skill coordinates sub-agents with specialized skills — it does
  not build components directly.
---

# Clone Page into Canvas Components

Orchestrate the full workflow of cloning a page from a URL or Figma design into
Canvas components with visual QA verification.

## Content Fidelity Rule

> **Text extracted in Phase 1 MUST be used character-for-character in Phase 3
> (stories) and Phase 5 (page composition). NEVER generate, rephrase, or
> summarize text. This is non-negotiable.**

This rule exists because a previous migration hallucinated ALL body text after
context compaction. Text must be persisted to files and copied verbatim.

## Input

```
Source: <site URL> or <Figma URL>
Scope: full page (default) | specific sections | single component
Output: docs/clone/ (default)
```

Detect source type from the URL:

- `figma.com/design/...` or `figma.com/make/...` → Figma path
- Anything else → site URL path

## Phase 1: Extraction

### Site URL path

Spawn a sub-agent to extract design data from the live site:

```
Agent tool:
  prompt: "Load the nebula-design-extraction skill (invoke it via the Skill
  tool). Extract design tokens, section screenshots, and verbatim content from
  <URL>. Save all output to docs/clone/. Follow the skill's workflow exactly."
```

### Figma URL path

Spawn a sub-agent to extract design data from Figma:

```
Agent tool:
  prompt: "Load the nebula-figma-extraction skill (invoke it via the Skill
  tool). Extract design tokens, frame screenshots, and verbatim content from
  <FIGMA_URL>. Save all output to docs/clone/. Follow the skill's workflow
  exactly."
```

### Verify Phase 1 output

After the sub-agent completes, verify these artifacts exist:

- `docs/clone/screenshots/desktop/` — at least full-page.png
- `docs/clone/design-tokens.md`
- `docs/clone/content/` — at least one page content file
- `docs/clone/section-reference.md`

If any are missing, check the sub-agent output for errors before proceeding.

Update `docs/clone/progress.md`:

```markdown
# Clone Progress

## Source

URL: <source-url> Type: site | figma

## Phase Status

- [x] Phase 1: Extraction — completed
- [ ] Phase 2: Audit
- [ ] Phase 3: Build
- [ ] Phase 4: QA
- [ ] Phase 5: Page Story
- [ ] Phase 6: Upload (optional)
```

## Phase 2: Audit & Map

Handle this directly — no sub-agent needed.

1. Read `docs/clone/section-reference.md` to understand what sections exist
2. Read `docs/clone/design-tokens.md` for the design system
3. List existing components: read all `src/components/*/component.yml` files
4. For each section, classify:
   - **REUSE** — an existing component matches the section's needs
   - **ADAPT** — an existing component needs a new variant or props
   - **BUILD** — no existing component fits, need a new one

5. Output `docs/clone/component-map.md`:

```markdown
# Component Map

| Section  | Strategy | Component       | Notes                                 |
| -------- | -------- | --------------- | ------------------------------------- |
| Hero     | BUILD    | hero            | Full-width with background image, CTA |
| Features | BUILD    | feature-card    | 3-column card grid                    |
| About    | REUSE    | two-column-text | Existing component fits               |
| CTA      | ADAPT    | section         | Add dark background variant           |
| Footer   | REUSE    | footer          | Existing component fits               |
```

Update progress.md with audit results.

## Phase 3: Build Components

### Update global.css with design tokens

Before building components, add extracted design tokens to
`src/components/global.css`:

```css
@theme {
  /* Colors from design-tokens.md */
  --color-primary: #1a365d;
  --color-accent: #e53e3e;
  /* Typography */
  --font-display: "Playfair Display", serif;
  --font-body: "Inter", sans-serif;
  /* ... */
}
```

### Build each component

For each **BUILD** item in component-map.md, spawn a sub-agent:

```
Agent tool:
  prompt: "Load these skills: canvas-component-definition,
  canvas-component-metadata, canvas-styling-conventions,
  nebula-component-creation, nebula-storybook-stories, and
  nebula-frontend-design.

  Build a <component-name> Canvas component matching the design in
  docs/clone/screenshots/desktop/section-NN-<name>.png.

  Use design tokens from docs/clone/design-tokens.md for all colors,
  typography, and spacing. Map tokens to @theme variables in global.css and
  use CVA variants for color/layout options.

  Use VERBATIM text from docs/clone/content/<page>.md section NN for the
  story args. DO NOT generate or rephrase any text.

  Create: src/components/<name>/index.jsx, src/components/<name>/component.yml,
  and the story file in src/stories/.

  Run npm run code:fix and npx canvas validate after building."
```

For each **ADAPT** item, either spawn a sub-agent or handle directly — add a new
CVA variant, additional props, or slot to the existing component.

**Parallel execution:** Independent BUILD components can be spawned as
background sub-agents. Components that depend on each other (e.g., a card that
imports a button) must be built sequentially — dependency first.

Update progress.md after each component is built.

## Phase 4: Visual QA Loop

Spawn a sub-agent for visual comparison:

```
Agent tool:
  prompt: "Load the nebula-visual-qa skill (invoke it via the Skill tool).

  Compare Storybook renders against reference screenshots for these
  components: <list from component-map.md>.

  Reference screenshots: docs/clone/screenshots/
  Design tokens: docs/clone/design-tokens.md
  Storybook URL: http://localhost:6006

  Run the full QA loop — fix issues until zero critical and zero high issues
  remain. Document all issues in docs/clone/qa/issues/ and produce
  docs/clone/qa/qa-summary.md when done."
```

After the sub-agent completes, read `docs/clone/qa/qa-summary.md`:

- If zero critical/high issues → proceed to Phase 5
- If critical/high issues remain → report to user for guidance

Update progress.md.

## Phase 5: Compose Page Story

Handle this directly — compose a page story using all built components.

1. Create or update `src/stories/example-pages/page-layout.jsx` if it doesn't
   exist (see `nebula-page-stories` skill for the PageLayout pattern)

2. Create the page story at `src/stories/example-pages/<page-name>.stories.jsx`:

```jsx
import FeatureCard from "@/components/feature-card";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Section from "@/components/section";
import Spacer from "@/components/spacer";

import PageLayout from "./page-layout";

// Props use VERBATIM text from docs/clone/content/<page>.md
const heroProps = {
  heading: "Welcome to Our Company", // exact text from content file
  subheading: "Building the future, one component at a time.",
  ctaText: "Get Started",
  ctaLink: "/contact",
};

const ClonedPage = () => (
  <PageLayout>
    <Hero {...heroProps} />
    <Spacer height="large" />
    <Section width="normal" content={<FeatureCard {...featureProps} />} />
    <Spacer height="large" />
    <Footer />
  </PageLayout>
);

export default {
  title: "Example pages/<Page Name>",
  component: ClonedPage,
  parameters: { layout: "fullscreen" },
};

export const Default = { name: "<Page Name>" };
```

3. Verify the page story renders in Storybook

Update progress.md.

## Phase 6: Upload (Optional)

Only if the user requests it. Spawn a sub-agent:

```
Agent tool:
  prompt: "Load the canvas-component-upload skill (invoke it via the Skill
  tool). Run the preflight pipeline (code:fix → canvas:validate →
  canvas:ssr-test) and upload these components: <list>.
  Follow the skill's workflow exactly."
```

## Orchestrator Principles

These principles are carried from the battle-tested migrate-site orchestrator:

1. **Lightweight coordinator** — this skill reads artifacts and spawns
   sub-agents. It does NOT build components, extract CSS, or perform visual
   comparisons directly. All heavy lifting is delegated.

2. **Verify after every phase** — check that expected output files exist before
   moving to the next phase. If artifacts are missing, diagnose before
   proceeding.

3. **Save evidence** — screenshots, QA reports, and progress file persist to
   disk. If context is compacted, artifacts survive.

4. **Content fidelity** — verbatim text from Phase 1 is the single source of
   truth. Repeat this rule to every sub-agent that handles text.

5. **Exploration mindset** — when a sub-agent fails, read its output for
   diagnostics. Investigate root cause before retrying or escalating to the
   user.

## Sub-Agent Spawning Reference

When this skill says "spawn a sub-agent", use the Agent tool:

1. In the `prompt`, tell the sub-agent:
   - Which skill(s) to load (via the Skill tool)
   - What specific task to perform
   - What files to read as input
   - What files to produce as output
2. Wait for the sub-agent to complete
3. Verify the expected output files exist
4. If the sub-agent failed, read its output for diagnostics

Sub-agents get their own context window — they don't see the orchestrator's full
conversation. Provide all necessary context in the prompt.

## Parallel Execution Opportunities

```
Phase 1: Single sub-agent (extraction)
Phase 2: Orchestrator directly (sequential)
Phase 3: Multiple sub-agents in parallel (one per independent BUILD component)
Phase 4: Single sub-agent (QA needs all components)
Phase 5: Orchestrator directly (sequential)
Phase 6: Single sub-agent if requested (upload)
```

## Artifact Structure

```
docs/clone/
├── progress.md
├── component-map.md
├── design-tokens.md
├── section-reference.md
├── media-map.md
├── content/
│   └── <page>.md
├── screenshots/
│   ├── desktop/
│   ├── tablet/
│   └── mobile/
└── qa/
    ├── issues/
    │   └── 01-<description>/
    │       ├── issue.md
    │       ├── source.png
    │       └── built.png
    └── qa-summary.md
```

## Scope

This skill clones **one page at a time**. For multi-page sites, run it multiple
times — components built in earlier runs are available for reuse in later ones.

This is NOT a full site migration. It does not handle:

- CMS content composition (JSON:API page creation)
- Media upload to CMS
- Site configuration (name, logo, favicon, menus)
- Post-deployment verification on live sites

For those, use the custom migrate-site skill in the project-specific repos.
