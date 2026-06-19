import { useState, useEffect } from "react";
import { useQuery, useMutation, usePaginatedQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import type { Doc } from "../../convex/_generated/dataModel";
import { AdminAuditLog } from "@/components/AdminAuditLog";
import { AdminFeedback } from "@/components/AdminFeedback";
import { AdminStats } from "@/components/AdminStats";
import { AdminServiceForm } from "@/components/AdminServiceForm";
import { AdminServiceList } from "@/components/AdminServiceList";
import { AdminRepForm } from "@/components/AdminRepForm";
import { AdminRepList } from "@/components/AdminRepList";
import { AdminNewsForm } from "@/components/AdminNewsForm";
import { AdminNewsList } from "@/components/AdminNewsList";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Skeleton } from "@/components/Skeleton";
import {
  Settings, FileText, UserCheck, Activity, MessageSquare, BarChart3, Shield, ArrowLeft, Newspaper,
} from "lucide-react";

interface AdminDashboardProps {
  onBack: () => void;
}

const FORM_KEY = "salonehub_admin_form";
const REP_FORM_KEY = "salonehub_admin_rep_form";

function loadForm(key: string, fallback: any) {
  try {
    const saved = sessionStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
}

function saveForm(key: string, data: any) {
  try { sessionStorage.setItem(key, JSON.stringify(data)); } catch { /* ignore */ }
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [editingService, setEditingService] = useState<Doc<"services"> | null>(null);
  const [editingRepresentative, setEditingRepresentative] = useState<Doc<"representatives"> | null>(null);
  const [activeTab, setActiveTab] = useState<"services" | "representatives" | "audit" | "feedback" | "stats" | "admins" | "news">("stats");
  const [formData, setFormData] = useState(loadForm(FORM_KEY, {
    name: "", agency: "", fee: "", processingTime: "", documents: "",
    eligibility: "", processSteps: "", locations: "", contacts: "", notes: "",
    lastVerified: "", region: "", latitude: "", longitude: "",
  }));
  const [repFormData, setRepFormData] = useState(loadForm(REP_FORM_KEY, {
    name: "", role: "", district: "", phone: "", email: "",
  }));
  const [editingNews, setEditingNews] = useState<Doc<"news"> | null>(null);
  const [newsFormData, setNewsFormData] = useState({
    title: "", summary: "", category: "", source: "SaloneHub", href: "", publishedAt: "",
  });
  const newsList = useQuery(api.news.list, {});

  useEffect(() => { saveForm(FORM_KEY, formData); }, [formData]);
  useEffect(() => { saveForm(REP_FORM_KEY, repFormData); }, [repFormData]);

  const isAdmin = useQuery(api.admin.isAdmin);
  const {
    results: services,
    status: servicesStatus,
  } = usePaginatedQuery(api.services.getServicesPaginated, {}, { initialNumItems: 20 });
  const {
    results: representatives,
    status: repsStatus,
  } = usePaginatedQuery(api.representatives.getRepresentativesPaginated, {}, { initialNumItems: 20 });
  const saveServiceMutation = useMutation(api.services.createService);
  const updateServiceMutation = useMutation(api.services.updateService);
  const deleteServiceMutation = useMutation(api.services.deleteService);
  const saveRepresentativeMutation = useMutation(api.representatives.createRepresentative);
  const updateRepresentativeMutation = useMutation(api.representatives.updateRepresentative);
  const deleteRepresentativeMutation = useMutation(api.representatives.deleteRepresentative);
  const grantAdminMutation = useMutation(api.admin.grantAdmin);
  const revokeAdminMutation = useMutation(api.admin.revokeAdmin);
  const auditLog = useMutation(api.adminLogs.log);
  const createNewsMutation = useMutation(api.news.createNews);
  const updateNewsMutation = useMutation(api.news.updateNews);
  const deleteNewsMutation = useMutation(api.news.deleteNews);

  const users = useQuery(api.admin.listUsers);

  const [confirmDelete, setConfirmDelete] = useState<{
    type: "service" | "representative"; id: string; name: string;
  } | null>(null);
  if (isAdmin === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-card card-hover p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Settings className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You must be signed in with an admin account to access this panel.</p>
        </motion.div>
      </div>
    );
  }

  const handleEdit = (service: Doc<"services">) => {
    setEditingService(service);
    setFormData({
      name: service.name || "", agency: service.agency || "", fee: service.fee || "",
      processingTime: service.processingTime || "", documents: service.documents?.join(", ") || "",
      eligibility: service.eligibility || "", processSteps: service.processSteps?.join(", ") || "",
      locations: service.locations?.join(", ") || "", contacts: service.contacts || "",
      notes: service.notes || "", lastVerified: service.lastVerified || "",
      region: service.region || "", latitude: service.latitude?.toString() || "",
      longitude: service.longitude?.toString() || "",
    });
  };

  const resetForm = () => {
    setEditingService(null);
    const empty = { name: "", agency: "", fee: "", processingTime: "", documents: "",
      eligibility: "", processSteps: "", locations: "", contacts: "", notes: "",
      lastVerified: "", region: "", latitude: "", longitude: "" };
    setFormData(empty);
    saveForm(FORM_KEY, empty);
  };

  const handleEditRepresentative = (representative: Doc<"representatives">) => {
    setEditingRepresentative(representative);
    setRepFormData({
      name: representative.name || "", role: representative.role || "",
      district: representative.district || "",
      phone: representative.phone || "", email: representative.email || "",
    });
  };

  const resetRepForm = () => {
    setEditingRepresentative(null);
    const empty = { name: "", role: "", district: "", phone: "", email: "" };
    setRepFormData(empty);
    saveForm(REP_FORM_KEY, empty);
  };

  const handleRepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const repData = { ...repFormData };
    if (editingRepresentative) {
      void updateRepresentativeMutation({ id: editingRepresentative._id, ...repData }).then(() => {
        void auditLog({ action: "update", entityType: "representatives", entityId: editingRepresentative._id, details: repFormData.name });
        toast.success(`Updated ${repFormData.name}`);
      }).catch(() => toast.error("Failed to update representative"));
    } else {
      saveRepresentativeMutation(repData).then((id) => {
        void auditLog({ action: "create", entityType: "representatives", entityId: id, details: repFormData.name });
        toast.success(`Created ${repFormData.name}`);
      }).catch(() => toast.error("Failed to create representative"));
    }
    resetRepForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData = {
      ...formData,
      documents: formData.documents.split(",").map((d: string) => d.trim()).filter((d: string) => d),
      processSteps: formData.processSteps.split(",").map((s: string) => s.trim()).filter((s: string) => s),
      locations: formData.locations.split(",").map((l: string) => l.trim()).filter((l: string) => l),
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
    };
    if (editingService) {
      void updateServiceMutation({ id: editingService._id, ...serviceData }).then(() => {
        void auditLog({ action: "update", entityType: "services", entityId: editingService._id, details: serviceData.name });
        toast.success(`Updated ${serviceData.name}`);
      }).catch(() => toast.error("Failed to update service"));
    } else {
      saveServiceMutation(serviceData).then((id) => {
        void auditLog({ action: "create", entityType: "services", entityId: id, details: serviceData.name });
        toast.success(`Created ${serviceData.name}`);
      }).catch(() => toast.error("Failed to create service"));
    }
    resetForm();
  };

  const handleConfirmDelete = () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === "service") {
      void deleteServiceMutation({ id: confirmDelete.id }).then(() => {
        void auditLog({ action: "delete", entityType: "services", entityId: confirmDelete.id, details: confirmDelete.name });
        toast.success(`Deleted ${confirmDelete.name}`);
      }).catch(() => toast.error("Failed to delete service"));
    } else {
      void deleteRepresentativeMutation({ id: confirmDelete.id }).then(() => {
        void auditLog({ action: "delete", entityType: "representatives", entityId: confirmDelete.id, details: confirmDelete.name });
        toast.success(`Deleted ${confirmDelete.name}`);
      }).catch(() => toast.error("Failed to delete representative"));
    }
    setConfirmDelete(null);
  };

  const handleNewsEdit = (item: Doc<"news">) => {
    setEditingNews(item);
    setNewsFormData({
      title: item.title,
      summary: item.summary,
      category: item.category,
      source: item.source ?? "",
      href: item.href ?? "",
      publishedAt: new Date(item.publishedAt).toISOString().split("T")[0],
    });
  };

  const resetNewsForm = () => {
    setEditingNews(null);
    setNewsFormData({ title: "", summary: "", category: "", source: "SaloneHub", href: "", publishedAt: "" });
  };

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: newsFormData.title,
      summary: newsFormData.summary,
      category: newsFormData.category,
      source: newsFormData.source || undefined,
      href: newsFormData.href || undefined,
      publishedAt: newsFormData.publishedAt ? new Date(newsFormData.publishedAt).getTime() : undefined,
    };
    if (editingNews) {
      void updateNewsMutation({ id: editingNews._id, ...data }).then(() => {
        toast.success("News updated");
      }).catch(() => toast.error("Failed to update news"));
    } else {
      void createNewsMutation(data).then(() => {
        toast.success("News published");
      }).catch(() => toast.error("Failed to create news"));
    }
    resetNewsForm();
  };

  const handleNewsDelete = (item: Doc<"news">) => {
    void deleteNewsMutation({ id: item._id }).then(() => {
      toast.success("News deleted");
    }).catch(() => toast.error("Failed to delete news"));
  };

  const handleGrantAdmin = (userId: string, email: string) => {
    void grantAdminMutation({ userId: userId as any }).then((result) => {
      if (result.alreadyAdmin) {
        toast.info(`${email} is already an admin`);
      } else {
        toast.success(`Granted admin to ${email}`);
      }
    }).catch(() => toast.error("Failed to grant admin"));
  };

  const handleRevokeAdmin = (userId: string, email: string) => {
    void revokeAdminMutation({ userId: userId as any }).then((result) => {
      if (result.wasNotAdmin) {
        toast.info(`${email} is not an admin`);
      } else {
        toast.success(`Revoked admin from ${email}`);
      }
    }).catch(() => toast.error("Failed to revoke admin"));
  };

  const tabButton = (tab: typeof activeTab, icon: React.ReactNode, label: string) => (
    <button onClick={() => setActiveTab(tab)}
      className={`pb-3 px-1 font-medium text-sm transition-colors whitespace-nowrap ${
        activeTab === tab ? "text-emerald-400 border-b-2 border-emerald-400" : "text-gray-400 hover:text-gray-300"
      }`}>
      {icon}{label}
    </button>
  );

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <p className="text-emerald-400 font-bold text-xs sm:text-sm uppercase tracking-wider mb-1">Admin</p>
          <h1 className="text-2xl sm:text-4xl font-bold">Control Center</h1>
        </div>
        <button onClick={onBack} className="btn-ghost flex items-center gap-1.5 text-sm">
          <ArrowLeft size={16} /> Back to main
        </button>
      </div>

      <div className="flex gap-4 mb-6 sm:mb-8 border-b border-gray-700 overflow-x-auto no-scrollbar">
        {tabButton("stats", <BarChart3 size={16} className="inline mr-1.5" />, "Stats")}
        {tabButton("services", <FileText size={16} className="inline mr-1.5" />, "Services")}
        {tabButton("representatives", <UserCheck size={16} className="inline mr-1.5" />, "Representatives")}
        {tabButton("audit", <Activity size={16} className="inline mr-1.5" />, "Audit Log")}
        {tabButton("feedback", <MessageSquare size={16} className="inline mr-1.5" />, "Feedback")}
        {tabButton("admins", <Shield size={16} className="inline mr-1.5" />, "Admins")}
        {tabButton("news", <Newspaper size={16} className="inline mr-1.5" />, "News")}
      </div>

      {activeTab === "stats" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card card-hover p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-emerald-400" />Dashboard Stats
          </h2>
          <AdminStats />
        </motion.div>
      )}

      {activeTab === "services" && (
        <div className="grid md:grid-cols-2 gap-8">
          <AdminServiceForm
            formData={formData} setFormData={setFormData}
            editingService={editingService} resetForm={resetForm}
            handleSubmit={handleSubmit}
          />
          {servicesStatus === "LoadingFirstPage" ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <AdminServiceList services={services} onEdit={handleEdit} onDelete={(s) => setConfirmDelete({ type: "service", id: s._id, name: s.name })} />
          )}
        </div>
      )}

      {activeTab === "representatives" && (
        <div className="grid md:grid-cols-2 gap-8">
          <AdminRepForm
            repFormData={repFormData} setRepFormData={setRepFormData}
            editingRepresentative={editingRepresentative} resetRepForm={resetRepForm}
            handleRepSubmit={handleRepSubmit}
          />
          {repsStatus === "LoadingFirstPage" ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <AdminRepList representatives={representatives} onEdit={handleEditRepresentative} onDelete={(r) => setConfirmDelete({ type: "representative", id: r._id, name: r.name })} />
          )}
        </div>
      )}

      {activeTab === "audit" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card card-hover p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity size={20} className="text-purple-400" />Audit Log
          </h2>
          <AdminAuditLog />
        </motion.div>
      )}

      {activeTab === "feedback" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card card-hover p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare size={20} className="text-purple-400" />Feedback
          </h2>
          <AdminFeedback />
        </motion.div>
      )}

      {activeTab === "admins" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card card-hover p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Shield size={20} className="text-yellow-400" />Admin Management
          </h2>
          {!users ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : users.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No users found.</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {users.map((u) => (
                <div key={u._id} className="glass-surface rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{u.email}</p>
                    {u.name && <p className="text-xs text-muted-foreground">{u.name}</p>}
                  </div>
                  {u.isAdmin ? (
                    <button onClick={() => handleRevokeAdmin(u._id, u.email)}
                      className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-medium hover:bg-red-500/30">
                      Revoke Admin
                    </button>
                  ) : (
                    <button onClick={() => handleGrantAdmin(u._id, u.email)}
                      className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium hover:bg-emerald-500/30">
                      Grant Admin
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "news" && (
        <div className="grid md:grid-cols-2 gap-8">
          <AdminNewsForm
            formData={newsFormData} setFormData={setNewsFormData}
            editingNews={editingNews} resetForm={resetNewsForm}
            handleSubmit={handleNewsSubmit}
          />
          <AdminNewsList news={newsList} onEdit={handleNewsEdit} onDelete={handleNewsDelete} />
        </div>
      )}

      <ConfirmDialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}
        title="Confirm Deletion"
        message={confirmDelete ? `Are you sure you want to delete "${confirmDelete.name}"? This action cannot be undone.` : ""}
        confirmLabel="Delete" variant="danger" onConfirm={handleConfirmDelete} />

    </div>
  );
}
