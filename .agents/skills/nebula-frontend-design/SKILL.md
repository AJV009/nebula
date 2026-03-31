---
name: nebula-frontend-design
description:
  Guide bold, distinctive design decisions for Canvas components. Use when
  building components from scratch, when designs look generic, or when the user
  wants creative direction beyond mechanical implementation.
---

<!-- Attribution: Adapted from the frontend-design skill by Anthropic. -->
<!-- Original authors: Prithvi Rajasekaran, Alexander Bricken. -->
<!-- Licensed under Apache License 2.0. See LICENSE in this directory. -->
<!-- Modified: Added Canvas-specific adaptations for Nebula projects. -->

# Frontend Design for Canvas Components

This skill guides creation of distinctive, production-grade frontend interfaces
that avoid generic "AI slop" aesthetics. Use it when building Canvas components
from scratch, adapting a reference design, or when components need creative
direction beyond mechanical implementation.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:

- **Purpose**: What problem does this interface solve and who uses it?
- **Tone**: Commit to a direction — brutally minimal, maximalist chaos,
  retro-futuristic, organic, luxury, playful, editorial, brutalist, art deco,
  soft/pastel, industrial. Use for inspiration but design true to the chosen
  aesthetic.
- **Constraints**: Canvas component contract, Tailwind tokens, responsive
  behavior.
- **Differentiation**: What makes this UNFORGETTABLE — the one thing someone
  will remember?

Choose a clear conceptual direction and execute it with precision. Bold
maximalism and refined minimalism both work — the key is intentionality, not
intensity.

## Frontend Aesthetics Guidelines

### Typography

Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts
like Arial and Inter; opt instead for distinctive choices that elevate the
interface. Pair a distinctive display font with a refined body font.

**Canvas implementation:** Define font tokens in `global.css` using the `@theme`
block. Import fonts in `.storybook/preview-head.html` for Storybook and ensure
they're available in the Canvas site's theme.

```css
/* global.css */
@theme {
  --font-display: "Clash Display", sans-serif;
  --font-body: "Satoshi", sans-serif;
}
```

### Color & Theme

Commit to a cohesive aesthetic. Dominant colors with sharp accents outperform
timid, evenly-distributed palettes.

**Canvas implementation:** Define all colors as `@theme` tokens. Use CVA
variants for color scheme props — never hardcode hex values in components.
Reference `canvas-styling-conventions` for the CVA + `cn()` pattern.

```css
/* global.css */
@theme {
  --color-brand: #1a365d;
  --color-accent: #e53e3e;
  --color-surface: #f7fafc;
}
```

### Motion

Use animations for effects and micro-interactions. Prioritize CSS-only
solutions. Focus on high-impact moments: one well-orchestrated page load with
staggered reveals creates more delight than scattered micro-interactions. Use
scroll-triggering and hover states that surprise.

**Canvas consideration:** Components render server-side too. Ensure motion
degrades gracefully — the component should look complete without animation, with
animation enhancing the experience.

### Spatial Composition

Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements.
Generous negative space OR controlled density.

**Canvas implementation:** Spatial composition must work within Canvas Section
and Grid components. Use slots for flexible composition rather than hardcoded
layout structures.

### Backgrounds & Visual Details

Create atmosphere and depth rather than defaulting to solid colors. Apply
gradient meshes, noise textures, geometric patterns, layered transparencies,
dramatic shadows, decorative borders, and grain overlays where they serve the
design intent.

## What to Avoid

NEVER use generic AI-generated aesthetics:

- Overused fonts (Inter, Roboto, Arial, system fonts as primary display type)
- Cliched purple-gradient-on-white color schemes
- Predictable, perfectly symmetric, grid-aligned-everything layouts
- Cookie-cutter card patterns with uniform border-radius
- Designs that lack context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed
for the context. No design should be the same. Vary between light and dark
themes, different fonts, different aesthetics.

## Relationship to Other Skills

**This skill** = WHAT and WHY (aesthetic decisions).
**`canvas-styling-conventions`** = HOW (Tailwind tokens, CVA, `cn()`).
**`implement-design`** = Figma-to-code (1:1 fidelity to an existing design).

Match implementation complexity to the aesthetic vision. Maximalist designs need
elaborate code with extensive animations and effects. Minimalist or refined
designs need restraint, precision, and careful attention to spacing, typography,
and subtle details.
