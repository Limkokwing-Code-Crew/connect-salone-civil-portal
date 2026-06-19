import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type NewsCategory = "Government" | "Health" | "Education" | "Transport" | "Public Notice";

function formatDate(ts: number) {
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(ts);
  }
}

export function NewsSection() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"" | NewsCategory>("");

  const allNews = useQuery(api.news.list, {});

  const items = useMemo(() => {
    if (!allNews) return [];
    const q = query.trim().toLowerCase();
    return allNews.filter((n) => {
      const matchesCategory = !category || n.category === category;
      const matchesQuery =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category, allNews]);

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
          <article key={n._id} className="glass-card card-hover p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-lg font-bold tracking-tight truncate">{n.title}</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="pill">📰 {n.category}</span>
                  <span className="pill">📅 {formatDate(n.publishedAt)}</span>
                  {n.type === "auto" && <span className="pill bg-blue-500/20 text-blue-400">auto</span>}
                </div>
              </div>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">{n.summary}</p>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                Source: <span className="font-medium text-foreground/80">{n.source ?? "SaloneHub"}</span>
              </div>

              {n.href ? (
                <a className="btn-ghost" href={n.href} target="_blank" rel="noreferrer">
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

      {!allNews && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}

      {items.length === 0 && allNews && (
        <div className="glass-card card-hover p-8 text-center">
          <div className="text-4xl mb-3">🔎</div>
          <div className="text-lg font-bold tracking-tight">No news found</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Try clearing filters or searching different keywords.
          </p>
        </div>
      )}

    </div>
  );
}
