import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type MultiSelectOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type MultiSelectProps<TValue extends string> = {
  className?: string;
  label: string;
  onValuesChange: (values: TValue[]) => void;
  options: Array<MultiSelectOption<TValue>>;
  placeholder: string;
  values: TValue[];
};

function cx(...classNames: Array<string | false | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}

export function MultiSelect<TValue extends string>({
  className,
  label,
  onValuesChange,
  options,
  placeholder,
  values,
}: MultiSelectProps<TValue>) {
  const [isOpen, setIsOpen] = useState(false);
  const labelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedValues = new Set(values);
  const selectedOptions = options.filter((option) =>
    selectedValues.has(option.value),
  );
  const summary =
    selectedOptions.length === 0
      ? placeholder
      : selectedOptions.length <= 2
        ? selectedOptions.map((option) => option.label).join(", ")
        : `${selectedOptions.length} selected`;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleDocumentMouseDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleDocumentKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentMouseDown);
    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [isOpen]);

  function toggleValue(value: TValue) {
    const nextValues = new Set(values);

    if (nextValues.has(value)) {
      nextValues.delete(value);
    } else {
      nextValues.add(value);
    }

    onValuesChange(
      options
        .map((option) => option.value)
        .filter((optionValue) => nextValues.has(optionValue)),
    );
  }

  return (
    <div ref={rootRef} className={cx("relative min-w-0", className)}>
      <span id={labelId} className="sr-only">
        {label}
      </span>
      <button
        type="button"
        className="inline-flex h-9 w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-md border border-(--border) bg-(--surface) px-3 text-left text-sm text-(--text-h) outline-none focus-visible:border-(--accent-border) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span
          className={cx(
            "min-w-0 truncate",
            selectedOptions.length === 0 && "text-(--text-muted)",
          )}
        >
          {summary}
        </span>
        <ChevronDown className="size-4 shrink-0 text-(--text-muted)" />
      </button>

      {isOpen ? (
        <div
          className="absolute left-0 top-[calc(100%+0.25rem)] z-20 grid max-h-64 w-full min-w-52 gap-1 overflow-auto rounded-md border border-(--border) bg-(--surface) p-1 shadow-lg"
          role="listbox"
          aria-multiselectable="true"
        >
          {options.map((option) => {
            const isSelected = selectedValues.has(option.value);

            return (
              <label
                key={option.value}
                className="flex h-9 cursor-pointer items-center gap-2 rounded-sm px-2 text-sm text-(--text-h) hover:bg-(--accent-bg) focus-within:bg-(--accent-bg)"
                role="option"
                aria-selected={isSelected}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => toggleValue(option.value)}
                />
                <span
                  className={cx(
                    "inline-flex size-4 shrink-0 items-center justify-center rounded border",
                    isSelected
                      ? "border-(--accent-border) bg-(--accent-bg) text-(--accent)"
                      : "border-(--border) bg-(--surface)",
                  )}
                  aria-hidden="true"
                >
                  {isSelected ? <Check className="size-3" /> : null}
                </span>
                <span className="min-w-0 truncate">{option.label}</span>
              </label>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
