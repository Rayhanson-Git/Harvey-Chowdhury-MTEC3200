"use client";

import { useState, type FormEvent } from "react";
import { PlanField } from "@/components/plan-field";
import { PlanResult } from "@/components/plan-result";
import { Button } from "@/components/ui/button";
import { calculatePlan, type PlanInput, type PlanErrors, type TransitionPlan } from "@/lib/plan-input";

const durationFields = [
  { key: "preparation", label: "Get ready (minutes)" },
  { key: "commute", label: "Commute (minutes)" },
  { key: "buffer", label: "Buffer (minutes)" },
] as const;

function focusHeading(node: HTMLHeadingElement | null) {
  node?.focus();
}

export function PlanForm() {
  const [input, setInput] = useState<PlanInput>({ date: "", time: "10:00", preparation: "30", commute: "60", buffer: "15" });
  const [errors, setErrors] = useState<PlanErrors>({});
  const [message, setMessage] = useState("");
  const [plan, setPlan] = useState<TransitionPlan | null>(null);
  const [editing, setEditing] = useState(false);

  function update(field: keyof PlanInput, value: string) {
    setInput((previous) => ({ ...previous, [field]: value }));
    setMessage("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = calculatePlan(input);
    if (!result.ok) {
      setErrors(result.errors);
      setMessage("Check the highlighted fields.");
      const firstField = Object.keys(result.errors)[0];
      event.currentTarget.querySelector<HTMLInputElement>(`[name="${firstField}"]`)?.focus();
      return;
    }
    setErrors({});
    setMessage("");
    setPlan(result.plan);
  }

  if (plan) return <PlanResult plan={plan} onEdit={() => { setPlan(null); setEditing(true); }} />;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {editing ? <h2 tabIndex={-1} ref={focusHeading} className="text-lg font-medium outline-none">Adjust your plan</h2> : null}
      <PlanField id="date" label="Commitment date" type="date" value={input.date} onChange={(event) => update("date", event.target.value)} error={errors.date} />
      <PlanField id="time" label="Commitment start" type="time" value={input.time} onChange={(event) => update("time", event.target.value)} error={errors.time} />
      {durationFields.map(({ key, label }) => (
        <PlanField key={key} id={key} label={label} type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={input[key]} onChange={(event) => update(key, event.target.value)} error={errors[key]} />
      ))}
      <div className="space-y-4 pt-4">
        <Button type="submit" className="h-12 w-full text-base">{editing ? "Recalculate" : "Calculate times"}</Button>
        <p role="status" aria-live="polite" className="empty:hidden text-sm leading-6">{message}</p>
        <p className="text-center text-sm text-muted-foreground">One upcoming commitment</p>
      </div>
    </form>
  );
}
