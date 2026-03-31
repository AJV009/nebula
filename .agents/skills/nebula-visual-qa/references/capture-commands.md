# Playwright CLI Capture Commands

## Capture reference screenshots from source site

```bash
playwright-cli open <source-url> -s=source
playwright-cli screenshot --full-page --filename=ref-desktop.png -s=source
playwright-cli resize 375 812 -s=source
playwright-cli screenshot --full-page --filename=ref-mobile.png -s=source
playwright-cli close -s=source
```

## Capture Storybook renders

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

## Named sessions for simultaneous comparison

Keep source and Storybook open side-by-side:

```bash
playwright-cli -s=source open <source-url>
playwright-cli -s=storybook open http://localhost:6006/iframe.html?id=...
playwright-cli -s=source screenshot --full-page
playwright-cli -s=storybook screenshot --full-page
```

## Cleanup

```bash
playwright-cli close-all
```
