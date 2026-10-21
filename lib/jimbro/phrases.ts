/** Original local JimBro content. Seed IDs preserve the supplied 100-line bank. */
export type PhraseEvent =
  | "start"
  | "return"
  | "set"
  | "rest"
  | "progress"
  | "warning"
  | "preparation"
  | "departure"
  | "complete"
  | "short"
  | "error";
export type Tone = "quiet" | "encouraging" | "playful" | "unhinged";
export type PhraseRequirement =
  | "history"
  | "previous"
  | "class"
  | "deadline"
  | "personalBest"
  | "saved"
  | "previousNotes";
export type Phrase = {
  id: string;
  text: string;
  event: PhraseEvent;
  tone: Tone;
  flirtatious: boolean;
  requires: PhraseRequirement[];
};

type Seed = [
  text: string,
  event: PhraseEvent,
  tone: Tone,
  flirtatious?: boolean,
  extra?: PhraseRequirement[],
];

const supplied: Seed[] = [
  [
    "There you are. The reason this gym needs bigger mirrors.",
    "start",
    "playful",
    true,
  ],
  [
    "Schedule secured. Sleeves under negotiation.",
    "start",
    "playful",
    false,
    ["deadline", "saved"],
  ],
  [
    "Welcome back, handsome. The spreadsheet missed you.",
    "start",
    "playful",
    true,
    ["history"],
  ],
  [
    "Your next commitment has a time. Your entrance has presence.",
    "start",
    "playful",
    false,
    ["deadline"],
  ],
  [
    "Today’s agenda: lift things, record things, remain mysterious.",
    "start",
    "playful",
  ],
  ["You brought yourself. Excellent choice of equipment.", "start", "playful"],
  ["The gym called. Apparently you’re the plot.", "start", "unhinged"],
  [
    "A plan, a purpose, and suspiciously good shoulders.",
    "start",
    "playful",
    true,
  ],
  ["Logged. The dumbbell would like a word.", "set", "playful"],
  ["Another set? Leave some shoulders for the rest of us.", "set", "playful"],
  ["That set has been entered into the historical record.", "set", "playful"],
  ["Work done. Evidence secured.", "set", "encouraging"],
  ["Your muscles did the work. I handled the paperwork.", "set", "playful"],
  ["Saved. Very professional of you to be this dramatic.", "set", "playful"],
  ["That set is official. Please remain approachable.", "set", "playful"],
  [
    "One more entry in the increasingly convincing case for you.",
    "set",
    "playful",
    true,
  ],
  ["Take your rest. Even legends have loading screens.", "rest", "playful"],
  ["Breathe. The next set can wait its turn.", "rest", "encouraging"],
  [
    "Recovery break. I’ll stand here looking unnecessarily qualified.",
    "rest",
    "playful",
  ],
  ["Resting is part of the plan, superstar.", "rest", "encouraging"],
  ["Water break? Even premium cucumbers need maintenance.", "rest", "playful"],
  ["A brief intermission for the shoulders.", "rest", "playful"],
  [
    "No rush. We are building a routine, not fleeing a crime scene.",
    "rest",
    "playful",
  ],
  ["Catch your breath. I’ll supervise dramatically.", "rest", "playful"],
  [
    "New personal best. Please use your new powers responsibly.",
    "progress",
    "playful",
  ],
  ["Progress detected. Acting normal is now optional.", "progress", "playful"],
  [
    "That’s a milestone. I wore my good glasses for this.",
    "progress",
    "playful",
  ],
  [
    "Your past self would like the training notes.",
    "progress",
    "playful",
    false,
    ["previous"],
  ],
  ["The numbers moved. So did the plot.", "progress", "playful"],
  [
    "You earned that improvement. I contributed facial expressions.",
    "progress",
    "playful",
  ],
  [
    "A little stronger. A little harder to ignore.",
    "progress",
    "playful",
    true,
  ],
  ["The progress is real. My composure is not.", "progress", "playful", true],
  [
    "Welcome back. No guilt, just the next session.",
    "return",
    "encouraging",
    false,
    ["history"],
  ],
  ["You showed up. That’s a useful place to start.", "return", "encouraging"],
  [
    "The comeback does not need a press conference.",
    "return",
    "playful",
    false,
    ["history"],
  ],
  [
    "Another day in the log. Quietly impressive.",
    "return",
    "encouraging",
    false,
    ["history", "saved"],
  ],
  ["A routine is built one visit at a time.", "return", "encouraging"],
  [
    "Good to see you. Your last workout left notes.",
    "return",
    "playful",
    false,
    ["previous", "previousNotes"],
  ],
  [
    "We’re collecting sessions, not demanding perfection.",
    "return",
    "encouraging",
  ],
  [
    "Back in the building. Excellent casting decision.",
    "return",
    "playful",
    false,
    ["history"],
  ],
  [
    "A few minutes left. Let’s give this workout an ending.",
    "warning",
    "encouraging",
  ],
  ["Your next commitment has entered the chat.", "warning", "playful"],
  [
    "The clock is getting clingy. Check your remaining sets.",
    "warning",
    "playful",
  ],
  ["Strong finish, sensible exit.", "warning", "encouraging"],
  [
    "The timer has opinions. Unfortunately, they are relevant.",
    "warning",
    "playful",
  ],
  ["Still looking good. Still on a schedule.", "warning", "playful", true],
  ["Time to check the plan, handsome.", "warning", "playful", true],
  ["Your calendar has an excellent memory.", "warning", "playful"],
  [
    "Workout time is up. Time for the changing-room sequel.",
    "preparation",
    "playful",
  ],
  [
    "The pump can come with you. The dumbbells cannot.",
    "preparation",
    "playful",
  ],
  [
    "Prepare to rejoin society, you magnificent vegetable enthusiast.",
    "preparation",
    "unhinged",
  ],
  [
    "Shower, change, pack. A surprisingly powerful trilogy.",
    "preparation",
    "playful",
  ],
  [
    "The lifting chapter is closed. Wardrobe department, you’re up.",
    "preparation",
    "playful",
  ],
  [
    "You trained. Now make the transition look intentional.",
    "preparation",
    "playful",
  ],
  [
    "Time to trade gym mode for whatever the day demands.",
    "preparation",
    "encouraging",
  ],
  ["Your next outfit has been waiting patiently.", "preparation", "playful"],
  [
    "Your pump is impressive. Your professor still takes attendance.",
    "departure",
    "playful",
    false,
    ["class"],
  ],
  ["Time to leave. The mirror will survive.", "departure", "playful"],
  ["Take the confidence. Leave the equipment.", "departure", "encouraging"],
  ["Go be punctual and inconveniently charming.", "departure", "playful", true],
  [
    "The gym had its turn. The rest of your day is next.",
    "departure",
    "encouraging",
  ],
  ["Departure time. Give the doors your best exit.", "departure", "playful"],
  [
    "Let’s get you there with your dignity and your buffer.",
    "departure",
    "playful",
  ],
  [
    "You can admire the session summary after you arrive.",
    "departure",
    "playful",
  ],
  ["Workout saved. Looking disrespectfully good.", "complete", "playful", true],
  ["I knew you had it in you. I had charts prepared.", "complete", "playful"],
  [
    "Session complete. Please try not to become unbearable.",
    "complete",
    "playful",
  ],
  [
    "You did the work. I did the commentary. Strong partnership.",
    "complete",
    "playful",
  ],
  [
    "Another workout in the books. The books are blushing.",
    "complete",
    "playful",
    true,
  ],
  [
    "Finished. Your future self has excellent taste in you.",
    "complete",
    "playful",
  ],
  [
    "Training complete. Charisma remains unreasonably high.",
    "complete",
    "playful",
    true,
  ],
  [
    "Consider this a formal acknowledgment of your gym-bro excellence.",
    "complete",
    "playful",
  ],
  ["A shorter workout still belongs in the log.", "short", "encouraging"],
  ["You made time. That counts.", "short", "encouraging"],
  ["A sensible stop is a strong decision.", "short", "encouraging"],
  ["Today’s session fits today’s life.", "short", "encouraging"],
  [
    "We saved what you completed. No dramatic apology required.",
    "short",
    "playful",
    false,
    ["saved"],
  ],
  ["The plan changed. The effort did not disappear.", "short", "encouraging"],
  [
    "Leaving on time is also part of the workout.",
    "short",
    "encouraging",
    false,
    ["deadline"],
  ],
  [
    "A shorter session. Still a real session. The cucumber has spoken.",
    "short",
    "unhinged",
  ],
  ["Start with the time you have.", "start", "quiet"],
  ["One session at a time.", "start", "quiet"],
  ["Your plan is ready when you are.", "start", "quiet"],
  ["Focus on the set in front of you.", "start", "quiet"],
  ["Set saved. Take the rest you need.", "set", "quiet"],
  ["That work is now in your log.", "set", "quiet"],
  ["You can adjust the plan as you go.", "start", "quiet"],
  ["A steady pace is enough.", "rest", "quiet"],
  ["Take a breath before the next set.", "rest", "quiet"],
  [
    "Your previous session is here for reference.",
    "start",
    "quiet",
    false,
    ["previous"],
  ],
  ["There’s room to make today’s workout your own.", "start", "quiet"],
  ["You can finish here and keep what you completed.", "short", "quiet"],
  ["Time to start getting ready.", "preparation", "quiet"],
  ["Your departure time has arrived.", "departure", "quiet"],
  ["You completed another session.", "complete", "quiet", false, ["history"]],
  ["Your workout is saved for next time.", "complete", "quiet"],
  ["Consistency can include shorter days.", "short", "quiet"],
  ["Welcome back. Pick up from here.", "return", "quiet", false, ["history"]],
  [
    "You improved on your previous recorded result.",
    "progress",
    "quiet",
    false,
    ["previous"],
  ],
  ["You made space for training today.", "complete", "quiet"],
];

const defaults = (event: PhraseEvent): PhraseRequirement[] => {
  if (event === "set" || event === "complete") return ["saved"];
  if (event === "progress") return ["saved", "personalBest"];
  if (event === "warning" || event === "preparation" || event === "departure")
    return ["deadline"];
  return [];
};

const seedCatalog: Phrase[] = supplied.map(
  ([text, event, tone, flirtatious = false, extra = []], index) => ({
    id: `seed-${String(index + 1).padStart(3, "0")}`,
    text,
    event,
    tone,
    flirtatious,
    requires: [...new Set([...defaults(event), ...extra])],
  }),
);

type Expansion = { event: PhraseEvent; tone: Tone; lines: string[] };
const expansions: Expansion[] = [
  {
    event: "start",
    tone: "encouraging",
    lines: [
      "Choose a starting point that works for today.",
      "You have a place to begin. We can adjust along the way.",
      "Keep the plan useful and the expectations flexible.",
      "Take a moment to settle in before your first set.",
      "Today’s effort can look different from yesterday’s.",
    ],
  },
  {
    event: "start",
    tone: "playful",
    lines: [
      "Glasses on. Clipboard metaphorical. Let’s begin.",
      "I brought the moral support. It is cucumber-shaped.",
      "Your routine is open. My opinions are wearing trainers.",
      "The opening credits are over. Your first set awaits.",
      "Welcome to your regularly unscheduled vegetable supervision.",
    ],
  },
  {
    event: "start",
    tone: "unhinged",
    lines: [
      "The Council of Extremely Confident Vegetables has convened.",
      "I have alerted absolutely nobody. This is your training montage.",
      "Somewhere, a tiny orchestra is tuning up for your warm-up.",
      "Deploying one cucumber and an unreasonable amount of optimism.",
      "By the power vested in these glasses, the session may commence.",
    ],
  },
  {
    event: "set",
    tone: "quiet",
    lines: [
      "Entry saved.",
      "That set is recorded.",
      "Your log is up to date.",
      "Saved with your completed sets.",
      "The record is there when you need it.",
    ],
  },
  {
    event: "set",
    tone: "encouraging",
    lines: [
      "One completed set, safely in your log.",
      "You can return to that result next time.",
      "Recorded. Take the recovery you need.",
      "Your effort has a place in today’s record.",
      "Set saved. You can correct it whenever you need to.",
    ],
  },
  {
    event: "set",
    tone: "unhinged",
    lines: [
      "The archive accepts your offering of repetitions.",
      "A tiny imaginary notary has stamped that set.",
      "Historic paperwork. No actual historians were disturbed.",
      "Your set has entered the cucumber cinematic universe.",
      "Behold: another row in the sacred ledger of doing things.",
      "Recorded with the solemnity of a vegetable in reading glasses.",
    ],
  },
  {
    event: "rest",
    tone: "quiet",
    lines: [
      "This is time to recover.",
      "Let your breathing settle.",
      "Rest before deciding what comes next.",
      "You can extend this break.",
      "The rest timer is a guide. Take the time you need.",
    ],
  },
  {
    event: "rest",
    tone: "encouraging",
    lines: [
      "Give yourself a real pause between efforts.",
      "There’s no prize for rushing your recovery.",
      "A little room to recover helps keep the plan sensible.",
      "Check in with yourself before starting again.",
      "You can change the workout if you need more rest.",
    ],
  },
  {
    event: "rest",
    tone: "unhinged",
    lines: [
      "The intermission cucumber will now perform one extremely slow blink.",
      "All imaginary spotlights are temporarily pointed at your water bottle.",
      "Please enjoy this loading screen, rendered entirely in vegetable.",
      "The tiny orchestra is on break too. Union rules.",
      "I’m holding a dramatic silence. Surprisingly good grip on it.",
      "Time for the director’s cut of taking a breath.",
    ],
  },
  {
    event: "return",
    tone: "quiet",
    lines: [
      "Begin wherever you are today.",
      "Your next session can be simple.",
      "Choose what works for this visit.",
      "No need to make up for anything.",
    ],
  },
  {
    event: "return",
    tone: "playful",
    lines: [
      "The clipboard is ready. Its standards are very reasonable.",
      "No attendance speech. Just a cucumber with a plan.",
      "A new scene. Same deeply overqualified vegetable.",
      "Today gets its own page. Excellent stationery policy.",
      "We can skip the dramatic recap and start where you are.",
    ],
  },
  {
    event: "return",
    tone: "unhinged",
    lines: [
      "A cucumber in glasses has been appointed master of low-pressure ceremonies.",
      "The sequel has no minimum runtime.",
      "Roll the opening credits. They are mostly vegetables.",
      "The imaginary press has been instructed to give you some space.",
      "A fresh page has emerged from the stationery dimension.",
    ],
  },
  {
    event: "warning",
    tone: "quiet",
    lines: [
      "Workout cutoff is approaching. Review your remaining work.",
      "Leave room for preparation and travel.",
      "Check your stop time before another exercise.",
      "You can finish with the work already completed.",
      "A shorter plan is available if you need it.",
    ],
  },
  {
    event: "warning",
    tone: "encouraging",
    lines: [
      "Protect the time you reserved for getting ready.",
      "Choose a sensible stopping point. The log keeps your work.",
      "There is no need to rush a set to beat the clock.",
    ],
  },
  {
    event: "warning",
    tone: "unhinged",
    lines: [
      "The clock has arrived wearing its serious glasses.",
      "Your schedule has requested a very small press conference.",
      "A cucumber is pointing at the time. This is not a drill montage.",
      "The final act should include enough time to find your socks.",
      "The calendar department would like its reserved minutes back.",
    ],
  },
  {
    event: "preparation",
    tone: "quiet",
    lines: [
      "Your preparation window is here.",
      "Check your leave-by time while you get ready.",
      "Make room for changing and packing.",
      "The next step is preparing to leave.",
    ],
  },
  {
    event: "preparation",
    tone: "encouraging",
    lines: [
      "Keep the next part of your day in view.",
      "Take the preparation time you set aside.",
      "Your recorded work will be here after you get ready.",
      "Give yourself space to make the transition.",
    ],
  },
  {
    event: "preparation",
    tone: "unhinged",
    lines: [
      "Wardrobe has received its cue. The cucumber stays in costume.",
      "Activate the ancient ritual of locating your other sock.",
      "The post-workout production crew is now in charge.",
      "Our next thrilling episode: bag, shoes, outside world.",
    ],
  },
  {
    event: "departure",
    tone: "quiet",
    lines: [
      "Check your route and head to your commitment.",
      "Leave-by time is now.",
      "Your planned travel window has begun.",
      "Time to move to the next part of your day.",
    ],
  },
  {
    event: "departure",
    tone: "encouraging",
    lines: [
      "Take the progress with you and give yourself time to travel.",
      "You reserved this time for the journey ahead.",
      "The next useful step is heading out.",
    ],
  },
  {
    event: "departure",
    tone: "unhinged",
    lines: [
      "The exit doors have been promoted to main characters.",
      "Your travel window is open. The cucumber has packed no luggage.",
      "Cue the departure music. At an extremely sensible tempo.",
      "The calendar department has called its car.",
      "Please transfer all remaining drama to the session summary.",
    ],
  },
  {
    event: "complete",
    tone: "quiet",
    lines: [
      "Completed work saved.",
      "Your session is ready to review.",
      "The workout record is complete.",
    ],
  },
  {
    event: "complete",
    tone: "encouraging",
    lines: [
      "You have a record of the work you completed today.",
      "Session saved. Give yourself credit for showing up.",
      "Your next workout can begin with today’s notes.",
      "That effort is part of your history now.",
      "You made a useful place for training in your day.",
    ],
  },
  {
    event: "complete",
    tone: "unhinged",
    lines: [
      "The cucumber awards ceremony is one respectful flex long.",
      "Session sealed. The tiny imaginary notary has gone home.",
      "Roll credits. Include yourself under stunts and paperwork.",
      "Your workout has been inducted into the local browser hall of records.",
      "A vegetable in glasses is giving you a standing ovation. Limited legroom.",
    ],
  },
  {
    event: "short",
    tone: "quiet",
    lines: [
      "This can be enough for today.",
      "Keep what you completed and continue with your day.",
      "A shorter plan is a valid choice.",
    ],
  },
  {
    event: "short",
    tone: "playful",
    lines: [
      "An efficient episode. Still part of the series.",
      "Short runtime. Full membership in the workout club.",
      "The cucumber approves this sensible edit.",
      "Today called for the compact edition.",
    ],
  },
  {
    event: "short",
    tone: "unhinged",
    lines: [
      "The director has approved a shorter cut. No vegetables objected.",
      "A pocket-sized training montage is still a training montage.",
      "The Council of Reasonable Expectations votes in your favor.",
      "This episode respects your schedule. A shocking development in television.",
    ],
  },
  {
    event: "progress",
    tone: "quiet",
    lines: [
      "A new comparable best is recorded.",
      "This result exceeds your earlier recorded best.",
      "Your log has a new personal best.",
      "A verified improvement is saved.",
    ],
  },
  {
    event: "progress",
    tone: "encouraging",
    lines: [
      "Your records show a new best for this exercise and measure.",
      "That improvement is yours to acknowledge.",
      "A new personal best, built from work you recorded.",
      "You have a new result to look back on.",
      "Your comparable records show the change.",
    ],
  },
  {
    event: "progress",
    tone: "unhinged",
    lines: [
      "The record book has put on its ceremonial glasses.",
      "A new best has entered the cucumber archives. Trumpets are imaginary.",
      "The tiny orchestra has been authorized one victory chord.",
      "Your personal record has requested a larger nameplate.",
      "The numbers have provided evidence. I will provide theatrical eyebrows.",
    ],
  },
  {
    event: "error",
    tone: "quiet",
    lines: [
      "Check the message before continuing.",
      "Your attention is needed here.",
      "Take a moment to review this.",
    ],
  },
  {
    event: "error",
    tone: "encouraging",
    lines: [
      "Read the recovery steps and take them one at a time.",
      "Pause here while you review what happened.",
      "There is no need to rush this correction.",
    ],
  },
  {
    event: "error",
    tone: "playful",
    lines: [
      "The clipboard has a question. Let’s read it carefully.",
      "A small paperwork intermission. Details first.",
      "My glasses are on. Check the message beside me.",
    ],
  },
  {
    event: "error",
    tone: "unhinged",
    lines: [
      "The cucumber has lowered the dramatic lighting. Read the message first.",
      "The imaginary production has paused for a useful correction.",
      "The clipboard department requires a moment of sensible attention.",
    ],
  },
];

export const phraseCatalog: readonly Phrase[] = [
  ...seedCatalog,
  ...expansions.flatMap(({ event, tone, lines }) =>
    lines.map((text, index): Phrase => ({
      id: `extra-${event}-${tone}-${String(index + 1).padStart(2, "0")}`,
      text,
      event,
      tone,
      flirtatious: false,
      requires: defaults(event),
    })),
  ),
];
