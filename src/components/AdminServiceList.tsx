import { motion } from "framer-motion";
import { Download, Edit, Trash2, Users } from "lucide-react";
import type { Doc } from "../../convex/_generated/dataModel";
import { downloadCsv } from "@/lib/csv";

interface AdminServiceListProps {
  services: Doc<"services">[] | undefined;
  onEdit: (service: Doc<"services">) => void;
  onDelete: (service: Doc<"services">) => void;
}

export function AdminServiceList({ services, onEdit, onDelete }: AdminServiceListProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card card-hover p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Users size={20} className="text-blue-400" />
        Services ({services?.length || 0})
        {services && services.length > 0 && (
          <button type="button" onClick={() =>
            downloadCsv("services.csv",
              ["name", "agency", "fee", "processingTime", "region", "contacts"],
              services.map((s) => ({
                name: s.name, agency: s.agency, fee: s.fee,
                processingTime: s.processingTime, region: s.region, contacts: s.contacts,
              })),
            )}
            className="ml-auto p-1.5 rounded-lg glass-hover text-muted-foreground hover:text-emerald-400"
            title="Export CSV" aria-label="Export services as CSV">
            <Download size={16} />
          </button>
        )}
      </h2>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {!services || services.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No services yet. Create one using the form.</p>
        ) : services.map((service) => (
          <motion.div key={service._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-surface rounded-xl p-4 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold">{service.name}</h3>
              <p className="text-sm text-muted-foreground">{service.agency} · {service.region}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onEdit(service)} className="p-2 rounded-lg glass-hover text-emerald-400">
                <Edit size={18} />
              </button>
              <button onClick={() => onDelete(service)} className="p-2 rounded-lg glass-hover text-red-400">
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
