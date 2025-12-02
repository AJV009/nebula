import FormattedText from "@/lib/FormattedText";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const Footer = ({
  branding,
  copyrightNotice,
  backgroundColor,
}) => {
  const footerVariants = cva("", {
    variants: {
      backgroundColor: {
        base: "bg-base",
        mantle: "bg-mantle",
        crust: "bg-crust",
      },
    },
    defaultVariants: {
      backgroundColor: "base",
    },
  });
  return (
    <footer
      className={footerVariants({
        backgroundColor,
      })}
    >
      <div className="mx-auto flex max-w-screen-md min-w-sm flex-col items-center gap-12 p-12 md:p-16">
        <div
          className={cn(
            "h-12 flex-shrink-0 items-center justify-start",
            branding?.props?.value?.includes(
              "canvas--slot-empty-placeholder",
            ) && "min-w-32",
          )}
        >
          {branding}
        </div>
        <FormattedText as="p" className="text-sm text-text">
          {copyrightNotice}
        </FormattedText>
      </div>
    </footer>
  );
};

export default Footer;
