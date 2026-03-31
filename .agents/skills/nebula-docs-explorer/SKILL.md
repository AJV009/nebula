---
name: nebula-docs-explorer
description:
  Search and fetch Canvas and Drupal CMS documentation pages. Takes a query
  describing what you need to know (e.g., "code components", "page regions",
  "known issues", "data fetching") and returns the full content of matching
  documentation pages. Use whenever you need to understand how Canvas or Drupal
  CMS works, verify platform behavior, check for limitations, or find
  configuration options.
---

# Canvas & Drupal CMS Documentation Explorer

Fetch and return official Canvas and Drupal CMS documentation relevant to a
query. This skill searches a curated URL catalog, identifies the most relevant
pages, fetches their full content, and returns it.

## Arguments

- `$1` — **Query** (required). A natural language description of what you need
  to know. Examples:
  - `"known issues and limitations"`
  - `"code components props slots"`
  - `"data fetching SWR JsonApiClient"`
  - `"page regions configuration"`
  - `"creating custom components"`
  - `"packages FormattedText cn"`
  - `"JSON:API write mode"`

## Execution

### Step 1: Match URLs to the query

From the URL catalog below, identify **all pages relevant** to the query. Match
by:

- URL path segments (e.g., query "data fetching" matches the data-fetching URL)
- Semantic relevance (e.g., query "component creation" matches code-components,
  packages, and getting-started)
- Always include the Known Issues inline content (below) if the query relates to
  components, Tailwind, Canvas, or troubleshooting

Be generous with matching — it's better to fetch an extra page than miss a
relevant one.

### Step 2: Fetch matched pages

For each matched URL, use `WebFetch` to retrieve the page content. Fetch pages
in parallel where possible for speed.

Use this prompt for each fetch:

> "Extract the COMPLETE content of this page. Return all text, code examples,
> tables, steps, warnings, and notes. Do not summarize — return everything."

### Step 3: Return results

Return all fetched content organized by page, with clear headers:

```
## <Page Title> — <URL>

<full page content>

---

## <Next Page Title> — <URL>

<full page content>
```

If a page fails to load (404, 503, timeout), note the failure and continue with
remaining pages.

## URL Catalog

### Canvas Official Documentation

| Topic                                                   | URL                                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Canvas Overview                                         | `https://project.pages.drupalcode.org/canvas/`                                 |
| Code Components                                         | `https://project.pages.drupalcode.org/canvas/code-components/`                 |
| Getting Started                                         | `https://project.pages.drupalcode.org/canvas/code-components/getting-started/` |
| Component Definition                                    | `https://project.pages.drupalcode.org/canvas/code-components/definition/`      |
| Component Props                                         | `https://project.pages.drupalcode.org/canvas/code-components/props/`           |
| Component Slots                                         | `https://project.pages.drupalcode.org/canvas/code-components/slots/`           |
| Packages (FormattedText, cn, CVA, SWR)                  | `https://project.pages.drupalcode.org/canvas/code-components/packages/`        |
| Data Fetching (getPageData, getSiteData, JsonApiClient) | `https://project.pages.drupalcode.org/canvas/code-components/data-fetching/`   |
| Styling                                                 | `https://project.pages.drupalcode.org/canvas/code-components/styling/`         |
| Upload & Deploy                                         | `https://project.pages.drupalcode.org/canvas/code-components/upload/`          |
| Canvas CLI                                              | `https://project.pages.drupalcode.org/canvas/code-components/cli/`             |
| Page Regions                                            | `https://project.pages.drupalcode.org/canvas/page-regions/`                    |
| Known Issues                                            | `https://project.pages.drupalcode.org/canvas/known-issues/`                    |

### Drupal CMS Documentation

| Topic                           | URL                                                      |
| ------------------------------- | -------------------------------------------------------- |
| Drupal CMS Overview             | `https://new.drupal.org/docs/drupal-cms`                 |
| Getting Started with Drupal CMS | `https://new.drupal.org/docs/drupal-cms/getting-started` |

### Drupal Core Reference

| Topic           | URL                                                                               |
| --------------- | --------------------------------------------------------------------------------- |
| JSON:API Module | `https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module` |
| Menu System     | `https://www.drupal.org/docs/drupal-apis/menu-api`                                |

## Critical Known Issues (Inline — Always Available)

These are known issues that should be referenced WITHOUT needing to fetch the
docs page. Return these inline whenever the query relates to components,
Tailwind, Canvas, or troubleshooting:

1. **Never remove components via the Component Library UI** — triggers an error
   that can break the site. Use the Code component panel instead.
2. **Tailwind directives** (`@apply`, `@layer`, etc.) work in `global.css` only
   — NOT in component-specific CSS files.
3. **Tailwind square bracket notation** does not work with `@apply`. Use
   `@theme` variables instead.
4. **Canvas page regions** may default to `status: false` on fresh installs.
   Header/footer won't render until page regions are enabled.
5. **JSON:API read-only mode** — Drupal may default to read-only. If write
   operations return 405, enable writes in Drupal admin or via drush.
6. **Media image field name** — field name may vary between Drupal distributions
   (`field_media_image` vs `media_image`). Check the actual field name on the
   target site.
7. **Component JS crashes** — unguarded null access in a component will crash
   the page renderer. Always guard optional props with `?.` and `&&`.
