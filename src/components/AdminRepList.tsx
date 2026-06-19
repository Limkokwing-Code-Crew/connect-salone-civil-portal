import { motion } from "framer-motion";
import { Download, Edit, Trash2, UserCheck } from "lucide-react";
import type { Doc } from "../../convex/_generated/dataModel";
import { downloadCsv } from "@/lib/csv";

interface AdminRepListProps {
  representatives: Doc<"representatives">[] | undefined;
  onEdit: (rep: Doc<"representatives">) => void;
  onDelete: (rep: Doc<"representatives">) => void;
}

export function AdminRepList({ representatives, onEdit, onDelete }: AdminRepListProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card card-hover p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <UserCheck size={20} className="text-purple-400" />
        Representatives ({representatives?.length || 0})
        {representatives && representatives.length > 0 && (
          <button type="button" onClick={() =>
            downloadCsv("representatives.csv",
              ["name", "role", "district", "phone", "email"],
              representatives.map((r) => ({
                name: r.name, role: r.role, district: r.district,
                phone: r.phone, email: r.email,
              })),
            )}
            className="ml-auto p-1.5 rounded-lg glass-hover text-muted-foreground hover:text-emerald-400"
            title="Export CSV" aria-label="Export representatives as CSV">
            <Download size={16} />
          </button>
        )}
      </h2>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {!representatives || representatives.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No representatives yet. Create one using the form.</p>
        ) : representatives.map((representative) => (
          <motion.div key={representative._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-surface rounded-xl p-4 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold">{representative.name}</h3>
              <p className="text-sm text-muted-foreground">{representative.title || representative.role} · {representative.district}</p>
              <p className="text-xs text-muted-foreground">{representative.phone} · {representative.email}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onEdit(representative)} className="p-2 rounded-lg glass-hover text-emerald-400">
                <Edit size={18} />
              </button>
              <button onClick={() => onDelete(representative)} className="p-2 rounded-lg glass-hover text-red-400">
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
