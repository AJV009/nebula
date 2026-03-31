# Nebula agent guidance

Nebula is the template repository this project was scaffolded from, used for
building Drupal Canvas Code Components.

## Skills

### Canvas skills (generic Canvas guidance)

| Skill                            | When to load                                                            |
| -------------------------------- | ----------------------------------------------------------------------- |
| `canvas-component-definition`    | **Start here** for any React component task. Canonical Canvas contract. |
| `canvas-component-metadata`      | Defining `component.yml` — props, slots, enums, examples                |
| `canvas-component-composability` | Designing with slots, decomposition, parent/child patterns              |
| `canvas-styling-conventions`     | Styling with Tailwind CSS 4 `@theme` tokens, CVA variants, `cn()`       |
| `canvas-component-utils`         | Using `FormattedText`, `Image` from `drupal-canvas` package             |
| `canvas-data-fetching`           | Fetching Drupal content with JSON:API and SWR                           |
| `canvas-component-upload`        | Uploading components to Drupal Canvas                                   |

### Nebula skills (repo-specific workflows)

| Skill                         | When to load                                                   |
| ----------------------------- | -------------------------------------------------------------- |
| `nebula-project-structure`    | Understanding folder layout (`src/` vs `examples/`)            |
| `nebula-component-creation`   | Creating new components by copying from `examples/components/` |
| `nebula-component-validation` | Validating components before upload (`npm run code:fix`)       |
| `nebula-storybook-stories`    | Creating Storybook stories for individual components           |
| `nebula-page-stories`         | Composing page-level stories with PageLayout                   |
| `nebula-scrape-url`           | Capturing web pages for design reference                       |
| `implement-design`            | Translating Figma designs to code with 1:1 fidelity            |

## Validation

Use the `nebula-component-validation` skill, or run `npm run code:fix` directly.

## Browser automation

This project includes two browser automation tools:

- **`scripts/scrape-page.js`** — single-command page capture with CloudFlare
  bypass. Use for quick reference screenshots.
- **`@playwright/cli`** — interactive shell-based browser automation for
  multi-step workflows (QA, extraction, form filling, comparison). Run
  `playwright-cli --help` to discover commands. Use `-s=name` for parallel
  sessions.

Output from Playwright CLI goes to `.playwright-cli/` (gitignored).

Load the `nebula-scrape-url` skill for detailed scraping workflows.
