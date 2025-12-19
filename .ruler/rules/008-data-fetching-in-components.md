# Data fetching in components

Use SWR for general data fetching.

```jsx
import useSWR from "swr";

export default function Profile() {
  const { data, error, isLoading } = useSWR(
    "https://my-site.com/api/user",
    fetcher,
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  return <div>hello {data.name}!</div>;
}
```

## JSON:API

For fetching data from Drupal (e.g. content items for a list) use the
autoconfigured JsonApiClient from `drupal-canvas` package.

Don't mock JSON:API resources in storybook stories.

```jsx
import { getNodePath, JsonApiClient } from "drupal-canvas";
import { DrupalJsonApiParams } from "drupal-jsonapi-params";
import useSWR from "swr";

const Articles = () => {
  const client = new JsonApiClient();
  const { data, error, isLoading } = useSWR(
    [
      "node--article",
      {
        queryString: new DrupalJsonApiParams()
          .addSort("created", "DESC")
          .getQueryString(),
      },
    ],
    ([type, options]) => client.getCollection(type, options),
  );

  if (error) return "An error has occurred.";
  if (isLoading) return "Loading...";
  return (
    <ul>
      {data.map((article) => (
        <li key={article.id}>
          <a href={getNodePath(article)}>{article.title}</a>
        </li>
      ))}
    </ul>
  );
};

export default Articles;
```

## Including relationships with `addInclude`

**Avoid circular references in JSON:API responses.** SWR uses deep equality
checks to compare cached data, which fails with "too much recursion" errors when
the response contains circular references.

**Do not include self-referential fields.** Fields that reference the same
entity type being queried (e.g., `field_related_articles` on an article query)
create circular references: Article A references Article B, which references
back to Article A. If you need related content of the same type, fetch it in a
separate query.

**Use `addFields` to limit the response.** It is good practice to specify only
the fields you need. This improves performance and helps avoid circular
reference issues:

```jsx
const params = new DrupalJsonApiParams();
params.addSort("created", "DESC");
params.addInclude(["field_category", "field_image"]);

params.addFields("node--article", [
  "title",
  "created",
  "field_category",
  "field_image",
]);
params.addFields("taxonomy_term--categories", ["name"]);
params.addFields("file--file", ["uri", "url"]);
```
