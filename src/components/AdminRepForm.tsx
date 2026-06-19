import { motion } from "framer-motion";
import { Save, UserCheck } from "lucide-react";
import type { Doc } from "../../convex/_generated/dataModel";

interface RepFormData {
  name: string; role: string; district: string;
  phone: string; email: string;
}

interface AdminRepFormProps {
  repFormData: RepFormData;
  setRepFormData: (d: RepFormData) => void;
  editingRepresentative: Doc<"representatives"> | null;
  resetRepForm: () => void;
  handleRepSubmit: (e: React.FormEvent) => void;
}

export function AdminRepForm({
  repFormData, setRepFormData, editingRepresentative, resetRepForm, handleRepSubmit,
}: AdminRepFormProps) {
  const set = (key: keyof RepFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setRepFormData({ ...repFormData, [key]: e.target.value });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card card-hover p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <UserCheck size={20} className="text-purple-400" />
        {editingRepresentative ? "Edit Representative" : "Create Representative"}
      </h2>
      <form onSubmit={handleRepSubmit} className="space-y-4">
        <input type="text" placeholder="Full Name *" value={repFormData.name} onChange={set("name")}
          className="input" required pattern=".{2,}" title="Name must be at least 2 characters" />
        <input type="text" placeholder="Role (e.g. MP, Councilor)" value={repFormData.role} onChange={set("role")} className="input" />
        <input type="text" placeholder="District *" value={repFormData.district} onChange={set("district")}
          className="input" required pattern=".{2,}" title="District is required" />
        <input type="tel" placeholder="Phone Number *" value={repFormData.phone} onChange={set("phone")}
          className="input" required pattern="[\d\s\+\-\(\)]{7,}" title="Enter a valid phone number (at least 7 digits)" />
        <input type="email" placeholder="Email Address *" value={repFormData.email} onChange={set("email")}
          className="input" required />
        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
            <Save size={18} />{editingRepresentative ? "Update" : "Create"} Representative
          </button>
          {editingRepresentative && (
            <button type="button" onClick={resetRepForm} className="btn-ghost">Cancel</button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
