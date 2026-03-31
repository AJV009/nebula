---
name: nebula-design-extraction
description:
  Extract design tokens, section screenshots, verbatim content, and responsive
  CSS from a live website URL. Use when cloning a page, extracting a design
  system from an existing site, or capturing structured reference data for
  component building. Produces design-tokens.md, content files, section
  screenshots, and a section reference map. Requires Playwright CLI.
---

# Design Extraction from a Live Site

Extract structured design data from a website URL. This skill captures
screenshots, design tokens, verbatim text content, and responsive CSS — the raw
materials needed to build Canvas components that match the source.

## Prerequisites

- Playwright CLI installed (`@playwright/cli` — included in Nebula)
- Target URL accessible

## Arguments

- `$1` — **URL** (required). The page to extract from.
- `$2` — **Output directory** (optional). Defaults to `docs/clone/`.

## Content Fidelity Rule

> **ALL text must be extracted character-for-character from the source. NEVER
> rephrase, summarize, correct typos, or generate text. If text cannot be read,
> mark it as `[UNREADABLE]` rather than guessing.**

This is non-negotiable. Text extracted here will be used verbatim in component
stories and page compositions. Any rephrasing introduces hallucinated content.

## Workflow

### Step 1: Full-page capture at multiple viewports

```bash
playwright-cli open <url> -s=extract
playwright-cli screenshot --full-page --filename=screenshots/desktop/full-page.png -s=extract
playwright-cli resize 768 1024 -s=extract
playwright-cli screenshot --full-page --filename=screenshots/tablet/full-page.png -s=extract
playwright-cli resize 375 812 -s=extract
playwright-cli screenshot --full-page --filename=screenshots/mobile/full-page.png -s=extract
```

### Step 2: Identify page sections

```bash
# Reset to desktop viewport
playwright-cli resize 1280 900 -s=extract
# Get page structure
playwright-cli snapshot -s=extract
```

Read the snapshot to identify major semantic sections: hero, features, about,
testimonials, CTA, footer, etc. Sections are typically identified by:

- `<section>`, `<header>`, `<footer>`, `<main>` elements
- Heading elements (`h1`-`h6`) that introduce new content blocks
- Major layout containers with distinct visual purposes
- Landmark roles in the accessibility tree

Assign section numbers: `section-01-hero`, `section-02-features`, etc.

### Step 3: Per-section screenshots

For each identified section, capture at desktop and mobile viewports:

```bash
# Desktop (1280px) — should already be at this viewport
playwright-cli screenshot <section-ref> --filename=screenshots/desktop/section-01-hero.png -s=extract

# Mobile (375px)
playwright-cli resize 375 812 -s=extract
playwright-cli screenshot <section-ref> --filename=screenshots/mobile/section-01-hero.png -s=extract

# Reset for next section
playwright-cli resize 1280 900 -s=extract
```

If element-level screenshots aren't possible, scroll to each section and capture
the viewport instead.

### Step 4: Extract verbatim text content

For each section, extract ALL visible text exactly as it appears. Output to
`content/<page-name>.md`:

```markdown
# <Page Title>

## Section 1: Hero

<!-- Context: Full-width hero with dark background overlay -->
<!-- Layout: Centered text, CTA button below -->
<!-- Screenshot: screenshots/desktop/section-01-hero.png -->

### Heading

Welcome to Our Company

### Subheading

Building the future, one component at a time.

### CTA Button

Get Started → /contact

### Background Image

hero-bg.jpg (https://example.com/images/hero-bg.jpg)

---

## Section 2: Features

<!-- Context: 3-column card grid on light background -->
<!-- Layout: Grid, 3 cols desktop, stacked mobile -->
<!-- Screenshot: screenshots/desktop/section-02-features.png -->

### Card 1

**Title:** Fast Development **Body:** Build components quickly with our modern
toolchain. **Image:** /images/fast-dev.jpg (alt: Developer working on laptop)

### Card 2

**Title:** Responsive Design **Body:** Every component works perfectly on all
screen sizes. **Image:** /images/responsive.jpg (alt: Devices showing responsive
layout)
```

Each section includes metadata comments for Context, Layout, and Screenshot
paths. Text is extracted character-for-character.

### Step 5: Extract computed CSS for design tokens

For key elements in each section, extract computed styles at multiple viewports.
Use `eval` to run JavaScript in the page context:

```bash
# Colors
playwright-cli eval "getComputedStyle(document.querySelector('.hero')).backgroundColor" -s=extract
playwright-cli eval "getComputedStyle(document.querySelector('.hero')).color" -s=extract
playwright-cli eval "getComputedStyle(document.querySelector('h1')).color" -s=extract

# Typography
playwright-cli eval "getComputedStyle(document.querySelector('h1')).fontFamily" -s=extract
playwright-cli eval "getComputedStyle(document.querySelector('h1')).fontSize" -s=extract
playwright-cli eval "getComputedStyle(document.querySelector('h1')).fontWeight" -s=extract
playwright-cli eval "getComputedStyle(document.querySelector('h1')).lineHeight" -s=extract

# Spacing
playwright-cli eval "getComputedStyle(document.querySelector('section')).padding" -s=extract
playwright-cli eval "getComputedStyle(document.querySelector('.container')).maxWidth" -s=extract

# Effects
playwright-cli eval "getComputedStyle(document.querySelector('.card')).boxShadow" -s=extract
playwright-cli eval "getComputedStyle(document.querySelector('.card')).borderRadius" -s=extract
```

Repeat at mobile viewport (375px) to capture responsive changes.

### Step 6: Generate design-tokens.md

Synthesize the extracted CSS into a structured tokens file:

```markdown
# Design Tokens

## Colors

| Token      | Value   | Usage                    |
| ---------- | ------- | ------------------------ |
| primary    | #1a365d | Headings, nav background |
| accent     | #e53e3e | CTA buttons, highlights  |
| background | #f7fafc | Page background          |
| text       | #2d3748 | Body text                |
| text-light | #718096 | Captions, secondary text |

## Typography

| Element | Font             | Size (desktop) | Size (mobile) | Weight | Line Height |
| ------- | ---------------- | -------------- | ------------- | ------ | ----------- |
| h1      | Playfair Display | 3rem           | 2rem          | 700    | 1.2         |
| h2      | Playfair Display | 2.25rem        | 1.5rem        | 600    | 1.3         |
| body    | Inter            | 1rem           | 1rem          | 400    | 1.6         |
| small   | Inter            | 0.875rem       | 0.875rem      | 400    | 1.5         |

## Spacing

| Context             | Desktop  | Mobile    |
| ------------------- | -------- | --------- |
| Section padding     | 80px 0   | 40px 16px |
| Container max-width | 1200px   | 100%      |
| Card gap            | 24px     | 16px      |
| Standard unit       | 8px grid | 8px grid  |

## Effects

| Effect                  | Value                     |
| ----------------------- | ------------------------- |
| Card shadow             | 0 4px 6px rgba(0,0,0,0.1) |
| Border radius (cards)   | 12px                      |
| Border radius (buttons) | 8px                       |
| Hover transition        | 200ms ease-in-out         |
```

### Step 7: Generate section-reference.md

Map each section to its screenshots, content, and structural notes:

```markdown
# Section Reference

| #   | Section  | Type        | Desktop Screenshot      | Mobile Screenshot       | Component Hint        |
| --- | -------- | ----------- | ----------------------- | ----------------------- | --------------------- |
| 1   | Hero     | Hero banner | section-01-hero.png     | section-01-hero.png     | hero                  |
| 2   | Features | Card grid   | section-02-features.png | section-02-features.png | card_container + card |
| 3   | About    | Two-column  | section-03-about.png    | section-03-about.png    | two_column_text       |
| 4   | CTA      | Banner      | section-04-cta.png      | section-04-cta.png      | section + button      |
```

### Step 8: Generate media-map.md

List all images, videos, and media assets found on the page:

```markdown
# Media Map

| #   | Filename     | Source URL                              | Alt Text            | Section  | Type       |
| --- | ------------ | --------------------------------------- | ------------------- | -------- | ---------- |
| 1   | hero-bg.jpg  | https://example.com/images/hero-bg.jpg  | Mountain landscape  | Hero     | background |
| 2   | fast-dev.jpg | https://example.com/images/fast-dev.jpg | Developer on laptop | Features | content    |
| 3   | logo.svg     | https://example.com/images/logo.svg     | Company Logo        | Header   | logo       |
```

## Output Artifacts

All output goes to the specified output directory (default `docs/clone/`):

```
docs/clone/
├── screenshots/
│   ├── desktop/
│   │   ├── full-page.png
│   │   ├── section-01-hero.png
│   │   ├── section-02-features.png
│   │   └── ...
│   ├── tablet/
│   │   └── full-page.png
│   └── mobile/
│       ├── full-page.png
│       ├── section-01-hero.png
│       └── ...
├── content/
│   └── <page-name>.md
├── design-tokens.md
├── section-reference.md
└── media-map.md
```

## Cleanup

```bash
playwright-cli close -s=extract
```

## Standalone Usage

This skill can be used independently for design research — extracting a site's
design system without intending to clone it. Useful for competitive analysis,
client site audits, or extracting tokens from an existing site to match in new
components.

## Usage as Sub-Agent (via nebula-clone-page)

When spawned by the `nebula-clone-page` orchestrator, the orchestrator provides
the URL and output directory. This skill runs the full extraction workflow and
the orchestrator reads the output artifacts for the next phase.
