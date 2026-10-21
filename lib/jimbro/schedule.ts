import type { PlanErrors, PlanInput, Schedule, Session } from "./types.ts";

const minute = 60_000;
export function localDate(timestamp: number, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(timestamp);
  const value = (name: string) => parts.find((p) => p.type === name)?.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}

// Round-trip candidate offsets in the selected IANA zone; never silently normalize
// a daylight-saving gap or choose one occurrence of a repeated local time.
export function commitmentOptions(
  input: PlanInput,
  timezone: string,
): number[] {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(input.date) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time)
  )
    return [];
  const [year, month, day] = input.date.split("-").map(Number);
  if (year < 1000) return [];
  const [hour, min] = input.time.split(":").map(Number);
  const naive = Date.UTC(year, month - 1, day, hour, min);
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const fields = (at: number) => {
    const p = formatter.formatToParts(at);
    const n = (type: string) => Number(p.find((x) => x.type === type)?.value);
    return [n("year"), n("month"), n("day"), n("hour"), n("minute")];
  };
  const offsets = new Set<number>();
  for (let hours = -36; hours <= 36; hours += 3) {
    const at = naive + hours * 60 * minute;
    const f = fields(at);
    offsets.add(Date.UTC(f[0], f[1] - 1, f[2], f[3], f[4]) - at);
  }
  const wanted = [year, month, day, hour, min];
  return [...offsets]
    .map((offset) => naive - offset)
    .filter((at) => fields(at).every((x, i) => x === wanted[i]))
    .sort((a, b) => a - b);
}

export function makeSchedule(
  input: PlanInput,
  timezone: string,
  now: number,
  occurrence?: number,
  revision = 1,
): { schedule?: Schedule; errors: PlanErrors } {
  const errors: PlanErrors = {};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date))
    errors.date = "Choose a valid commitment date.";
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time))
    errors.time = "Choose a valid start time.";
  let total = 0;
  for (const field of ["preparation", "commute", "buffer"] as const) {
    if (
      !/^\d+$/.test(input[field].trim()) ||
      !Number.isSafeInteger(Number(input[field]))
    )
      errors[field] = "Enter a whole number of minutes, zero or greater.";
    total += Number(input[field]);
  }
  let options: number[] = [];
  try {
    options = commitmentOptions(input, timezone);
  } catch {
    errors.time = "Choose a valid timezone and local time.";
  }
  const commitment =
    options.length === 1 ? options[0] : options.find((x) => x === occurrence);
  if (!errors.date && !errors.time && options.length === 0)
    errors.time = "This date or local time is unavailable. Choose another.";
  if (options.length > 1 && commitment === undefined)
    errors.time = "This time happens twice. Choose an occurrence below.";
  if (commitment !== undefined && commitment <= now)
    errors.time = "Choose a future date and time.";
  if (
    !Number.isSafeInteger(total) ||
    (commitment !== undefined &&
      !Number.isFinite(new Date(commitment - total * minute).getTime()))
  )
    errors.preparation = "These durations are too large. Enter fewer minutes.";
  if (Object.keys(errors).length || commitment === undefined) return { errors };
  const [y, m, d] = input.date.split("-").map(Number);
  const [h, n] = input.time.split(":").map(Number);
  return {
    errors,
    schedule: {
      input: { ...input },
      timezone,
      commitment,
      offsetMinutes: (Date.UTC(y, m - 1, d, h, n) - commitment) / minute,
      revision,
    },
  };
}

export function deadlines(schedule: Schedule) {
  const arrival = schedule.commitment - Number(schedule.input.buffer) * minute;
  const departure = arrival - Number(schedule.input.commute) * minute;
  return {
    stop: departure - Number(schedule.input.preparation) * minute,
    departure,
    arrival,
    commitment: schedule.commitment,
  };
}

export function phaseAt(session: Session, now: number) {
  if (session.withoutDeadline)
    return {
      key: "untimed",
      title: "Train at your own pace",
      message: "No departure deadline. Take the rest you need.",
      deadline: now,
      label: "No deadline",
    };
  const times = deadlines(session.schedule);
  if (now >= times.commitment)
    return {
      key: "commitment",
      title: "Commitment due",
      message:
        "Your commitment time has arrived. Review any unfinished transition.",
      deadline: times.commitment,
      label: "Commitment",
    };
  if (session.actual.arrivedAt)
    return {
      key: "arrived",
      title: "You’ve arrived",
      message: "Finish your session when you’re ready.",
      deadline: times.commitment,
      label: "Commitment",
    };
  if (now >= times.arrival)
    return {
      key: "arrival",
      title: "Arrival target reached",
      message: "Confirm your arrival or review your remaining journey.",
      deadline: times.commitment,
      label: "Commitment",
    };
  if (session.actual.departedAt)
    return {
      key: "travel",
      title: "On your way",
      message: "Your departure is recorded. Keep your arrival target in view.",
      deadline: times.arrival,
      label: "Target arrival",
    };
  if (now >= times.departure)
    return {
      key: "departure",
      title: "Time to leave",
      message: "Your leave-by time has arrived. Head to your commitment.",
      deadline: times.arrival,
      label: "Target arrival",
    };
  if (now >= times.stop || session.actual.workoutEndedAt)
    return {
      key: "preparation",
      title: "Get ready to go",
      message: session.actual.workoutEndedAt
        ? "Workout finished. Shower, change and pack before your leave-by time."
        : "Your workout stop time has arrived. Finish exercising and get ready to leave.",
      deadline: times.departure,
      label: "Leave by",
    };
  return {
    key: "workout",
    title: "You have time to train",
    message:
      "Log your sets after you complete them. We’ll keep the clock in sight.",
    deadline: times.stop,
    label: "Stop workout",
  };
}

export function alertMilestone(session: Session, now: number): string | null {
  if (session.status !== "active" || session.withoutDeadline) return null;
  const d = deadlines(session.schedule);
  if (now >= d.commitment) return "commitment";
  if (session.actual.arrivedAt) return null;
  if (now >= d.arrival) return "arrival";
  if (session.actual.departedAt) return null;
  if (now >= d.departure) return "departure";
  if (now >= d.stop && !session.actual.workoutEndedAt) return "stop";
  return null;
}

export function clockText(milliseconds: number) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor(seconds / 60) % 60).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function formatMoment(timestamp: number, timezone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(timestamp);
}
