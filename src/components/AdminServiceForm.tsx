import { motion } from "framer-motion";
import { Save, FileText } from "lucide-react";
import type { Doc } from "../../convex/_generated/dataModel";

interface FormData {
  name: string; agency: string; fee: string; processingTime: string;
  documents: string; eligibility: string; processSteps: string;
  locations: string; contacts: string; notes: string;
  lastVerified: string; region: string; latitude: string; longitude: string;
}

interface AdminServiceFormProps {
  formData: FormData;
  setFormData: (d: FormData) => void;
  editingService: Doc<"services"> | null;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export function AdminServiceForm({
  formData, setFormData, editingService, resetForm, handleSubmit,
}: AdminServiceFormProps) {
  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [key]: e.target.value });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card card-hover p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FileText size={20} className="text-emerald-400" />
        {editingService ? "Edit Service" : "Create Service"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Service Name" value={formData.name} onChange={set("name")} className="input" required pattern=".{2,}" title="Service name must be at least 2 characters" />
        <input type="text" placeholder="Agency" value={formData.agency} onChange={set("agency")} className="input" required pattern=".{2,}" title="Agency must be at least 2 characters" />
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Fee (NLe)" value={formData.fee} onChange={set("fee")} className="input" required />
          <input type="text" placeholder="Processing Time" value={formData.processingTime} onChange={set("processingTime")} className="input" required />
        </div>
        <textarea placeholder="Eligibility" value={formData.eligibility} onChange={set("eligibility")} className="input" rows={2} />
        <textarea placeholder="Documents (comma separated)" value={formData.documents} onChange={set("documents")} className="input" rows={3} />
        <textarea placeholder="Process Steps (comma separated)" value={formData.processSteps} onChange={set("processSteps")} className="input" rows={3} />
        <textarea placeholder="Locations (comma separated)" value={formData.locations} onChange={set("locations")} className="input" rows={2} />
        <input type="text" placeholder="Contacts" value={formData.contacts} onChange={set("contacts")} className="input" />
        <textarea placeholder="Notes / corruption warnings" value={formData.notes} onChange={set("notes")} className="input" rows={2} />
        <div className="grid grid-cols-2 gap-4">
          <input type="date" placeholder="Last Verified" value={formData.lastVerified} onChange={set("lastVerified")} className="input" />
          <input type="text" placeholder="Region" value={formData.region} onChange={set("region")} className="input" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input type="number" step="any" placeholder="Latitude (e.g. 8.484)" value={formData.latitude} onChange={set("latitude")} className="input" />
          <input type="number" step="any" placeholder="Longitude (e.g. -13.234)" value={formData.longitude} onChange={set("longitude")} className="input" />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
            <Save size={18} />{editingService ? "Update" : "Create"} Service
          </button>
          {editingService && (
            <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
