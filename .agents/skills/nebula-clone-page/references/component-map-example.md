# Component Map Example

Output `docs/clone/component-map.md` with this format:

```markdown
# Component Map

| Section  | Strategy | Component       | Notes                                 |
| -------- | -------- | --------------- | ------------------------------------- |
| Hero     | BUILD    | hero            | Full-width with background image, CTA |
| Features | BUILD    | feature-card    | 3-column card grid                    |
| About    | REUSE    | two-column-text | Existing component fits               |
| CTA      | ADAPT    | section         | Add dark background variant           |
| Footer   | REUSE    | footer          | Existing component fits               |
```

## Classification Rules

For each section identified in `docs/clone/section-reference.md`:

- **REUSE** -- an existing component matches the section's needs exactly
- **ADAPT** -- an existing component needs a new variant, props, or slot
- **BUILD** -- no existing component fits; create a new one
