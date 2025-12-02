import Navigation from "@/components/navigation";
import Section from "@/components/section";

export default {
  title: "Components/Navigation",
  component: Navigation,
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
