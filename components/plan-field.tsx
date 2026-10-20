import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";

type PlanFieldProps = ComponentProps<"input"> & {
  id: string;
  label: string;
  error?: string;
};

export function PlanField({ id, label, error, ...props }: PlanFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">{label}</label>
      <Input id={id} name={id} required aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="h-12 text-base md:text-base" {...props} />
      {error ? <p id={`${id}-error`} className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
