export function LiquidBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient wash */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(16,185,129,0.22),transparent_60%),radial-gradient(1000px_circle_at_80%_0%,rgba(34,211,238,0.18),transparent_55%),radial-gradient(900px_circle_at_80%_90%,rgba(99,102,241,0.14),transparent_55%)] dark:bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(16,185,129,0.18),transparent_60%),radial-gradient(1000px_circle_at_80%_0%,rgba(34,211,238,0.14),transparent_55%),radial-gradient(900px_circle_at_80%_90%,rgba(99,102,241,0.12),transparent_55%)]" />

      {/* Floating blobs */}
      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-400/35 to-cyan-400/25 blur-3xl animate-float" />
      <div className="absolute top-24 -right-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-cyan-400/25 to-indigo-400/25 blur-3xl animate-float [animation-delay:-3s]" />
      <div className="absolute bottom-[-10rem] left-1/4 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-indigo-400/20 to-emerald-400/20 blur-3xl animate-float [animation-delay:-6s]" />

      {/* Subtle highlight sweep */}
      <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.06]">
        <div className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white to-transparent blur-2xl animate-shimmer" />
      </div>
    </div>
  );
}
