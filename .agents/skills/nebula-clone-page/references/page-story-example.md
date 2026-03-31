# Page Story Example

Create the page story at `src/stories/example-pages/<page-name>.stories.jsx`:

```jsx
import FeatureCard from "@/components/feature-card";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Section from "@/components/section";
import Spacer from "@/components/spacer";

import PageLayout from "./page-layout";

// Props use VERBATIM text from docs/clone/content/<page>.md
const heroProps = {
  heading: "Welcome to Our Company", // exact text from content file
  subheading: "Building the future, one component at a time.",
  ctaText: "Get Started",
  ctaLink: "/contact",
};

const ClonedPage = () => (
  <PageLayout>
    <Hero {...heroProps} />
    <Spacer height="large" />
    <Section width="normal" content={<FeatureCard {...featureProps} />} />
    <Spacer height="large" />
    <Footer />
  </PageLayout>
);

export default {
  title: "Example pages/<Page Name>",
  component: ClonedPage,
  parameters: { layout: "fullscreen" },
};

export const Default = { name: "<Page Name>" };
```

Notes:

- Create or update `src/stories/example-pages/page-layout.jsx` if it doesn't
  exist (see `nebula-page-stories` skill for the PageLayout pattern)
- Verify the page story renders in Storybook after creation
