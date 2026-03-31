# QA Summary Template

Generate as `docs/qa/qa-summary.md` after completing the QA pass.

```markdown
# Visual QA Summary

## Overview

- Components checked: 8
- Viewports: desktop (1280px), mobile (375px)
- Issues found: 5 (1 critical, 2 high, 1 medium, 1 low)
- Issues resolved: 4
- Issues deferred: 1 (low — sub-pixel rendering difference)

## Per-Component Status

| Component  | Desktop | Mobile            | Issues     | Status   |
| ---------- | ------- | ----------------- | ---------- | -------- |
| hero       | PASS    | PASS              | 1 resolved | verified |
| card       | PASS    | PASS              | 0          | verified |
| header     | PASS    | PASS              | 0          | verified |
| footer     | PASS    | 1 medium resolved | 1 resolved | verified |
| cta-banner | PASS    | PASS              | 0          | verified |

## Deferred Issues

- Low: footer border-radius differs by 1px at mobile (browser rendering)
```
