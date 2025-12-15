import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
// import { format } from "date-fns";
import {
  BarChart,
  Users,
  FileText,
  MessageSquare,
  Trash2,
  Edit,
  Plus,
  Star,
  Settings,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ServiceFormModal } from "./ServiceFormModal";
import { RepFormModal } from "./RepFormModal";

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"analytics" | "services" | "reps" | "feedback">("analytics");
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full">
      {/* Admin Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold">
            AD
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {t("admin.title")}
            </h1>
            <p className="text-sm text-slate-400">System Overview</p>
          </div>
        </div>
        <button className="btn-ghost text-red-400 hover:text-red-300" onClick={onLogout}>
          <LogOut size={18} className="mr-2" />
          {t("admin.logout")}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-white/10 bg-slate-900/30 p-4 space-y-2 hidden md:block">
          <SidebarItem
            active={activeTab === "analytics"}
            onClick={() => setActiveTab("analytics")}
            icon={<BarChart size={18} />}
            label={t("admin.analytics")}
          />
          <SidebarItem
            active={activeTab === "services"}
            onClick={() => setActiveTab("services")}
            icon={<FileText size={18} />}
            label={t("admin.services")}
          />
          <SidebarItem
            active={activeTab === "reps"}
            onClick={() => setActiveTab("reps")}
            icon={<Users size={18} />}
            label={t("admin.representatives")}
          />
          <SidebarItem
            active={activeTab === "feedback"}
            onClick={() => setActiveTab("feedback")}
            icon={<MessageSquare size={18} />}
            label={t("admin.feedback")}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === "analytics" && <AnalyticsView />}
          {activeTab === "services" && <ServicesManager />}
          {activeTab === "reps" && <RepsManager />}
          {activeTab === "feedback" && <FeedbackViewer />}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
        ? "bg-primary text-primary-foreground shadow-lg"
        : "hover:bg-white/5 text-slate-400 hover:text-white"
        }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function AnalyticsView() {
  const stats = useQuery(api.analytics.getStats);

  if (!stats) return <div>Loading stats...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Services"
          value={stats.totalServices}
          icon={<FileText className="text-blue-400" />}
          gradient="from-blue-500/20 to-cyan-500/10"
        />
        <StatCard
          title="Representatives"
          value={stats.totalRepresentatives}
          icon={<Users className="text-green-400" />}
          gradient="from-green-500/20 to-emerald-500/10"
        />
        <StatCard
          title="Feedback Entries"
          value={stats.totalFeedback}
          icon={<Star className="text-yellow-400" />}
          gradient="from-yellow-500/20 to-orange-500/10"
        />
        <StatCard
          title="AI Messages"
          value={stats.totalMessages}
          icon={<MessageSquare className="text-purple-400" />}
          gradient="from-purple-500/20 to-pink-500/10"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, gradient }: any) {
  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} border border-white/5 shadow-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/10 rounded-lg">{icon}</div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground opacity-80">{title}</div>
    </div>
  );
}

function FeedbackViewer() {
  const feedback = useQuery(api.feedback.getFeedback);

  if (!feedback) return <div>Loading feedback...</div>;

  return (
    <div className="space-y-4 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">User Feedback</h2>
      {feedback.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">No feedback yet.</div>
      ) : (
        feedback.map((item: any) => (
          <div key={item._id} className="glass-surface p-4 rounded-xl border border-white/10">
            <div className="flex items-start justify-between">
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={16} fill={s <= item.rating ? "currentColor" : "none"} className={s <= item.rating ? "text-yellow-400" : "text-gray-600"} />
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(item.timestamp).toLocaleString()}
              </div>
            </div>
            {item.comment && <p className="text-sm mt-2">{item.comment}</p>}
            {item.userId && <div className="text-xs text-blue-400 mt-2">User: {item.userId}</div>}
          </div>
        ))
      )}
    </div>
  );
}

function ServicesManager() {
  const services = useQuery(api.services.getAllServices);
  const deleteService = useMutation(api.services.deleteService);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure? This cannot be undone.")) {
      await deleteService({ id });
      toast.success("Service deleted");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Services</h2>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => setModalOpen(true)}
        >
          <Plus size={18} /> Add Service
        </button>
      </div>
      <ServiceFormModal open={modalOpen} onOpenChange={setModalOpen} />
      <div className="grid gap-4">
        {services?.map((s: any) => (
          <div key={s._id} className="glass-surface p-4 rounded-xl flex justify-between items-center">
            <div>
              <div className="font-bold">{s.name}</div>
              <div className="text-sm text-muted-foreground">{s.agency}</div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-white/10 rounded-lg text-blue-400" title="Edit">
                <Edit size={18} />
              </button>
              <button
                className="p-2 hover:bg-white/10 rounded-lg text-red-400"
                title="Delete"
                onClick={() => handleDelete(s._id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RepsManager() {
  const reps = useQuery(api.representatives.getAllRepresentatives);
  const deleteRep = useMutation(api.representatives.deleteRepresentative);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure?")) {
      await deleteRep({ id });
      toast.success("Representative deleted");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Representatives</h2>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => setModalOpen(true)}
        >
          <Plus size={18} /> Add Representative
        </button>
      </div>
      <RepFormModal open={modalOpen} onOpenChange={setModalOpen} />
      <div className="grid gap-4">
        {reps?.map((r: any) => (
          <div key={r._id} className="glass-surface p-4 rounded-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold">
                {r.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-bold">{r.name}</div>
                <div className="text-sm text-muted-foreground">{r.role} • {r.district}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-white/10 rounded-lg text-blue-400" title="Edit">
                <Edit size={18} />
              </button>
              <button
                className="p-2 hover:bg-white/10 rounded-lg text-red-400"
                title="Delete"
                onClick={() => handleDelete(r._id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
