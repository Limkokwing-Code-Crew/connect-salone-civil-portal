import { ThemeSetting } from "@/hooks/useTheme";

function IconSun(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function IconMoon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function IconSystem(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 18v2" />
    </svg>
  );
}

export function ThemeToggle(props: {
  theme: ThemeSetting;
  onCycle: () => void;
}) {
  const label =
    props.theme === "light"
      ? "Theme: Light"
      : props.theme === "dark"
        ? "Theme: Dark"
        : "Theme: System";

  return (
    <button
      type="button"
      className="btn-ghost px-3"
      onClick={props.onCycle}
      aria-label={label}
      title={label}
    >
      {props.theme === "light" && <IconSun />}
      {props.theme === "dark" && <IconMoon />}
      {props.theme === "system" && <IconSystem />}
      <span className="hidden sm:inline text-sm text-muted-foreground">
        {props.theme === "system" ? "Auto" : props.theme}
      </span>
    </button>
  );
}
