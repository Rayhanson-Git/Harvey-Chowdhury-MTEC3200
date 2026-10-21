"use client";
import { useEffect, useRef, type ReactNode } from "react";
export function AppDialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const focus = document.activeElement as HTMLElement;
    ref.current?.showModal();
    return () => {
      focus?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-2xl overflow-auto rounded-3xl border border-white/20 bg-[#151619] p-5 text-white shadow-2xl backdrop:bg-black/80 sm:p-8"
    >
      <header className="mb-6 flex items-start justify-between gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          autoFocus
          aria-label="Close dialog"
          onClick={onClose}
          className="min-h-11 min-w-11 rounded-xl border border-white/20"
        >
          ✕
        </button>
      </header>
      {children}
    </dialog>
  );
}
