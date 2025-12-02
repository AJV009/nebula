import Logo from "@/components/logo";
import Section from "@/components/section";

export default {
  title: "Components/Logo",
  component: Logo,
};

const Decorator = ({ children }) => <Section content={children} />;

export const Default = {
  decorators: [
    (Story) => (
      <Decorator>
        <Story />
      </Decorator>
    ),
  ],
};

export const NoLink = {
  args: {
    linkToFrontPage: false,
  },
  decorators: [
    (Story) => (
      <Decorator>
        <Story />
      </Decorator>
    ),
  ],
};
