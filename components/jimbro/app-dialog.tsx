"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
export function AppDialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const titleId = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const [opener] = useState<HTMLElement | null>(() =>
    typeof document === "undefined"
      ? null
      : (document.activeElement as HTMLElement),
  );
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      if (dialog?.open) dialog.close();
      queueMicrotask(() => {
        if (opener?.isConnected) opener.focus();
      });
    };
  }, [opener]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onKeyDown={(e) => {
        if (
          e.key !== "Tab" ||
          e.defaultPrevented ||
          (e.target as HTMLElement).closest("dialog") !== e.currentTarget
        )
          return;
        const elements = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>(
            'button, a[href], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter(
          (x) =>
            !x.matches(":disabled") &&
            x.tabIndex >= 0 &&
            x.getClientRects().length &&
            x.closest("dialog") === e.currentTarget,
        );
        const first = elements[0],
          last = elements.at(-1);
        if (!first) {
          e.preventDefault();
          return;
        }
        if (
          (e.shiftKey && document.activeElement === first) ||
          (!e.shiftKey && document.activeElement === last)
        ) {
          e.preventDefault();
          (e.shiftKey ? last : first)?.focus();
        }
      }}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-2xl overflow-auto rounded-3xl border border-white/20 bg-[#151619] p-5 text-white shadow-2xl backdrop:bg-black/80 sm:p-8"
    >
      <header className="mb-6 flex items-start justify-between gap-3">
        <h2 id={titleId} className="text-xl font-semibold">
          {title}
        </h2>
        <button
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
