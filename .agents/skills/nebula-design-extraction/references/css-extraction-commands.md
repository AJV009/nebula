# CSS Extraction Commands

Use `playwright-cli eval` to extract computed styles from the page context.
Repeat each block at mobile viewport (375px) to capture responsive changes.

## Colors

```bash
playwright-cli eval "getComputedStyle(document.querySelector('.hero')).backgroundColor" -s=extract
playwright-cli eval "getComputedStyle(document.querySelector('.hero')).color" -s=extract
playwright-cli eval "getComputedStyle(document.querySelector('h1')).color" -s=extract
```

## Typography

```bash
playwright-cli eval "getComputedStyle(document.querySelector('h1')).fontFamily" -s=extract
playwright-cli eval "getComputedStyle(document.querySelector('h1')).fontSize" -s=extract
playwright-cli eval "getComputedStyle(document.querySelector('h1')).fontWeight" -s=extract
playwright-cli eval "getComputedStyle(document.querySelector('h1')).lineHeight" -s=extract
```

## Spacing

```bash
playwright-cli eval "getComputedStyle(document.querySelector('section')).padding" -s=extract
playwright-cli eval "getComputedStyle(document.querySelector('.container')).maxWidth" -s=extract
```

## Effects

```bash
playwright-cli eval "getComputedStyle(document.querySelector('.card')).boxShadow" -s=extract
playwright-cli eval "getComputedStyle(document.querySelector('.card')).borderRadius" -s=extract
```

## Responsive Workflow

```bash
# Extract at desktop first (1280px), then resize and repeat
playwright-cli resize 375 812 -s=extract
# Re-run the above eval commands at mobile viewport
# Reset when done
playwright-cli resize 1280 900 -s=extract
```
