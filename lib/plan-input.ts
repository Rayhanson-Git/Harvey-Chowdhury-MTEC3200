export type PlanInput = {
  date: string;
  time: string;
  preparation: string;
  commute: string;
  buffer: string;
};

export type PlanErrors = Partial<Record<keyof PlanInput, string>>;

// Keep form values as strings so a blank field is never silently treated as zero.
export function validatePlanInput(input: PlanInput, now = new Date()): PlanErrors {
  const errors: PlanErrors = {};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    errors.date = "Choose a valid commitment date.";
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time)) {
    errors.time = "Choose a valid start time.";
  }

  const commitment = new Date(`${input.date}T${input.time}`);
  if (!errors.date && !errors.time) {
    const [year, month, day] = input.date.split("-").map(Number);
    const [hour, minute] = input.time.split(":").map(Number);
    if (!Number.isFinite(commitment.getTime()) || commitment.getFullYear() !== year || commitment.getMonth() !== month - 1 || commitment.getDate() !== day) {
      errors.date = "Choose a valid commitment date.";
    } else if (commitment.getHours() !== hour || commitment.getMinutes() !== minute) {
      errors.time = "This local time is unavailable. Choose another start time.";
    } else if (commitment <= now) {
      errors.time = "Choose a future date and time.";
    }
  }

  const durationFields = ["preparation", "commute", "buffer"] as const;
  for (const field of durationFields) {
    const value = input[field].trim();
    if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value))) {
      errors[field] = "Enter a whole number of minutes, zero or greater.";
    }
  }

  if (Object.keys(errors).length === 0) {
    const total = durationFields.reduce((sum, field) => sum + Number(input[field]), 0);
    // Guard the full calculation against dates outside JavaScript's range.
    if (!Number.isSafeInteger(total) || !Number.isFinite(new Date(commitment.getTime() - total * 60_000).getTime())) {
      for (const field of durationFields) errors[field] = "This duration is too large. Enter fewer minutes.";
    }
  }
  return errors;
}

export type TransitionPlan = {
  commitment: Date;
  arrival: Date;
  leave: Date;
  stop: Date;
  preparation: number;
  commute: number;
  buffer: number;
  stopHasPassed: boolean;
};

export function calculatePlan(input: PlanInput, now = new Date()):
  | { ok: false; errors: PlanErrors }
  | { ok: true; plan: TransitionPlan } {
  const errors = validatePlanInput(input, now);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const commitment = new Date(`${input.date}T${input.time}`);
  const preparation = Number(input.preparation);
  const commute = Number(input.commute);
  const buffer = Number(input.buffer);
  // Subtract elapsed minutes from full timestamps so midnight is handled naturally.
  const arrival = new Date(commitment.getTime() - buffer * 60_000);
  const leave = new Date(arrival.getTime() - commute * 60_000);
  const stop = new Date(leave.getTime() - preparation * 60_000);
  return { ok: true, plan: { commitment, arrival, leave, stop, preparation, commute, buffer, stopHasPassed: stop <= now } };
}
