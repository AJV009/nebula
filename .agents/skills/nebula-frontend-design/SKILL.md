---
name: nebula-frontend-design
description:
  Create distinctive, production-grade frontend interfaces with high design
  quality. Use when building components from scratch or adapting designs to
  avoid generic AI aesthetics. Guides aesthetic decisions (WHAT and WHY) while
  canvas-styling-conventions handles implementation (HOW).
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

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick a direction and commit to it: brutally minimal, maximalist
  chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like,
  editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel,
  industrial/utilitarian. Use these for inspiration but design one that is true
  to the aesthetic direction.
- **Constraints**: Technical requirements (Canvas component contract, Tailwind
  tokens, responsive behavior).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing
  someone will remember?

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

- Overused font families (Inter, Roboto, Arial, system fonts as primary)
- Cliched color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character
- Perfectly symmetric, grid-aligned everything
- Standard border-radius on everything
- The same card layout every time

Interpret creatively and make unexpected choices that feel genuinely designed
for the context. No design should be the same. Vary between light and dark
themes, different fonts, different aesthetics.

## Relationship to Other Skills

- **This skill** = WHAT and WHY (aesthetic decisions, design direction)
- **`canvas-styling-conventions`** = HOW (Tailwind tokens, CVA patterns, `cn()`)
- **`implement-design`** = Figma-to-code translation (1:1 fidelity to an
  existing design)

This skill is for when you're making design decisions. If you're implementing an
existing Figma design, use `implement-design` instead. If you need to know how
to write the CSS/Tailwind, load `canvas-styling-conventions`.

Match implementation complexity to the aesthetic vision. Maximalist designs need
elaborate code with extensive animations and effects. Minimalist or refined
designs need restraint, precision, and careful attention to spacing, typography,
and subtle details.
