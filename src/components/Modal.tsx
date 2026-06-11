import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function getFocusable(container: HTMLElement) {
  const selectors = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ];
  return Array.from(
    container.querySelectorAll<HTMLElement>(selectors.join(",")),
  ).filter(
    (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"),
  );
}

export function Modal(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!props.open) return;

    lastActiveRef.current = document.activeElement as HTMLElement | null;

    // Lock scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus first focusable
    const t = window.setTimeout(() => {
      const el = dialogRef.current;
      if (!el) return;
      const focusables = getFocusable(el);
      (focusables[0] ?? el).focus();
    }, 0);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      lastActiveRef.current?.focus?.();
    };
  }, [props.open]);

  useEffect(() => {
    if (!props.open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onOpenChange(false);

      if (e.key === "Tab") {
        const el = dialogRef.current;
        if (!el) return;
        const focusables = getFocusable(el);
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;

        if (e.shiftKey) {
          if (active === first || active === el) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [props.open, props]);

  if (!props.open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={props.title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) props.onOpenChange(false);
      }}
    >
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          "relative w-full max-w-sm xs:max-w-xl max-h-[85vh] xs:max-h-[90vh] glass-card card-hover p-4 xs:p-6 animate-fade-in outline-none flex flex-col mx-2 xs:mx-0",
          props.className,
        )}
      >
        <div className="flex items-start justify-between gap-2 xs:gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg xs:text-xl font-bold tracking-tight pr-2">
              {props.title}
            </h2>
            {props.description ? (
              <p className="mt-1 text-xs xs:text-sm text-muted-foreground">
                {props.description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="btn-ghost px-2 xs:px-3 flex-shrink-0"
            onClick={() => props.onOpenChange(false)}
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 overflow-y-auto flex-1">{props.children}</div>
      </div>
    </div>,
    document.body,
  );
}
