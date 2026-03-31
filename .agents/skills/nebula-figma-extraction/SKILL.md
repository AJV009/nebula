---
name: nebula-figma-extraction
description:
  Extract design tokens, frame screenshots, and verbatim content from a Figma
  file. Use when cloning a Figma design into Canvas components. Uses Figma REST
  API for heavy extraction, MCP for light discovery.
compatibility:
  Requires FIGMA_TOKEN environment variable. Figma MCP optional for discovery.
---

# Design Extraction from Figma

> **Content fidelity rule: ALL text must be extracted character-for-character
> from Figma text nodes. NEVER rephrase, summarize, correct typos, or generate
> text. If a text node cannot be read, mark it as `[UNREADABLE]`.**

## Arguments

- `$1` -- **Figma URL** (required). The file/frame to extract from.
- `$2` -- **Output directory** (optional). Defaults to `docs/clone/`.

## Two-Tool Strategy

**Figma MCP** -- light usage for initial discovery only (1-2 calls):

- `get_metadata(fileKey)` -- understand file structure, find pages and frames
- `get_screenshot(fileKey, nodeId)` -- quick preview of a specific node

**Figma REST API** -- all intensive extraction work. See
[references/figma-api-commands.md](references/figma-api-commands.md) for full
curl examples. The REST API avoids MCP rate limits and supports batch
operations.

## Figma URL Parsing

Extract `fileKey` and `nodeId` from the URL. Convert `-` to `:` in nodeId for
API calls.

```
figma.com/design/:fileKey/:fileName?node-id=:nodeId
  -> fileKey, nodeId (convert "-" to ":" for API)

figma.com/design/:fileKey/branch/:branchKey/:fileName
  -> use branchKey as fileKey

figma.com/make/:makeFileKey/:makeFileName
  -> use makeFileKey
```

## Rate Limit Handling

- Max 2 requests per second to Figma REST API
- On 429 response: wait for `Retry-After` header duration
- Batch node IDs in image export requests (up to 50 per call)

## Workflow

- [ ] Parse Figma URL -- extract fileKey and nodeId
- [ ] Preflight: verify FIGMA_TOKEN and API access
- [ ] Discover file structure (Figma MCP `get_metadata`)
- [ ] Extract variables and styles (REST API)
- [ ] Export frames as PNG screenshots at 2x (REST API)
- [ ] Extract node tree for content and structure (REST API)
- [ ] Walk node tree: TEXT nodes for verbatim content, image fills for media,
      auto-layout for responsive hints, component instances for structure
- [ ] Generate `content/<page-name>.md` with verbatim text grouped by section
- [ ] Generate `design-tokens.md`, `section-reference.md`, `media-map.md`,
      `figma-reference.md`
- [ ] Check for mobile frames -- export to `screenshots/mobile/` if present,
      note absence in section-reference.md if not

See [references/figma-tokens-example.md](references/figma-tokens-example.md) for
design token mapping and content file format examples.

## Mobile Frame Considerations

If mobile frames exist in the file, export them to `screenshots/mobile/`. If no
mobile frames exist, note this in section-reference.md so downstream skills know
to verify responsive behavior against best judgment rather than a mobile
reference.

## Output Artifacts

```
docs/clone/
  screenshots/
    desktop/
      full-page.png           -- full page export
      section-01-hero.png     -- per-section exports
    mobile/                   -- if mobile frames exist
  content/
    <page-name>.md            -- verbatim text grouped by section
  design-tokens.md            -- Figma variables and styles as tokens
  section-reference.md        -- frame-to-screenshot mapping
  media-map.md                -- image fills and exported assets
  figma-reference.md          -- node IDs, component instances, Code Connect
```

## Relationship to implement-design

This skill extracts raw design materials (tokens, content, screenshots) from a
full page. `implement-design` translates a single Figma node into component code
using MCP. They are complementary: extract first, then implement per component.
