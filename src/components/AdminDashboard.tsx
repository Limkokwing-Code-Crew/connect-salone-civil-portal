import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import {
  LogOut,
  Plus,
  Edit,
  Trash2,
  Save,
  Settings,
  Users,
  FileText,
  UserCheck,
} from "lucide-react";

export function AdminDashboard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [editingRepresentative, setEditingRepresentative] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"services" | "representatives">(
    "services",
  );
  const [formData, setFormData] = useState({
    name: "",
    agency: "",
    fee: "",
    processingTime: "",
    documents: "",
    eligibility: "",
    processSteps: "",
    locations: "",
    contacts: "",
    notes: "",
    lastVerified: "",
    region: "",
  });
  const [repFormData, setRepFormData] = useState({
    name: "",
    role: "",
    district: "",
    constituency: "",
    phone: "",
    email: "",
    title: "",
    ministry: "",
    office: "",
    officeAddress: "",
  });

  // Get services
  const services = useQuery(api.services.getAllServices);

  // Get representatives
  const representatives = useQuery(api.representatives.getAllRepresentatives);

  // Create/Update service mutation
  const saveServiceMutation = useMutation(api.services.createService);

  // Delete service mutation
  const deleteServiceMutation = useMutation(api.services.deleteService);

  // Create/Update representative mutation
  const saveRepresentativeMutation = useMutation(
    api.representatives.createRepresentative,
  );

  // Delete representative mutation
  const deleteRepresentativeMutation = useMutation(
    api.representatives.deleteRepresentative,
  );

  // Simple auth check (in production, use proper auth)
  useEffect(() => {
    const checkAuth = () => {
      // For demo purposes - in production use proper authentication
      const isAuthenticated =
        username === "admin" && password === "salonehub2025";
      setAuthenticated(isAuthenticated);
    };

    if (username && password) {
      checkAuth();
    }
  }, [username, password]);

  // Logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      setUsername("");
      setPassword("");
      setAuthenticated(false);
    }
  };

  // Edit service
  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name || "",
      agency: service.agency || "",
      fee: service.fee || "",
      processingTime: service.processingTime || "",
      documents: service.documents?.join(", ") || "",
      eligibility: service.eligibility || "",
      processSteps: service.processSteps?.join(", ") || "",
      locations: service.locations?.join(", ") || "",
      contacts: service.contacts || "",
      notes: service.notes || "",
      lastVerified: service.lastVerified || "",
      region: service.region || "",
    });
  };

  // Reset form
  const resetForm = () => {
    setEditingService(null);
    setFormData({
      name: "",
      agency: "",
      fee: "",
      processingTime: "",
      documents: "",
      eligibility: "",
      processSteps: "",
      locations: "",
      contacts: "",
      notes: "",
      lastVerified: "",
      region: "",
    });
  };

  // Edit representative
  const handleEditRepresentative = (representative: any) => {
    setEditingRepresentative(representative);
    setRepFormData({
      name: representative.name || "",
      role: representative.role || "",
      district: representative.district || "",
      constituency: representative.constituency || "",
      phone: representative.phone || "",
      email: representative.email || "",
      title: representative.title || "",
      ministry: representative.ministry || "",
      office: representative.office || "",
      officeAddress: representative.officeAddress || "",
    });
  };

  // Reset representative form
  const resetRepForm = () => {
    setEditingRepresentative(null);
    setRepFormData({
      name: "",
      role: "",
      district: "",
      constituency: "",
      phone: "",
      email: "",
      title: "",
      ministry: "",
      office: "",
      officeAddress: "",
    });
  };

  // Submit representative form
  const handleRepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveRepresentativeMutation.mutate(repFormData);
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const serviceData = {
      ...formData,
      documents: formData.documents
        .split(",")
        .map((d) => d.trim())
        .filter((d) => d),
      processSteps: formData.processSteps
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      locations: formData.locations
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l),
    };

    if (editingService) {
      saveServiceMutation.mutate({ ...serviceData, id: editingService._id });
    } else {
      saveServiceMutation.mutate(serviceData);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card card-hover p-8 max-w-md w-full"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Settings className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Admin Login</h2>
            <p className="text-muted-foreground">
              Access the admin control center
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="salonehub2025"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Sign in
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-2">
            Admin
          </p>
          <h1 className="text-4xl font-bold">Control Center</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg glass-hover text-red-400"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-gray-700">
        <button
          onClick={() => setActiveTab("services")}
          className={`pb-3 px-1 font-medium transition-colors ${
            activeTab === "services"
              ? "text-emerald-400 border-b-2 border-emerald-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <FileText size={18} className="inline mr-2" />
          Services
        </button>
        <button
          onClick={() => setActiveTab("representatives")}
          className={`pb-3 px-1 font-medium transition-colors ${
            activeTab === "representatives"
              ? "text-emerald-400 border-b-2 border-emerald-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <UserCheck size={18} className="inline mr-2" />
          Representatives
        </button>
      </div>

      {activeTab === "services" && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Service Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card card-hover p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText size={20} className="text-emerald-400" />
              {editingService ? "Edit Service" : "Create Service"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Service Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input"
                required
              />
              <input
                type="text"
                placeholder="Agency"
                value={formData.agency}
                onChange={(e) =>
                  setFormData({ ...formData, agency: e.target.value })
                }
                className="input"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Fee (NLe)"
                  value={formData.fee}
                  onChange={(e) =>
                    setFormData({ ...formData, fee: e.target.value })
                  }
                  className="input"
                  required
                />
                <input
                  type="text"
                  placeholder="Processing Time"
                  value={formData.processingTime}
                  onChange={(e) =>
                    setFormData({ ...formData, processingTime: e.target.value })
                  }
                  className="input"
                  required
                />
              </div>
              <textarea
                placeholder="Eligibility"
                value={formData.eligibility}
                onChange={(e) =>
                  setFormData({ ...formData, eligibility: e.target.value })
                }
                className="input"
                rows="2"
              />
              <textarea
                placeholder="Documents (comma separated)"
                value={formData.documents}
                onChange={(e) =>
                  setFormData({ ...formData, documents: e.target.value })
                }
                className="input"
                rows="3"
              />
              <textarea
                placeholder="Process Steps (comma separated)"
                value={formData.processSteps}
                onChange={(e) =>
                  setFormData({ ...formData, processSteps: e.target.value })
                }
                className="input"
                rows="3"
              />
              <textarea
                placeholder="Locations (comma separated)"
                value={formData.locations}
                onChange={(e) =>
                  setFormData({ ...formData, locations: e.target.value })
                }
                className="input"
                rows="2"
              />
              <input
                type="text"
                placeholder="Contacts"
                value={formData.contacts}
                onChange={(e) =>
                  setFormData({ ...formData, contacts: e.target.value })
                }
                className="input"
              />
              <textarea
                placeholder="Notes / corruption warnings"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="input"
                rows="2"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  placeholder="Last Verified"
                  value={formData.lastVerified}
                  onChange={(e) =>
                    setFormData({ ...formData, lastVerified: e.target.value })
                  }
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Region"
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {editingService ? "Update" : "Create"} Service
                </button>
                {editingService && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Services List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card card-hover p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users size={20} className="text-blue-400" />
              Services ({services?.length || 0})
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {services?.map((service) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-surface rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-bold">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {service.agency} · {service.region}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 rounded-lg glass-hover text-emerald-400"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this service?")) {
                          deleteServiceMutation.mutate(service._id);
                        }
                      }}
                      className="p-2 rounded-lg glass-hover text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === "representatives" && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Representative Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card card-hover p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <UserCheck size={20} className="text-purple-400" />
              {editingRepresentative ? "Edit Representative" : "Create Representative"}
            </h2>
            <form onSubmit={handleRepSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={repFormData.name}
                onChange={(e) =>
                  setRepFormData({ ...repFormData, name: e.target.value })
                }
                className="input"
                required
              />
              <input
                type="text"
                placeholder="Title/Position"
                value={repFormData.title}
                onChange={(e) =>
                  setRepFormData({ ...repFormData, title: e.target.value })
                }
                className="input"
              />
              <input
                type="text"
                placeholder="Role"
                value={repFormData.role}
                onChange={(e) =>
                  setRepFormData({ ...repFormData, role: e.target.value })
                }
                className="input"
              />
              <input
                type="text"
                placeholder="Ministry"
                value={repFormData.ministry}
                onChange={(e) =>
                  setRepFormData({ ...repFormData, ministry: e.target.value })
                }
                className="input"
              />
              <input
                type="text"
                placeholder="District"
                value={repFormData.district}
                onChange={(e) =>
                  setRepFormData({ ...repFormData, district: e.target.value })
                }
                className="input"
                required
              />
              <input
                type="text"
                placeholder="Constituency"
                value={repFormData.constituency}
                onChange={(e) =>
                  setRepFormData({ ...repFormData, constituency: e.target.value })
                }
                className="input"
              />
              <input
                type="text"
                placeholder="Office"
                value={repFormData.office}
                onChange={(e) =>
                  setRepFormData({ ...repFormData, office: e.target.value })
                }
                className="input"
              />
              <input
                type="text"
                placeholder="Office Address"
                value={repFormData.officeAddress}
                onChange={(e) =>
                  setRepFormData({ ...repFormData, officeAddress: e.target.value })
                }
                className="input"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={repFormData.phone}
                onChange={(e) =>
                  setRepFormData({ ...repFormData, phone: e.target.value })
                }
                className="input"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={repFormData.email}
                onChange={(e) =>
                  setRepFormData({ ...repFormData, email: e.target.value })
                }
                className="input"
                required
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {editingRepresentative ? "Update" : "Create"} Representative
                </button>
                {editingRepresentative && (
                  <button
                    type="button"
                    onClick={resetRepForm}
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Representatives List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card card-hover p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <UserCheck size={20} className="text-purple-400" />
              Representatives ({representatives?.length || 0})
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {representatives?.map((representative) => (
                <motion.div
                  key={representative._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-surface rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-bold">{representative.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {representative.title || representative.role} · {representative.district}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {representative.phone} · {representative.email}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditRepresentative(representative)}
                      className="p-2 rounded-lg glass-hover text-emerald-400"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this representative?")) {
                          deleteRepresentativeMutation.mutate(representative._id);
                        }
                      }}
                      className="p-2 rounded-lg glass-hover text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
            <textarea
              placeholder="Eligibility"
              value={formData.eligibility}
              onChange={(e) =>
                setFormData({ ...formData, eligibility: e.target.value })
              }
              className="input"
              rows="2"
            />
            <textarea
              placeholder="Documents (comma separated)"
              value={formData.documents}
              onChange={(e) =>
                setFormData({ ...formData, documents: e.target.value })
              }
              className="input"
              rows="3"
            />
            <textarea
              placeholder="Process Steps (comma separated)"
              value={formData.processSteps}
              onChange={(e) =>
                setFormData({ ...formData, processSteps: e.target.value })
              }
              className="input"
              rows="3"
            />
            <textarea
              placeholder="Locations (comma separated)"
              value={formData.locations}
              onChange={(e) =>
                setFormData({ ...formData, locations: e.target.value })
              }
              className="input"
              rows="2"
            />
            <input
              type="text"
              placeholder="Contacts"
              value={formData.contacts}
              onChange={(e) =>
                setFormData({ ...formData, contacts: e.target.value })
              }
              className="input"
            />
            <textarea
              placeholder="Notes / corruption warnings"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="input"
              rows="2"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                placeholder="Last Verified"
                value={formData.lastVerified}
                onChange={(e) =>
                  setFormData({ ...formData, lastVerified: e.target.value })
                }
                className="input"
              />
              <input
                type="text"
                placeholder="Region"
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value })
                }
                className="input"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {editingService ? "Update" : "Create"} Service
              </button>
              {editingService && (
                <button type="button" onClick={resetForm} className="btn-ghost">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Services List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card card-hover p-6"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users size={20} className="text-blue-400" />
            Services ({services?.length || 0})
          </h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {services?.map((service) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-surface rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-bold">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {service.agency} · {service.region}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 rounded-lg glass-hover text-emerald-400"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this service?")) {
                        deleteServiceMutation.mutate(service._id);
                      }
                    }}
                    className="p-2 rounded-lg glass-hover text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
