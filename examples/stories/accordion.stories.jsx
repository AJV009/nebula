import Accordion from "@/components/accordion";
import AccordionItem from "@/components/accordion-item";

export default {
  title: "Components/Accordion",
  component: Accordion,
  argTypes: {
    allowMultiple: {
      control: "boolean",
    },
    borderColor: {
      control: "select",
      options: [
        "gray_200",
        "gray_300",
        "gray_400",
        "primary_200",
        "primary_300",
      ],
    },
    variant: {
      control: "select",
      options: ["default", "bordered", "separated"],
    },
  },
};

const ItemContent = ({ text }) => <p className="text-gray-700">{text}</p>;

const sampleItems = (
  <>
    <AccordionItem
      content={
        <ItemContent text="Accordion items support slot-based content, including nested components." />
      }
      defaultOpen
      title="What does this accordion support?"
    />
    <AccordionItem
      content={
        <ItemContent text="Set allowMultiple to false on the parent to keep only one item open at a time." />
      }
      title="Can only one item be open?"
    />
    <AccordionItem
      content={
        <ItemContent text="Use the Default Open prop in Canvas when you need editorial visibility for an item." />
      }
      title="How do editors preview content?"
    />
  </>
);

export const Default = {
  args: {
    allowMultiple: true,
    borderColor: "gray_200",
    variant: "default",
    items: sampleItems,
  },
};

export const SingleOpen = {
  args: {
    allowMultiple: false,
    borderColor: "gray_200",
    variant: "default",
    items: sampleItems,
  },
};

export const Bordered = {
  args: {
    allowMultiple: true,
    borderColor: "gray_200",
    variant: "bordered",
    items: sampleItems,
  },
};

export const Separated = {
  args: {
    allowMultiple: true,
    borderColor: "gray_200",
    variant: "separated",
    items: sampleItems,
  },
};
