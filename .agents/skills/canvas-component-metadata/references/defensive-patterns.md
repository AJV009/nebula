# Defensive Prop Handling

Any prop not listed in `required` in component.yml can be null or undefined at
runtime. Guard all optional props before accessing nested properties or
rendering components that expect non-null values.

## Null guards by prop type

### Image

```jsx
// Wrong -- crashes when image is null/undefined
<img src={image.src} alt={image.alt} />;

// Correct
{
  image?.src && <img src={image.src} alt={image.alt || ""} />;
}
```

### Formatted text

```jsx
// Wrong -- FormattedText with null value throws
<FormattedText text={body} />;

// Correct
{
  body && <FormattedText text={body} />;
}
```

### Video

```jsx
// Wrong -- crashes if video is undefined
<video src={video.src} poster={video.poster} />;

// Correct
{
  video?.src && <video src={video.src} poster={video.poster} controls />;
}
```

### Link

```jsx
// Wrong -- crashes if link is null
<a href={link}>Click here</a>;

// Correct -- handle both string and object forms
{
  link && <a href={typeof link === "string" ? link : link.uri}>{linkText}</a>;
}
```

## String-or-object dual format

Some props arrive as either a plain string or an object depending on how content
was authored. Handle both:

```jsx
// Link: "/about" (string) or { uri: "/about", title: "About" } (object)
const href = typeof link === "string" ? link : link?.uri;

// Image: URL string or { src: "...", alt: "..." } object
const imgSrc = typeof image === "string" ? image : image?.src;
```

## CVA defaultVariants

Always provide `defaultVariants` so enum-driven styling doesn't break when a
prop is undefined:

```jsx
// Wrong -- no fallback if color is undefined
const styles = cva("base-class", {
  variants: {
    color: {
      primary: "bg-primary-600 text-white",
      secondary: "bg-gray-100 text-gray-900",
    },
  },
});

// Correct
const styles = cva("base-class", {
  variants: {
    color: {
      primary: "bg-primary-600 text-white",
      secondary: "bg-gray-100 text-gray-900",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});
```

## General rule

Use `?.` for optional chaining and `&&` for conditional rendering on all
optional props.
