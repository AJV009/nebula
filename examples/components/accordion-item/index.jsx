import { useEffect, useId, useRef, useState } from "react";
import { cn } from "drupal-canvas";

const PlusIcon = () => (
  <svg
    aria-hidden="true"
    className="block size-3.5"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      d="M5 12h14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M12 5v14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const MinusIcon = () => (
  <svg
    aria-hidden="true"
    className="block size-3.5"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      d="M5 12h14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const ChevronIcon = ({ isOpen }) => (
  <svg
    aria-hidden="true"
    className={cn(
      "size-4 shrink-0 transition-transform duration-300",
      isOpen ? "rotate-180" : "rotate-0",
    )}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      d="m6 9 6 6 6-6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const AccordionItem = ({
  anchorId,
  className,
  content,
  defaultOpen = false,
  headingElement = "h3",
  title,
}) => {
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const itemRef = useRef(null);
  const [groupState, setGroupState] = useState({
    borderColor: "gray_200",
    isFirstItem: true,
    isLastItem: true,
    variant: "default",
  });
  const reactId = useId();
  const safeId = reactId.replace(/:/g, "");
  const buttonId = `accordion-item-button-${safeId}`;
  const panelId = `accordion-item-panel-${safeId}`;
  const HeadingElement = headingElement;
  const isOpen = localOpen;

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;
    const group = el.closest("[data-accordion-group]");
    if (!group) return;
    const variant = group.getAttribute("data-variant") || "default";
    const borderColor = group.getAttribute("data-border-color") || "gray_200";
    const items = group.querySelectorAll("[data-accordion-item]");
    const index = Array.from(items).indexOf(el);
    setGroupState({
      borderColor,
      isFirstItem: index === 0,
      isLastItem: index === items.length - 1,
      variant,
    });
  }, []);

  useEffect(() => {
    setLocalOpen(defaultOpen);
  }, [defaultOpen]);

  useEffect(() => {
    if (!anchorId) return;
    const checkHash = () => {
      // Open the item if the anchor ID is in the URL.
      if (window.location.hash === `#${anchorId}`) {
        setLocalOpen(true);
        // Scroll the item into view after the panel has expanded.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            itemRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          });
        });
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, [anchorId]);

  const {
    borderColor: groupBorderColor,
    isFirstItem,
    isLastItem,
    variant: groupVariant,
  } = groupState;

  const handleToggle = () => {
    setLocalOpen((prev) => !prev);
  };

  const borderColorClassName = {
    gray_200: "border-gray-200",
    gray_300: "border-gray-300",
    gray_400: "border-gray-400",
    primary_200: "border-primary-200",
    primary_300: "border-primary-300",
  };

  const itemClassName = cn(
    "w-full",
    groupVariant === "bordered" && "border bg-white",
    groupVariant === "bordered" && !isFirstItem && "-mt-px",
    groupVariant === "bordered" && isFirstItem && "rounded-t-lg",
    groupVariant === "bordered" && isLastItem && "rounded-b-lg",
    groupVariant === "separated" && "rounded-xl border bg-white",
    (groupVariant === "bordered" || groupVariant === "separated") &&
      borderColorClassName[groupBorderColor],
    className,
  );

  const buttonClassName = cn(
    "flex w-full items-center gap-3 text-left font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
    groupVariant === "default" &&
      "justify-between py-4 text-base text-black hover:text-primary-700",
    groupVariant === "bordered" &&
      "px-5 py-4 text-base text-black hover:text-gray-700",
    groupVariant === "separated" &&
      "justify-between px-4 py-4 text-base text-black hover:text-primary-700",
  );

  const contentOuterClassName = cn(
    "w-full overflow-hidden",
    !isOpen && "hidden",
  );

  const contentInnerClassName = cn(
    "pb-4 text-gray-700",
    groupVariant === "bordered" && "px-5",
    groupVariant === "separated" && "px-4",
  );

  return (
    <div
      className={itemClassName}
      data-accordion-item
      id={anchorId || undefined}
      ref={itemRef}
    >
      <HeadingElement className="m-0">
        <button
          aria-controls={panelId}
          aria-expanded={isOpen}
          className={buttonClassName}
          data-accordion-button
          id={buttonId}
          onClick={handleToggle}
          type="button"
        >
          {groupVariant === "bordered" ? (
            <>
              {isOpen ? <MinusIcon /> : <PlusIcon />}
              <span>{title}</span>
            </>
          ) : (
            <>
              <span>{title}</span>
              <ChevronIcon isOpen={isOpen} />
            </>
          )}
        </button>
      </HeadingElement>

      <div
        aria-labelledby={buttonId}
        className={contentOuterClassName}
        data-accordion-content
        id={panelId}
        role="region"
      >
        <div className={contentInnerClassName}>{content}</div>
      </div>
    </div>
  );
};

export default AccordionItem;
