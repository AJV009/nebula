# Content File — Example Format

Output to `content/<page-name>.md`. Each section includes metadata comments for
Context, Layout, and Screenshot paths. Text is extracted
character-for-character.

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
