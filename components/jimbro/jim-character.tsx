"use client";

import { useId } from "react";

export type JimPose =
  | "idle"
  | "greeting"
  | "ready"
  | "set"
  | "rest"
  | "progress"
  | "warning"
  | "preparation"
  | "departure"
  | "complete"
  | "recovery"
  | "error";

const poseLabels: Record<JimPose, string> = {
  idle: "Jim, the cucumber gym buddy",
  greeting: "Jim waves hello",
  ready: "Jim is ready to train",
  set: "Jim nods in approval",
  rest: "Jim takes a breath",
  progress: "Jim celebrates progress",
  warning: "Jim checks the clock",
  preparation: "Jim points toward the changing room",
  departure: "Jim points toward the exit",
  complete: "Jim celebrates your workout",
  recovery: "Jim gives a reassuring smile",
  error: "Jim pauses while you recover your work",
};

// All poses share this editable rig, canvas and ground anchor. Motion is purely
// decorative: the parent owns event priority, duration, visibility and cooldowns.
export function JimCharacter({
  pose = "idle",
  motion = true,
  className = "",
}: {
  pose?: JimPose;
  motion?: boolean;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const flex = pose === "ready" || pose === "progress" || pose === "complete";
  const point = pose === "departure" || pose === "preparation";
  const calm = pose === "rest" || pose === "recovery" || pose === "error";
  const leftAngle = flex ? 42 : calm ? -10 : 6;
  const rightAngle =
    pose === "greeting"
      ? -85
      : flex
        ? -42
        : point
          ? -66
          : pose === "warning"
            ? -28
            : calm
              ? 10
              : -6;
  return (
    <svg
      className={`jim-rig ${className}`}
      data-pose={pose}
      data-motion={motion ? "on" : "off"}
      viewBox="0 0 300 330"
      role="img"
      aria-label={poseLabels[pose]}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={`${id}-body`}
          x1="95"
          y1="90"
          x2="215"
          y2="240"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#a5e45d" />
          <stop offset=".4" stopColor="#72bd3d" />
          <stop offset="1" stopColor="#3c7d32" />
        </linearGradient>
        <linearGradient
          id={`${id}-arm`}
          x1="0"
          y1="0"
          x2="0"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8bd14c" />
          <stop offset="1" stopColor="#559e38" />
        </linearGradient>
        <linearGradient id={`${id}-shoe`} x1="0" x2="1" y2="1">
          <stop stopColor="#383a43" />
          <stop offset="1" stopColor="#17191e" />
        </linearGradient>
      </defs>
      <style>{`
      .jim-rig { display:block; overflow:visible; isolation:isolate; }
      .jim-rig * { transform-box:fill-box; }
      .jim-rig .jim-body { transform-origin:50% 95%; }
      .jim-rig .jim-head { transform-origin:50% 78%; }
      .jim-rig .jim-eyelids { transform-origin:center; }
      .jim-rig .jim-confetti { opacity:0; }
      .jim-rig[data-pose="complete"] .jim-confetti,
      .jim-rig[data-pose="progress"] .jim-confetti { opacity:1; }
      .jim-rig[data-motion="on"] .jim-body { animation:jim-breathe 4.6s ease-in-out infinite; }
      .jim-rig[data-motion="on"] .jim-eyelids { animation:jim-blink 6.7s infinite; }
      .jim-rig[data-motion="on"][data-pose="greeting"] .jim-right-forearm { transform-origin:25% 30%; animation:jim-wave .6s ease-in-out 4 alternate; }
      .jim-rig[data-motion="on"][data-pose="set"] .jim-head { animation:jim-nod .65s ease-in-out 2; }
      .jim-rig[data-motion="on"][data-pose="set"] .jim-thumb { animation:jim-thumb .65s ease-out 2; transform-origin:50% 90%; }
      .jim-rig[data-motion="on"][data-pose="rest"] .jim-body { animation:jim-breathe 3.4s ease-in-out infinite; }
      .jim-rig[data-motion="on"][data-pose="rest"] .jim-breath { animation:jim-exhale 3.4s ease-out infinite; }
      .jim-rig[data-motion="on"][data-pose="progress"] .jim-left-forearm,
      .jim-rig[data-motion="on"][data-pose="ready"] .jim-left-forearm { transform-origin:75% 30%; animation:jim-flex .85s ease-in-out 2; }
      .jim-rig[data-motion="on"][data-pose="warning"] .jim-pupils { animation:jim-glance 2s ease-in-out 2; }
      .jim-rig[data-motion="on"][data-pose="warning"] .jim-clock-hand { animation:jim-clock 2s linear infinite; transform-origin:center; }
      .jim-rig[data-motion="on"][data-pose="departure"] .jim-right-forearm,
      .jim-rig[data-motion="on"][data-pose="preparation"] .jim-right-forearm { transform-origin:25% 30%; animation:jim-point .85s ease-in-out 3; }
      .jim-rig[data-motion="on"][data-pose="complete"] .jim-body { animation:jim-cheer .8s ease-in-out 3; }
      .jim-rig[data-motion="on"][data-pose="complete"] .jim-confetti,
      .jim-rig[data-motion="on"][data-pose="progress"] .jim-confetti { animation:jim-spark 1.1s ease-in-out 3; transform-origin:center; }
      @keyframes jim-breathe { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.018)} }
      @keyframes jim-blink { 0%,42%,45%,100%{transform:scaleY(1)} 43%,44%{transform:scaleY(.08)} }
      @keyframes jim-wave { from{transform:rotate(-13deg)} to{transform:rotate(14deg)} }
      @keyframes jim-nod { 0%,100%{transform:rotate(0)} 45%{transform:rotate(7deg) translateY(3px)} }
      @keyframes jim-thumb { 0%,100%{transform:translateY(0)} 45%{transform:translateY(-5px) rotate(-5deg)} }
      @keyframes jim-exhale { 0%,30%,100%{opacity:0;transform:translateX(0)} 60%{opacity:.75;transform:translateX(7px)} }
      @keyframes jim-flex { 0%,100%{transform:rotate(0)} 50%{transform:rotate(-12deg)} }
      @keyframes jim-glance { 0%,100%{transform:translateX(0)} 40%,75%{transform:translateX(7px)} }
      @keyframes jim-clock { from{transform:rotate(0)} to{transform:rotate(360deg)} }
      @keyframes jim-point { 0%,100%{transform:translateX(0)} 50%{transform:translateX(7px)} }
      @keyframes jim-cheer { 0%,100%{transform:translateY(0) rotate(0)} 40%{transform:translateY(-9px) rotate(-3deg)} 70%{transform:translateY(-4px) rotate(3deg)} }
      @keyframes jim-spark { 0%,100%{transform:scale(.9);opacity:.5} 50%{transform:scale(1.08);opacity:1} }
      @media(prefers-reduced-motion:reduce) { .jim-rig *, .jim-rig[data-motion="on"] * { animation:none!important; } }
      .jim-rig[data-motion="off"] * { animation:none!important; }
    `}</style>
      <ellipse cx="152" cy="310" rx="80" ry="9" fill="#000" opacity=".16" />
      <g
        className="jim-confetti"
        fill="none"
        strokeLinecap="round"
        strokeWidth="5"
      >
        <path
          d="m46 64 4 10m194-28-2 10M31 142l-9-2m247-33 9-5"
          stroke="#c3ee81"
        />
        <path d="m75 36-4 8m162 91 10 4M254 218l9 5" stroke="#f07489" />
        <path d="m210 24 7 7M40 219l-5 7" stroke="#f1d778" />
        <path d="M48 94h10m-5-5v10m188 61h10m-5-5v10" stroke="#a4df63" />
      </g>
      <g
        className="jim-body"
        stroke="#1d422b"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <g className="jim-legs">
          <path
            d="m120 271-5 24m62-24 5 24"
            stroke="#4b9237"
            strokeWidth="20"
          />
          <path
            d="M114 292c-12-1-28 4-28 14 0 5 13 5 26 5h16l-1-17z"
            fill={`url(#${id}-shoe)`}
          />
          <path
            d="M182 292c12-1 28 4 28 14 0 5-13 5-26 5h-16l1-17z"
            fill={`url(#${id}-shoe)`}
          />
          <path d="M91 306h34m47 0h33" stroke="#b7c3b3" strokeWidth="3" />
        </g>
        <g transform={`translate(100 160) rotate(${leftAngle})`}>
          <g className="jim-left-upper">
            <path
              d="M5 0C-2-13-19-16-30-4c-10 11-15 30-8 42 8 13 24 13 32 1L8 19"
              fill={`url(#${id}-arm)`}
            />
            <path
              d="M-30 10c8-3 17 1 19 8"
              fill="none"
              stroke="#b5e47b"
              strokeWidth="3"
            />
          </g>
          <g className="jim-left-forearm">
            <path
              d="M-39 29c-8-3-20 3-20 14l1 21c1 12 22 16 28 4l10-23"
              fill={`url(#${id}-arm)`}
            />
            <path
              d="M-58 63c-11-3-16 9-10 16l13 10c7 5 21 0 21-9V67"
              fill="#8acb51"
            />
            <path d="m-61 77 7 5m-2-11 7 6" strokeWidth="2" />
          </g>
        </g>
        <g transform={`translate(201 160) rotate(${rightAngle})`}>
          <g className="jim-right-upper">
            <path
              d="M-5 0C2-13 19-16 30-4c10 11 15 30 8 42-8 13-24 13-32 1L-8 19"
              fill={`url(#${id}-arm)`}
            />
            <path
              d="M30 10c-8-3-17 1-19 8"
              fill="none"
              stroke="#b5e47b"
              strokeWidth="3"
            />
          </g>
          <g className="jim-right-forearm">
            <path
              d="M39 29c8-3 20 3 20 14l-1 21c-1 12-22 16-28 4L20 45"
              fill={`url(#${id}-arm)`}
            />
            {point ? (
              <path
                d="M36 66c-4 7-1 18 8 20h21c7 0 8-10 1-11h-9l19-3c8-2 6-12-1-11l-25 3-2-9c-2-8-12-5-10 2z"
                fill="#8acb51"
              />
            ) : (
              <path
                d="M58 63c11-3 16 9 10 16L55 89c-7 5-21 0-21-9V67"
                fill="#8acb51"
              />
            )}
            {!point && <path d="m61 77-7 5m2-11-7 6" strokeWidth="2" />}
          </g>
        </g>
        <path
          d="M150 32c31 0 55 22 57 60l8 139c2 34-21 55-64 55s-66-21-64-55l8-139c2-38 25-60 55-60Z"
          fill={`url(#${id}-body)`}
        />
        <path
          d="M133 47c-20 11-26 28-27 53l-6 128c-1 22 5 35 20 42"
          fill="none"
          stroke="#c1ec86"
          strokeWidth="6"
          opacity=".64"
        />
        <path
          d="M186 63c12 17 12 31 13 52l5 115c1 23-9 37-24 42"
          fill="none"
          stroke="#31672d"
          strokeWidth="6"
          opacity=".5"
        />
        <path d="m143 32-4-9 13-2 7 12" fill="#6ba842" />
        <g fill="#417f31" stroke="none" opacity=".7">
          <ellipse cx="121" cy="78" rx="3" ry="5" />
          <ellipse cx="174" cy="62" rx="3" ry="4" />
          <ellipse cx="186" cy="94" rx="3" ry="5" />
          <ellipse cx="108" cy="178" rx="3" ry="5" />
          <ellipse cx="196" cy="191" rx="3" ry="5" />
          <ellipse cx="112" cy="239" rx="3" ry="5" />
          <ellipse cx="182" cy="259" rx="3" ry="4" />
          <ellipse cx="135" cy="257" rx="3" ry="4" />
        </g>
        <g className="jim-head">
          <path
            d={
              pose === "error"
                ? "M112 99q13 4 23-3m30 0q10 7 22 6"
                : calm
                  ? "M112 102q12-6 23-1m30 0q12-5 22 1"
                  : "M111 100q14-9 25-1m28 0q13-9 24-1"
            }
            fill="none"
            strokeWidth="5"
          />
          <g className="jim-eyelids">
            <path
              d="M112 111h29v26h-29zM162 111h29v26h-29z"
              fill="#f7f8e4"
              stroke="none"
            />
            <g className="jim-pupils" fill="#173426" stroke="none">
              <ellipse
                cx={pose === "warning" ? 131 : 128}
                cy="125"
                rx="5"
                ry={pose === "rest" ? 2 : 7}
              />
              <ellipse
                cx={pose === "warning" ? 181 : 178}
                cy="125"
                rx="5"
                ry={pose === "rest" ? 2 : 7}
              />
              <circle cx="129" cy="122" r="1.5" fill="white" />
              <circle cx="179" cy="122" r="1.5" fill="white" />
            </g>
          </g>
          <g fill="none" stroke="#20292a" strokeWidth="7">
            <rect x="106" y="107" width="39" height="34" rx="11" />
            <rect x="158" y="107" width="39" height="34" rx="11" />
            <path d="M146 117q6-5 12 0m-52-3-9-5m100 5 7-5" />
          </g>
          <path
            d="m113 113 7-1m45 1 7-1"
            stroke="#fafde8"
            opacity=".7"
            strokeWidth="2"
          />
          <path
            d="m149 132-4 10q5 5 10 0"
            fill="none"
            stroke="#428130"
            strokeWidth="3"
          />
          <ellipse
            cx="112"
            cy="148"
            rx="8"
            ry="4"
            fill="#93bc62"
            stroke="none"
          />
          <ellipse
            cx="189"
            cy="148"
            rx="8"
            ry="4"
            fill="#93bc62"
            stroke="none"
          />
          {pose === "rest" ? (
            <ellipse
              cx="151"
              cy="161"
              rx="7"
              ry="5"
              fill="#284c2a"
              strokeWidth="2"
            />
          ) : pose === "error" ? (
            <path d="M139 164q12-5 23 0" fill="none" strokeWidth="3" />
          ) : (
            <>
              <path
                d="M128 155q23 13 46 0c-4 27-37 28-46 0Z"
                fill="#244b2b"
                strokeWidth="3"
              />
              <path
                d="M134 159q18 7 34 0l-4 8h-26z"
                fill="#ffffed"
                stroke="none"
              />
              <path d="M145 175q8-7 15-1" stroke="#b1d174" strokeWidth="3" />
            </>
          )}
          {pose === "rest" && (
            <g
              className="jim-breath"
              fill="none"
              stroke="#b8d8b4"
              strokeWidth="3"
            >
              <path d="M166 158q12-7 20 0m-18 9q10 1 15 6" />
            </g>
          )}
        </g>
        <g
          className="jim-chest"
          fill="none"
          stroke="#3e8030"
          strokeWidth="3"
          opacity=".7"
        >
          <path d="M116 195q16-8 31 4m8 0q14-12 30-4m-34 5v18m-18 9q18 8 35 0m-34 17q16 6 31 0" />
        </g>
        <path
          d="M99 267q51 17 103 0l-2 11q-49 19-99 0z"
          fill="#282b31"
          strokeWidth="2"
        />
        <rect
          x="142"
          y="270"
          width="17"
          height="11"
          rx="2"
          fill="#f16b83"
          stroke="#20292a"
          strokeWidth="2"
        />
        {pose === "set" && (
          <g className="jim-thumb" transform="translate(210 183)">
            <path
              d="M0 0h15v23H0zm15 2 6-12c2-5 9-3 8 2l-1 8h10c5 0 6 4 5 8l-4 12c-1 4-5 5-9 5H15z"
              fill="#b2e47a"
              strokeWidth="3"
            />
          </g>
        )}
        {pose === "warning" && (
          <g transform="translate(229 212)">
            <circle r="21" fill="#f5e9ce" stroke="#dba477" strokeWidth="3" />
            <path
              d="M0-15v3m15 3-3 1M0 15v-3m-15-3 3-1"
              stroke="#724c37"
              strokeWidth="2"
            />
            <g className="jim-clock-hand">
              <rect
                x="-16"
                y="-16"
                width="32"
                height="32"
                fill="none"
                stroke="none"
              />
              <path d="M0 1V-10m0 10 8 4" stroke="#724c37" strokeWidth="3" />
            </g>
            <circle r="2" fill="#724c37" stroke="none" />
          </g>
        )}
        {pose === "preparation" && (
          <g transform="translate(232 216)" stroke="#e0b9a4" strokeWidth="3">
            <path
              d="M-10-14 0-19l10 5 10 16-11 5-4-6v22h-24V1l-4 6-11-5Z"
              fill="#50434c"
            />
            <path d="M-5-17q5 10 10 0" fill="none" />
          </g>
        )}
        {pose === "departure" && (
          <g transform="translate(237 226)" stroke="#f7a2ad" strokeWidth="4">
            <path d="M-13-19h15v36h-15z" fill="#392a31" />
            <path d="M-4 0h27m-8-8 8 8-8 8" fill="none" />
          </g>
        )}
        {pose === "recovery" && (
          <g transform="translate(238 226)" stroke="#abcfa1" strokeWidth="3">
            <path d="M-13-17h20l-3 35h-14z" fill="#3c6351" />
            <path d="M-13-10h18M-3-19l7-12" fill="none" />
          </g>
        )}
      </g>
    </svg>
  );
}
