---
name: nebula-scrape-url
description:
  Capture web page screenshots and HTML for design reference. Use when the user
  provides a URL and wants to build, recreate, or implement a design. Supports
  quick capture and interactive browser exploration.
compatibility: Requires @playwright/cli (included in Nebula).
---

# Scraping URLs for design reference

**Web page URLs only.** Do not use this for Figma URLs (use Figma MCP), GitHub
URLs (read code directly), or documentation URLs (read/search as needed).

## Default: Playwright CLI

Use Playwright CLI for all browser automation -- capturing screenshots,
extracting styles, comparing renders, navigating multi-page flows. Fall back to
`scrape-page.js` only for CloudFlare-protected sites or quick one-shot captures
where you need all three viewports in one command.

Run `playwright-cli --help` for the full command reference.

### Basic capture

```bash
playwright-cli open https://example.com
playwright-cli screenshot --full-page
playwright-cli resize 768 1024
playwright-cli screenshot --full-page
playwright-cli resize 375 812
playwright-cli screenshot --full-page
playwright-cli close
```

Screenshots save to `.playwright-cli/` with timestamps.

### Section-level screenshots

```bash
playwright-cli open https://example.com
playwright-cli snapshot                    # accessibility tree -- find element refs
playwright-cli screenshot e5              # screenshot specific element by ref
playwright-cli close
```

### Parallel sessions for comparison

```bash
playwright-cli -s=source open https://example.com
playwright-cli -s=source screenshot --full-page

playwright-cli -s=storybook open http://localhost:6006/iframe.html?id=organisms-hero--default
playwright-cli -s=storybook screenshot --full-page

playwright-cli close-all
```

## Fallback: scrape-page.js

For CloudFlare-protected sites or quick one-shot captures. Handles CF bypass
automatically via visible browser mode.

```bash
node scripts/scrape-page.js <url>
```

Outputs to `scraped/<timestamp>/`: `screenshot-desktop.png` (1280px),
`screenshot-tablet.png` (768px), `screenshot-mobile.png` (375px), `page.html`,
`metadata.json`.

## After capturing

1. **Review the screenshots** to understand the visual design (layout, spacing,
   colors, typography).
2. **Review the HTML or snapshot** to understand content structure and
   hierarchy.
3. **Build the components** using the `nebula-component-creation` skill.
