# Sub-Agent Prompt Templates

Use these prompt templates with the Agent tool when spawning sub-agents.

## Phase 1: Site URL Extraction

```
Load the nebula-design-extraction skill (invoke it via the Skill tool).
Extract design tokens, section screenshots, and verbatim content from <URL>.
Save all output to docs/clone/. Follow the skill's workflow exactly.
```

## Phase 1: Figma Extraction

```
Load the nebula-figma-extraction skill (invoke it via the Skill tool).
Extract design tokens, frame screenshots, and verbatim content from <FIGMA_URL>.
Save all output to docs/clone/. Follow the skill's workflow exactly.
```

## Phase 3: Build Component

```
Load these skills: canvas-component-definition, canvas-component-metadata,
canvas-styling-conventions, nebula-component-creation, nebula-storybook-stories,
and nebula-frontend-design.

Build a <component-name> Canvas component matching the design in
docs/clone/screenshots/desktop/section-NN-<name>.png.

Use design tokens from docs/clone/design-tokens.md for all colors, typography,
and spacing. Map tokens to @theme variables in global.css and use CVA variants
for color/layout options.

Use VERBATIM text from docs/clone/content/<page>.md section NN for the story
args. DO NOT generate or rephrase any text.

Create: src/components/<name>/index.jsx, src/components/<name>/component.yml,
and the story file in src/stories/.

Run npm run code:fix and npx canvas validate after building.
```

## Phase 4: Visual QA

```
Load the nebula-visual-qa skill (invoke it via the Skill tool).

Compare Storybook renders against reference screenshots for these components:
<list from component-map.md>.

Reference screenshots: docs/clone/screenshots/
Design tokens: docs/clone/design-tokens.md
Storybook URL: http://localhost:6006

Run the full QA loop — fix issues until zero critical and zero high issues
remain. Document all issues in docs/clone/qa/issues/ and produce
docs/clone/qa/qa-summary.md when done.
```

## Phase 6: Upload

```
Load the canvas-component-upload skill (invoke it via the Skill tool).
Run the preflight pipeline (code:fix -> canvas:validate -> canvas:ssr-test) and
upload these components: <list>.
Follow the skill's workflow exactly.
```

## Sub-Agent Spawning Rules

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
