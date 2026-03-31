---
name: nebula-design-extraction
description:
  Extract design tokens, section screenshots, verbatim content, and responsive
  CSS from a live website URL. Use when cloning a page, extracting a design
  system, or capturing structured reference data for component building.
compatibility: Requires @playwright/cli. Target URL must be accessible.
---

# Design Extraction from a Live Site

> **CONTENT FIDELITY RULE — ALL text must be extracted character-for-character
> from the source. NEVER rephrase, summarize, correct typos, or generate text.
> If text cannot be read, mark it as `[UNREADABLE]` rather than guessing.** Text
> extracted here will be used verbatim downstream. Any rephrasing introduces
> hallucinated content.

## Prerequisites

- Playwright CLI installed (`@playwright/cli` — included in Nebula)
- Target URL accessible from the execution environment

## Arguments

| Arg  | Required | Description                              |
| ---- | -------- | ---------------------------------------- |
| `$1` | Yes      | URL of the page to extract from          |
| `$2` | No       | Output directory (default `docs/clone/`) |

## Workflow

- [ ] Open URL: `playwright-cli open <url> -s=extract`
- [ ] Full-page screenshots at desktop (1280), tablet (768), mobile (375)
- [ ] Identify page sections from snapshot (`playwright-cli snapshot`)
- [ ] Assign section IDs: `section-01-hero`, `section-02-features`, etc.
- [ ] Per-section screenshots at desktop + mobile
- [ ] Extract verbatim text content per section (see
      `references/content-example.md`)
- [ ] Extract computed CSS for design tokens (see
      `references/css-extraction-commands.md`)
- [ ] Generate `design-tokens.md` (see `references/design-tokens-example.md`)
- [ ] Generate `section-reference.md` (see `references/output-formats.md`)
- [ ] Generate `media-map.md` (see `references/output-formats.md`)
- [ ] Close browser: `playwright-cli close -s=extract`

### Section identification

Sections are identified by:

- `<section>`, `<header>`, `<footer>`, `<main>` elements
- Heading elements (`h1`-`h6`) that introduce new content blocks
- Major layout containers with distinct visual purposes
- Landmark roles in the accessibility tree

### Screenshot commands

```bash
# Full-page at each viewport
playwright-cli screenshot --full-page --filename=screenshots/desktop/full-page.png -s=extract
playwright-cli resize 768 1024 -s=extract
playwright-cli screenshot --full-page --filename=screenshots/tablet/full-page.png -s=extract
playwright-cli resize 375 812 -s=extract
playwright-cli screenshot --full-page --filename=screenshots/mobile/full-page.png -s=extract

# Per-section (repeat for each section at desktop + mobile)
playwright-cli resize 1280 900 -s=extract
playwright-cli screenshot <section-ref> --filename=screenshots/desktop/section-01-hero.png -s=extract
playwright-cli resize 375 812 -s=extract
playwright-cli screenshot <section-ref> --filename=screenshots/mobile/section-01-hero.png -s=extract
```

If element-level screenshots are not possible, scroll to each section and
capture the viewport instead.

## Output Artifacts

All output goes to the specified output directory (default `docs/clone/`):

| File                     | Purpose                                          |
| ------------------------ | ------------------------------------------------ |
| `screenshots/desktop/`   | Full-page + per-section screenshots at 1280px    |
| `screenshots/tablet/`    | Full-page screenshot at 768px                    |
| `screenshots/mobile/`    | Full-page + per-section screenshots at 375px     |
| `content/<page-name>.md` | Verbatim text content organized by section       |
| `design-tokens.md`       | Colors, typography, spacing, effects             |
| `section-reference.md`   | Section-to-screenshot-to-component mapping table |
| `media-map.md`           | All images/videos with source URLs and alt text  |

## Usage

**Standalone:** Extract a site's design system for research, competitive
analysis, or client audits without intending to clone.

**Sub-agent (via nebula-clone-page):** The orchestrator provides URL and output
directory; this skill runs the full extraction and the orchestrator reads output
artifacts for the next phase.
