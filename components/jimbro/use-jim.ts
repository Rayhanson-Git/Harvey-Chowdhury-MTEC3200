"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { claimPhrase } from "@/lib/jimbro/storage";
import { chooseMascot, type PhraseContext } from "@/lib/jimbro/personality";
import type { PhraseEvent } from "@/lib/jimbro/phrases";
import type { JimPose } from "./jim-character";
const poses: Record<PhraseEvent, JimPose> = {
  start: "ready",
  return: "greeting",
  set: "set",
  rest: "rest",
  progress: "progress",
  warning: "warning",
  preparation: "preparation",
  departure: "departure",
  complete: "complete",
  short: "recovery",
  error: "error",
};
export function useJim() {
  const [pose, setPose] = useState<JimPose>("idle"),
    [text, setText] = useState(""),
    [visible, setVisible] = useState(true);
  const state = useRef<{ pose: JimPose; until: number }>({
      pose: "idle",
      until: 0,
    }),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    alive = useRef(false);
  useEffect(() => {
    alive.current = true;
    const listener = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", listener);
    return () => {
      alive.current = false;
      document.removeEventListener("visibilitychange", listener);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  const emit = useCallback(
    async (event: PhraseEvent, id: string, context: PhraseContext) => {
      try {
        const result = await claimPhrase(event, id, context, Date.now());
        if (!alive.current || !result.accepted) return;
        const next = chooseMascot(
          state.current.pose,
          poses[event],
          state.current.until,
          Date.now(),
        );
        if (next !== poses[event]) return;
        if (timer.current) clearTimeout(timer.current);
        state.current = { pose: next, until: Date.now() + 7000 };
        setPose(next);
        setText(result.text || "");
        timer.current = setTimeout(() => {
          if (alive.current) {
            setPose("idle");
            setText("");
            state.current = { pose: "idle", until: 0 };
          }
        }, 9000);
      } catch {
        /* Optional banter never blocks training or scheduling. */
      }
    },
    [],
  );
  return { pose, text, visible, emit };
}
