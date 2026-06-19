import { motion } from "framer-motion";
import { Edit, Trash2, Newspaper } from "lucide-react";
import type { Doc } from "../../convex/_generated/dataModel";

interface AdminNewsListProps {
  news: Doc<"news">[] | undefined;
  onEdit: (item: Doc<"news">) => void;
  onDelete: (item: Doc<"news">) => void;
}

export function AdminNewsList({ news, onEdit, onDelete }: AdminNewsListProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card card-hover p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Newspaper size={20} className="text-yellow-400" />
        News ({news?.length || 0})
      </h2>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {!news || news.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No news yet. Publish one using the form.</p>
        ) : news.map((item) => (
          <motion.div key={item._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-surface rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] pill">{item.category}</span>
                  {item.type === "auto" && <span className="text-[10px] pill bg-blue-500/20 text-blue-400">auto</span>}
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => onEdit(item)} className="p-2 rounded-lg glass-hover text-emerald-400">
                  <Edit size={16} />
                </button>
                <button onClick={() => onDelete(item)} className="p-2 rounded-lg glass-hover text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
