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
  "flex h-9 min-w-0 items-center gap-2 rounded-md border border-(--border) bg-(--surface) px-3 focus-within:border-(--accent-border) focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--accent)";

const searchInputClassName =
  "min-w-0 w-full border-0 bg-transparent text-sm text-(--text-h) outline-none placeholder:text-(--text-muted)";

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
