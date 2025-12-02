import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const Header = ({ branding, navigation, backgroundColor }) => {
  const headerVariants = cva("", {
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
    <header
      className={headerVariants({
        backgroundColor,
      })}
    >
      <div className="mx-auto flex h-24 max-w-screen-xl min-w-sm items-center justify-between gap-x-12 px-4 sm:px-12 md:h-32 lg:gap-x-16 lg:px-16">
        <div
          className={cn(
            "h-12 flex-shrink-0 items-center justify-start md:h-16",
            branding?.props?.value?.includes(
              "canvas--slot-empty-placeholder",
            ) && "min-w-32",
          )}
        >
          {branding}
        </div>
        <div className="flex h-12 flex-grow items-center justify-end md:h-16">
          {navigation}
        </div>
      </div>
    </header>
  );
};

export default Header;
