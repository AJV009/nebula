# Creating content lists

When creating content lists:

1. Analyze the structure of the list.
2. Determine what content type to use for the list:

- check JSON:API endpoint of a local Drupal site configured using
  `CANVAS_SITE_URL` and `CANVAS_JSONAPI_PREFIX` environment variables for a
  content type that matches the structure of the list (use plain fetch for this
  check),
- if matching content type exists, use it,
- if matching content type does not exist, before processing further, prompt
  user to create a new content type and provide its name and field structure
  based on the data required for the list.

3. Create a new content list component that will use JSON:API to fetch content
   of type determined in step 2 using JSON:API. Use only fields that actually
   exist in the content type.

## Content list filters

If the list has filters on entity reference fields, don't hardcode available
options, fetch them for each filter using JSON:API.
