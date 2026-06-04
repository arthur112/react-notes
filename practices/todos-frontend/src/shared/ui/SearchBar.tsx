import type { ComponentPropsWithoutRef } from "react";

type SearchBarProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "className" | "defaultValue" | "onChange" | "type" | "value"
> & {
  className?: string;
  inputClassName?: string;
  label: string;
  onValueChange: (value: string) => void;
  value: string;
};

const searchBarClassName =
  "flex min-h-10.5 min-w-0 items-center gap-2.5 rounded-lg border border-(--border) bg-(--surface) px-3.5";

const searchInputClassName =
  "min-w-0 w-full border-0 bg-transparent text-[15px] text-(--text-h) outline-0 [font:inherit]";

function cx(...classNames: Array<string | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}

export function SearchBar({
  className,
  inputClassName,
  label,
  onValueChange,
  value,
  ...inputProps
}: SearchBarProps) {
  return (
    <label className={cx(searchBarClassName, className)}>
      <span className="sr-only">{label}</span>
      <input
        {...inputProps}
        type="search"
        className={cx(searchInputClassName, inputClassName)}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
    </label>
  );
}
