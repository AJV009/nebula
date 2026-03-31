# Figma REST API Commands

All commands require `FIGMA_TOKEN` environment variable.

## File Structure

```bash
curl -sH "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE_KEY"
```

## Specific Node Trees

Retrieve properties, layout, and styles for specific nodes:

```bash
curl -sH "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE_KEY/nodes?ids=$NODE_IDS"
```

## Export Frames as PNG

Export at 2x scale. Returns temporary S3 download URLs.

```bash
# Get download URLs
curl -sH "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/images/$FILE_KEY?ids=$NODE_IDS&scale=2&format=png"
# Response: { "images": { "nodeId": "https://s3-url.png" } }

# Download each PNG
curl -o screenshots/desktop/section-01-hero.png "<s3-url>"
curl -o screenshots/desktop/section-02-features.png "<s3-url>"
```

Batch node IDs in image export requests (up to 50 per call).

## Published Styles

Colors, text styles, effects, grids:

```bash
curl -sH "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE_KEY/styles"
```

## Local Variables (Design Tokens)

Color primitives, semantic colors, spacing:

```bash
curl -sH "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE_KEY/variables/local"
```

## Preflight Check

```bash
# Verify token exists
test -n "$FIGMA_TOKEN" || echo "Set FIGMA_TOKEN environment variable"

# Test API access
curl -sH "X-Figma-Token: $FIGMA_TOKEN" https://api.figma.com/v1/me
```
