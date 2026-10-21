"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { alertMilestone, phaseAt } from "@/lib/jimbro/schedule";
import { claimAlert, loadSnapshot } from "@/lib/jimbro/storage";
import type { Snapshot } from "@/lib/jimbro/types";

const empty: Snapshot = { active: null, sessions: [], weights: [] };
export function useWorkoutStore() {
  const [snapshot, setSnapshot] = useState<Snapshot>(empty);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [now, setNow] = useState(0);
  const [visible, setVisible] = useState(true);
  const [alert, setAlert] = useState<{ key: string; milestone: string; message: string } | null>(null);
  const [sound, setSound] = useState(false);
  const [soundMessage, setSoundMessage] = useState("");
  const channel = useRef<BroadcastChannel | null>(null);
  const lock = useRef(false);
  const audio = useRef<AudioContext | null>(null);
  const alive = useRef(false);
  const reload = useCallback(async (clearError = false) => {
    try { const data = await loadSnapshot(); if (alive.current) { setSnapshot(data); setNow(Date.now()); setReady(true); if (clearError) setError(""); } }
    catch (reason) { if (alive.current) setError(reason instanceof Error ? reason.message : "Could not read local storage. Your data was not reset."); }
    finally { if (alive.current) setLoading(false); }
  }, []);
  useEffect(() => {
    alive.current = true;
    // Hydrate from the external store through its asynchronous completion callback.
    // This also keeps device-clock reads out of the production prerender.
    void loadSnapshot().then((data) => {
      if (alive.current) { setSnapshot(data); setNow(Date.now()); setReady(true); }
    }).catch((reason: unknown) => {
      if (alive.current) setError(reason instanceof Error ? reason.message : "Could not read local storage. Your data was not reset.");
    }).finally(() => { if (alive.current) setLoading(false); });
    const update = () => { setNow(Date.now()); setVisible(document.visibilityState === "visible"); if (document.visibilityState === "visible") void reload(); };
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    document.addEventListener("visibilitychange", update); window.addEventListener("focus", update);
    if (typeof BroadcastChannel !== "undefined") { channel.current = new BroadcastChannel("jimbro-updates"); channel.current.onmessage = () => { void reload(); }; }
    return () => { alive.current = false; clearInterval(timer); document.removeEventListener("visibilitychange", update); window.removeEventListener("focus", update); channel.current?.close(); channel.current = null; void audio.current?.close(); audio.current = null; };
  }, [reload]);
  const run = useCallback(async (task: () => Promise<unknown>): Promise<boolean> => {
    if (lock.current) return false;
    lock.current = true; setBusy(true); setError("");
    let committed = false;
    try {
      await task(); committed = true;
      channel.current?.postMessage("saved");
      const data = await loadSnapshot(); setSnapshot(data); setReady(true); return true;
    } catch (reason) {
      setError(`${committed ? "Your change was saved, but the view could not refresh. " : ""}${reason instanceof Error ? reason.message : "Save failed. Retry before reloading; your input is still here."}`);
      return committed;
    } finally { lock.current = false; setBusy(false); }
  }, []);
  async function toggleSound() {
    if (sound) { setSound(false); setSoundMessage("Sound off. Visual alerts stay on."); return; }
    try {
      audio.current ||= new AudioContext(); await audio.current.resume();
      if (audio.current.state !== "running") throw new Error("Audio is blocked.");
      playTone(audio.current); setSound(true); setSoundMessage("Sound enabled and tested. Keep this app visible.");
    } catch { setSound(false); setSoundMessage("Sound could not play. Visual phase alerts will still appear."); }
  }
  const session = snapshot.active;
  const milestone = session ? alertMilestone(session, now) : null;
  const alertSession = useRef(session);
  useEffect(() => { alertSession.current = session; }, [session]);
  useEffect(() => {
    if (!session || !milestone || !visible || document.visibilityState !== "visible") return;
    const key = `${session.id}:${session.schedule.revision}:${milestone}`;
    void claimAlert(session, milestone).then((claimed) => {
      const current = alertSession.current;
      if (!claimed || !alive.current || document.visibilityState !== "visible" || current?.id !== session.id || current.schedule.revision !== session.schedule.revision) return;
      setAlert({ key, milestone, message: phaseAt(current, Date.now()).message });
      if (sound && audio.current?.state === "running") playTone(audio.current);
      else if (sound) setSoundMessage("Sound is suspended. Use the visible phase alert.");
    }).catch(() => { if (alive.current) setSoundMessage("Alert receipt could not be saved. Current phase guidance remains visible."); });
  }, [session, milestone, visible, sound]);
  return { snapshot, loading, ready, busy, error, now, alert, setAlert, sound, soundMessage, toggleSound, run, reload };
}

function playTone(context: AudioContext) {
  const oscillator = context.createOscillator(), gain = context.createGain();
  oscillator.frequency.value = 660; gain.gain.setValueAtTime(0.08, context.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.7);
  oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.7);
  oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
}
