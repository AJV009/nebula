---
name: nebula-scrape-url
description:
  Capture web page screenshots and HTML for design reference. Use when the user
  provides a URL and asks to build, recreate, or implement a design. Supports
  two modes — quick capture via scrape-page.js or interactive exploration via
  Playwright CLI. Not for Figma, GitHub, or documentation URLs.
---

# Scraping URLs for design reference

**This applies to web page URLs only.** Do not use this for:

- Figma URLs (use the Figma MCP instead)
- GitHub URLs (read the code directly)
- Documentation URLs (read or search as needed)

## Quick capture with scrape-page.js

For simple, one-shot captures of a page. Handles CloudFlare-protected sites
automatically via visible browser mode.

```bash
node scripts/scrape-page.js <url>
```

**Output** in `scraped/<timestamp>/`:

- `screenshot-desktop.png` — 1280px width
- `screenshot-tablet.png` — 768px width
- `screenshot-mobile.png` — 375px width
- `page.html` — complete HTML
- `metadata.json` — page info

**Options:**

```bash
node scripts/scrape-page.js <url> --headless        # skip visible browser
node scripts/scrape-page.js <url> --no-screenshots   # HTML only
```

Use this when you just need reference screenshots and HTML to start building.

## Interactive exploration with Playwright CLI

For multi-step workflows: navigating pages, extracting computed styles,
comparing Storybook renders against references, filling forms, or any iterative
browser work.

Run `playwright-cli --help` for all available commands.

### Basic capture workflow

```bash
# Open page and capture at multiple viewports
playwright-cli open https://example.com
playwright-cli screenshot --full-page
playwright-cli resize 768 1024
playwright-cli screenshot --full-page
playwright-cli resize 375 812
playwright-cli screenshot --full-page
playwright-cli close
```

Screenshots are saved to `.playwright-cli/` with timestamps.

### Page structure extraction

```bash
playwright-cli open https://example.com
playwright-cli snapshot                    # accessibility tree as YAML
playwright-cli eval "document.title"       # evaluate JS expressions
playwright-cli close
```

### Section-level screenshots

```bash
playwright-cli open https://example.com
playwright-cli snapshot                    # find element refs
playwright-cli screenshot e5              # screenshot specific element by ref
playwright-cli close
```

### Extracting computed styles

```bash
playwright-cli open https://example.com
playwright-cli eval "getComputedStyle(document.querySelector('.hero')).backgroundColor"
playwright-cli eval "getComputedStyle(document.querySelector('h1')).fontFamily"
```

### Parallel sessions for comparison

Use named sessions to have source and Storybook open simultaneously:

```bash
# Source in one session
playwright-cli -s=source open https://example.com
playwright-cli -s=source screenshot --full-page

# Storybook in another
playwright-cli -s=storybook open http://localhost:6006/iframe.html?id=organisms-hero--default
playwright-cli -s=storybook screenshot --full-page

# Compare the screenshots visually
# Clean up
playwright-cli close-all
```

## When to use which

| Need                                | Tool                                  |
| ----------------------------------- | ------------------------------------- |
| Quick reference screenshots         | `scrape-page.js`                      |
| CloudFlare-protected sites          | `scrape-page.js` (built-in CF bypass) |
| Interactive page exploration        | Playwright CLI                        |
| Extract CSS / computed styles       | Playwright CLI (`eval`)               |
| Visual QA comparison loops          | Playwright CLI (named sessions)       |
| Multi-step workflows (login, forms) | Playwright CLI                        |
| Section-level element screenshots   | Playwright CLI (`screenshot <ref>`)   |

## After capturing

1. **Review the screenshots** to understand the visual design (layout, spacing,
   colors, typography).
2. **Review the HTML or snapshot** to understand content structure and
   hierarchy.
3. **Build the components** using the `nebula-component-creation` skill.
