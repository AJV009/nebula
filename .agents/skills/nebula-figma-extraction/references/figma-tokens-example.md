# Design Tokens Mapping Example

Map Figma variables and styles to design-tokens.md format.

## Colors (from variable collection "Colors")

| Token         | Value   | Figma Variable         |
| ------------- | ------- | ---------------------- |
| primary       | #1B4D3E | Colors/Primary/Default |
| primary-light | #2A7A5E | Colors/Primary/Light   |
| accent        | #F5A623 | Colors/Accent/Default  |

## Typography (from text styles)

| Style        | Font             | Size | Weight  | Line Height |
| ------------ | ---------------- | ---- | ------- | ----------- |
| Heading/H1   | Playfair Display | 56   | Bold    | 64          |
| Body/Regular | Inter            | 18   | Regular | 28          |

## Content File Format

Output `content/<page-name>.md`:

```markdown
# <Page Title>

## Section 1: Hero

<!-- Context: Full-width hero frame -->
<!-- Layout: Auto-layout vertical, center-aligned -->
<!-- Screenshot: screenshots/desktop/section-01-hero.png -->

### Heading

Welcome to Our Platform

### Body

The text exactly as it appears in the Figma text node.
```
