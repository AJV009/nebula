# Common Fix Patterns

| Issue Type       | Fix Location                      | Pattern                                |
| ---------------- | --------------------------------- | -------------------------------------- |
| Wrong color      | CVA variant or `@theme` token     | Map to correct design token            |
| Wrong typography | `@theme` font or component styles | Match font-family, weight, size        |
| Wrong spacing    | Tailwind classes                  | Match padding/margin/gap values        |
| Layout broken    | Flex/grid structure               | Compare direction, alignment, wrapping |
| Missing effect   | Component styles                  | Add shadow, gradient, blur             |
| Responsive issue | Responsive Tailwind classes       | Add breakpoint-specific classes        |
