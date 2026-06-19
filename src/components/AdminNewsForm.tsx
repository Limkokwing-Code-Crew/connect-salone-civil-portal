import { motion } from "framer-motion";
import { Save, Newspaper } from "lucide-react";
import type { Doc } from "../../convex/_generated/dataModel";

interface NewsFormData {
  title: string;
  summary: string;
  category: string;
  source: string;
  href: string;
  publishedAt: string;
}

interface AdminNewsFormProps {
  formData: NewsFormData;
  setFormData: (d: NewsFormData) => void;
  editingNews: Doc<"news"> | null;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const CATEGORIES = ["Government", "Health", "Education", "Transport", "Public Notice"];

export function AdminNewsForm({
  formData, setFormData, editingNews, resetForm, handleSubmit,
}: AdminNewsFormProps) {
  const set = (key: keyof NewsFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [key]: e.target.value });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card card-hover p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Newspaper size={20} className="text-yellow-400" />
        {editingNews ? "Edit News" : "Create News"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Title *" value={formData.title} onChange={set("title")}
          className="input" required pattern=".{3,}" title="Title must be at least 3 characters" />
        <textarea placeholder="Summary *" value={formData.summary} onChange={set("summary")}
          className="input" rows={3} required />
        <select value={formData.category} onChange={set("category")} className="select" required>
          <option value="">Select category *</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="text" placeholder="Source (e.g. SaloneHub)" value={formData.source} onChange={set("source")} className="input" />
        <input type="url" placeholder="External link (optional)" value={formData.href} onChange={set("href")} className="input" />
        <input type="date" placeholder="Publish date" value={formData.publishedAt} onChange={set("publishedAt")} className="input" />
        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
            <Save size={18} />{editingNews ? "Update" : "Publish"} News
          </button>
          {editingNews && (
            <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
