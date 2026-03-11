import { useEffect, useId, useRef, useState } from "react";
import { cn } from "drupal-canvas";

const ACCORDION_OPEN_EVENT = "accordion-item:open";

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
  className,
  content,
  defaultOpen = false,
  headingElement = "h3",
  title,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [groupBorderColor, setGroupBorderColor] = useState("gray_200");
  const [isFirstItem, setIsFirstItem] = useState(true);
  const [isLastItem, setIsLastItem] = useState(true);
  const [groupVariant, setGroupVariant] = useState("default");
  const itemRef = useRef(null);
  const reactId = useId();
  const safeId = reactId.replace(/:/g, "");
  const buttonId = `accordion-item-button-${safeId}`;
  const panelId = `accordion-item-panel-${safeId}`;
  const HeadingElement = headingElement;

  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  useEffect(() => {
    const itemElement = itemRef.current;
    const groupElement = itemRef.current?.closest("[data-accordion-group]");
    if (!groupElement || !itemElement) return;

    const syncGroupAttributes = () => {
      const nextBorderColor =
        groupElement.getAttribute("data-border-color") ?? "gray_200";
      const nextVariant =
        groupElement.getAttribute("data-variant") ?? "default";
      const groupItems = Array.from(
        groupElement.querySelectorAll("[data-accordion-item]"),
      );
      const itemIndex = groupItems.indexOf(itemElement);

      setGroupBorderColor((previousValue) =>
        previousValue === nextBorderColor ? previousValue : nextBorderColor,
      );
      setGroupVariant((previousValue) =>
        previousValue === nextVariant ? previousValue : nextVariant,
      );
      setIsFirstItem((previousValue) =>
        previousValue === itemIndex <= 0 ? previousValue : itemIndex <= 0,
      );
      setIsLastItem((previousValue) =>
        previousValue ===
        (itemIndex === -1 || itemIndex === groupItems.length - 1)
          ? previousValue
          : itemIndex === -1 || itemIndex === groupItems.length - 1,
      );
    };

    syncGroupAttributes();

    const observer = new MutationObserver(syncGroupAttributes);
    observer.observe(groupElement, {
      attributeFilter: ["data-border-color", "data-variant"],
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const groupElement = itemRef.current?.closest("[data-accordion-group]");
    const allowsMultiple =
      groupElement?.getAttribute("data-allow-multiple") === "true";

    if (!groupElement || allowsMultiple) return;

    const handleSiblingOpen = (event) => {
      const openedId = event?.detail?.id;
      if (openedId && openedId !== safeId) {
        setIsOpen(false);
      }
    };

    groupElement.addEventListener(ACCORDION_OPEN_EVENT, handleSiblingOpen);

    if (defaultOpen) {
      groupElement.dispatchEvent(
        new CustomEvent(ACCORDION_OPEN_EVENT, { detail: { id: safeId } }),
      );
    }

    return () => {
      groupElement.removeEventListener(ACCORDION_OPEN_EVENT, handleSiblingOpen);
    };
  }, [defaultOpen, safeId]);

  const handleToggle = () => {
    setIsOpen((previousValue) => {
      const nextValue = !previousValue;

      if (nextValue) {
        const groupElement = itemRef.current?.closest("[data-accordion-group]");
        const allowsMultiple =
          groupElement?.getAttribute("data-allow-multiple") === "true";

        if (groupElement && !allowsMultiple) {
          groupElement.dispatchEvent(
            new CustomEvent(ACCORDION_OPEN_EVENT, { detail: { id: safeId } }),
          );
        }
      }

      return nextValue;
    });
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
    <div className={itemClassName} data-accordion-item ref={itemRef}>
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
