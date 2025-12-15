import { useMemo, useState } from "react";

type NewsCategory =
  | "Government"
  | "Health"
  | "Education"
  | "Transport"
  | "Public Notice";

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  date: string; // ISO
  source?: string;
  href?: string;
};

const SAMPLE_NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "Public Service Announcement: Updated working hours",
    summary:
      "Selected public offices will operate extended hours on weekdays to reduce queue times for citizens.",
    category: "Public Notice",
    date: "2025-12-10",
    source: "Salone Hub",
  },
  {
    id: "n2",
    title: "New digital appointment pilot (Freetown)",
    summary:
      "A pilot program is launching to let citizens book appointments for high-demand services online.",
    category: "Government",
    date: "2025-12-06",
    source: "Salone Hub",
  },
  {
    id: "n3",
    title: "Health advisory: Harmattan season precautions",
    summary:
      "Tips for protecting vulnerable groups during dusty conditions, including masks, hydration, and clinic hotlines.",
    category: "Health",
    date: "2025-11-29",
    source: "Salone Hub",
  },
  {
    id: "n4",
    title: "Education: Scholarship application timeline",
    summary:
      "A reminder to prepare documents early—ID, transcripts, and reference letters—to avoid last-minute delays.",
    category: "Education",
    date: "2025-11-21",
    source: "Salone Hub",
  },
  {
    id: "n5",
    title: "Transport notice: Vehicle registration guidance",
    summary:
      "Quick checklist of required documents and the typical processing timeline for vehicle registration.",
    category: "Transport",
    date: "2025-11-15",
    source: "Salone Hub",
  },
];

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function NewsSection() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"" | NewsCategory>("");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SAMPLE_NEWS.filter((n) => {
      const matchesCategory = !category || n.category === category;
      const matchesQuery =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="space-y-6">
      <div className="glass-card card-hover p-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight">News & Updates</h3>
            <p className="text-sm text-muted-foreground">
              Official updates, advisories, and public notices.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search news..."
              className="input sm:w-72"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as "" | NewsCategory)}
              className="select sm:w-52"
            >
              <option value="">All categories</option>
              <option value="Government">Government</option>
              <option value="Public Notice">Public Notice</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Transport">Transport</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((n) => (
          <article key={n.id} className="glass-card card-hover p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-lg font-bold tracking-tight truncate">
                  {n.title}
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="pill">📰 {n.category}</span>
                  <span className="pill">📅 {formatDate(n.date)}</span>
                </div>
              </div>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">{n.summary}</p>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                Source:{" "}
                <span className="font-medium text-foreground/80">
                  {n.source ?? "—"}
                </span>
              </div>

              {n.href ? (
                <a
                  className="btn-ghost"
                  href={n.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read more
                </a>
              ) : (
                <button type="button" className="btn-ghost" disabled>
                  Read more
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {items.length === 0 && (
        <div className="glass-card card-hover p-8 text-center">
          <div className="text-4xl mb-3">🔎</div>
          <div className="text-lg font-bold tracking-tight">No news found</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Try clearing filters or searching different keywords.
          </p>
        </div>
      )}

      <div className="glass-surface rounded-2xl p-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground/90">Note:</span> This is
        a starter news feed. If you want, I can connect it to Convex so admins
        can publish announcements.
      </div>
    </div>
  );
}
