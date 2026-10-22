import { makeId } from "@/lib/jimbro/identity";
import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { localDate } from "@/lib/jimbro/schedule";
import { validateWeight } from "@/lib/jimbro/session";
import type { BodyWeight, Unit } from "@/lib/jimbro/types";
import { buttonStyle, inputStyle } from "./schedule-editor";

export function BodyWeightTracker({
  weights,
  busy,
  onSave,
}: {
  weights: BodyWeight[];
  busy: boolean;
  onSave: (weight: BodyWeight) => Promise<boolean>;
}) {
  const [date, setDate] = useState(() =>
    localDate(Date.now(), Intl.DateTimeFormat().resolvedOptions().timeZone),
  );
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<Unit>("lb");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const pendingId = useRef<string | null>(null);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaved("");
    pendingId.current ||= makeId();
    const weight: BodyWeight = {
      id: pendingId.current,
      date,
      value: Number(value),
      unit,
      recordedAt: Date.now(),
    };
    try {
      validateWeight(weight);
    } catch {
      setError("Enter a valid date and a body weight greater than zero.");
      return;
    }
    if (await onSave(weight)) {
      pendingId.current = null;
      setValue("");
      setSaved("Body weight saved.");
    }
  }
  const converted = weights.map((w) => ({
    ...w,
    display:
      unit === w.unit
        ? w.value
        : unit === "kg"
          ? w.value * 0.45359237
          : w.value / 0.45359237,
  }));
  const latest = converted[0],
    previous = converted[1];
  return (
    <div className="space-y-6">
      <p className="text-sm leading-6 text-jim-muted">
        Your body weight, separate from what you lift. Every measurement keeps
        its date and original unit.
      </p>
      {latest ? (
        <div className="rounded-2xl bg-jim-input p-5">
          <p className="text-xs uppercase tracking-widest text-jim-muted">
            Latest · {latest.date}
          </p>
          <p className="mt-2 text-4xl font-semibold">
            {Number(latest.display.toFixed(2))}{" "}
            <span className="text-xl text-jim-muted">{unit}</span>
          </p>
          {previous ? (
            <p className="mt-2 text-sm text-jim-muted">
              {latest.display - previous.display >= 0 ? "+" : ""}
              {(latest.display - previous.display).toFixed(2)} {unit} from
              previous record
            </p>
          ) : null}
        </div>
      ) : null}
      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <label htmlFor="weight-date" className="mb-2 block text-sm">
            Measurement date
          </label>
          <Input
            id="weight-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputStyle}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label htmlFor="body-weight" className="mb-2 block text-sm">
              Body weight
            </label>
            <Input
              id="body-weight"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter measurement"
              className={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="weight-unit" className="mb-2 block text-sm">
              Unit
            </label>
            <select
              id="weight-unit"
              value={unit}
              onChange={(e) => {
                const next = e.target.value as Unit;
                if (value.trim() && Number.isFinite(Number(value)))
                  setValue(
                    String(
                      Number(
                        (next === unit
                          ? Number(value)
                          : next === "kg"
                            ? Number(value) * 0.45359237
                            : Number(value) / 0.45359237
                        ).toFixed(3),
                      ),
                    ),
                  );
                setUnit(next);
              }}
              className={`${inputStyle} w-full rounded-md border px-3`}
            >
              <option>lb</option>
              <option>kg</option>
            </select>
          </div>
        </div>
        {error ? (
          <p role="alert" className="text-sm text-jim-accent">
            {error}
          </p>
        ) : null}
        <p role="status" className="text-sm text-emerald-300">
          {saved}
        </p>
        <Button disabled={busy} className={`${buttonStyle} w-full`}>
          {busy ? "Saving…" : "Save body weight"}
        </Button>
      </form>
      {weights.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="mb-3 text-left text-jim-muted">
              Measurements · original units
            </caption>
            <thead>
              <tr className="border-b border-jim-border-soft">
                <th className="py-3 font-medium">Date</th>
                <th className="py-3 text-right font-medium">Body weight</th>
              </tr>
            </thead>
            <tbody>
              {weights.map((w) => (
                <tr key={w.id} className="border-b border-jim-border-soft">
                  <td className="py-3">{w.date}</td>
                  <td className="py-3 text-right">
                    {w.value} {w.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-jim-muted">No measurements yet.</p>
      )}
    </div>
  );
}
