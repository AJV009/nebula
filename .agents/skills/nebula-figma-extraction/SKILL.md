---
name: nebula-figma-extraction
description:
  Extract design tokens, frame screenshots, verbatim content, and style
  definitions from a Figma file URL. Uses the Figma REST API for heavy
  extraction and Figma MCP for light discovery. Produces the same artifact
  format as nebula-design-extraction (design-tokens.md, content files,
  screenshots, section reference). Use when cloning a Figma design into Canvas
  components.
---

# Design Extraction from Figma

Extract structured design data from a Figma file. This skill captures frame
exports, design tokens from variables/styles, verbatim text content, and section
structure — the same artifacts as `nebula-design-extraction` but sourced from
Figma instead of a live site.

## Prerequisites

- **Figma access token** — set as `FIGMA_TOKEN` environment variable. Get one at
  https://www.figma.com/developers/api#access-tokens
- **Figma file URL** — the page or frame to extract from

## Arguments

- `$1` — **Figma URL** (required). The file/frame to extract from.
- `$2` — **Output directory** (optional). Defaults to `docs/clone/`.

## Content Fidelity Rule

> **ALL text must be extracted character-for-character from Figma text nodes.
> NEVER rephrase, summarize, correct typos, or generate text. If a text node
> cannot be read, mark it as `[UNREADABLE]`.**

## Preflight Checks

Before extraction, verify:

```bash
# Check token exists
test -n "$FIGMA_TOKEN" || echo "Set FIGMA_TOKEN environment variable"

# Test API access
curl -sH "X-Figma-Token: $FIGMA_TOKEN" https://api.figma.com/v1/me
```

## Figma URL Parsing

Extract `fileKey` and `nodeId` from the URL:

```
figma.com/design/:fileKey/:fileName?node-id=:nodeId
  → fileKey, nodeId (convert "-" to ":" in nodeId for API calls)

figma.com/design/:fileKey/branch/:branchKey/:fileName
  → use branchKey as fileKey

figma.com/make/:makeFileKey/:makeFileName
  → use makeFileKey
```

## Two-Tool Strategy

### Figma MCP (light usage — initial discovery)

Use for orientation (1-2 calls, stays within rate limits):

- `get_metadata(fileKey)` — understand file structure, find pages and frames
- `get_screenshot(fileKey, nodeId)` — quick preview of a specific node

### Figma REST API (heavy usage — actual extraction)

Use for all intensive extraction work:

```bash
# Full file structure
curl -sH "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE_KEY"

# Specific node trees (with properties, layout, styles)
curl -sH "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE_KEY/nodes?ids=$NODE_IDS"

# Export frames as PNG at 2x scale
curl -sH "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/images/$FILE_KEY?ids=$NODE_IDS&scale=2&format=png"
# Returns: { "images": { "nodeId": "https://s3-url.png" } }

# Published styles (colors, text, effects, grids)
curl -sH "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE_KEY/styles"

# Local variables (design tokens)
curl -sH "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE_KEY/variables/local"
```

### Rate Limit Handling

- Pace requests: max 2 per second to Figma REST API
- On 429 response: wait for `Retry-After` header duration
- Batch node IDs in image export requests (up to 50 per call)

## Workflow

### Step 1: Discover file structure

Use Figma MCP `get_metadata` or REST API to understand the file:

- Which pages exist
- Which frames are on the target page
- If a `nodeId` was in the URL, scope to that node

### Step 2: Extract design variables and styles

```bash
# Local variables (color primitives, semantic colors, spacing)
curl -sH "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE_KEY/variables/local"

# Published styles (text styles, color styles, effect styles)
curl -sH "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE_KEY/styles"
```

Map Figma variables to design tokens:

```markdown
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
```

### Step 3: Export frames as screenshots

```bash
# Get temporary download URLs for frame exports
curl -sH "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/images/$FILE_KEY?ids=$SECTION_NODE_IDS&scale=2&format=png"

# Download each PNG
curl -o screenshots/desktop/section-01-hero.png "<s3-url>"
curl -o screenshots/desktop/section-02-features.png "<s3-url>"
```

Export the full page frame and each major section frame.

### Step 4: Extract node tree for structure and content

```bash
curl -sH "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE_KEY/nodes?ids=$NODE_IDS"
```

Walk the node tree and extract:

- **TEXT nodes** → verbatim text content, grouped by section/frame
- **Image fills** → media URLs for media-map.md
- **Auto-layout settings** → responsive layout hints (direction, gap, padding)
- **Component instances** → what Figma components are used

### Step 5: Generate content file

Output `content/<page-name>.md` in the same format as
`nebula-design-extraction`:

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

### Step 6: Generate remaining artifacts

Produce the same output structure as `nebula-design-extraction`:

- `design-tokens.md` — from Figma variables and styles
- `section-reference.md` — frame-to-screenshot mapping
- `media-map.md` — image fills and exported assets
- `figma-reference.md` — Figma-specific extras: node IDs, component instance
  names, Code Connect snippets (if available)

### Step 7: Mobile considerations

Check if mobile frames exist in the file:

- **If yes:** Export those too, save to `screenshots/mobile/`
- **If no:** Note in section-reference.md that mobile designs are not available.
  The QA skill will verify responsive behavior against best judgment rather than
  a mobile reference.

## Output Artifacts

```
docs/clone/
├── screenshots/
│   ├── desktop/
│   │   ├── full-page.png
│   │   ├── section-01-hero.png
│   │   └── ...
│   └── mobile/              (if mobile frames exist)
│       └── ...
├── content/
│   └── <page-name>.md
├── design-tokens.md
├── section-reference.md
├── media-map.md
└── figma-reference.md       (node IDs, component instances, Code Connect)
```

## Relationship to implement-design

|            | implement-design                | nebula-figma-extraction                       |
| ---------- | ------------------------------- | --------------------------------------------- |
| Purpose    | Translate one component to code | Extract all design data from a page           |
| Output     | Component code                  | Artifact files (tokens, content, screenshots) |
| Figma tool | Figma MCP only                  | REST API (heavy) + MCP (light)                |
| Scope      | Single node                     | Full page with all sections                   |

They're complementary. This skill extracts raw materials. `implement-design` can
be used during component building to get Code Connect context for individual
nodes.

## Cleanup

No browser sessions to close (Figma extraction uses REST API, not browser).
