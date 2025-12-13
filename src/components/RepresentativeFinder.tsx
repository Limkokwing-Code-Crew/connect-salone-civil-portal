import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { Search, Phone, Mail, MapPin, Users, Building } from "lucide-react";

export function RepresentativeFinder() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const representatives = useQuery(api.representatives.searchRepresentatives, {
    searchTerm: searchTerm || undefined,
    district: selectedDistrict || undefined,
    role: selectedRole || undefined,
  });

  const districts = useQuery(api.representatives.getDistricts);
  const roles = useQuery(api.representatives.getRoles);

  if (
    !representatives?.length &&
    !searchTerm &&
    !selectedDistrict &&
    !selectedRole
  ) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card card-hover p-8 text-center"
      >
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-2xl font-bold tracking-tight mb-2">
          Representative Finder
        </h3>
        <p className="text-muted-foreground mb-6">
          Find government officials and representatives across Sierra Leone.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full glass text-sm">
            <Users size={16} className="text-blue-400" />
            <span>20+ Officials</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full glass text-sm">
            <MapPin size={16} className="text-green-400" />
            <span>All Districts</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Loading representatives from database...
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card card-hover p-6"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name (e.g., Mohamed Bangura)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-12"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="select"
            >
              <option value="">All Districts</option>
              {districts?.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="select"
            >
              <option value="">All Roles</option>
              {roles?.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Representatives List */}
      {representatives?.length === 0 &&
      (searchTerm || selectedDistrict || selectedRole) ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card card-hover p-8 text-center"
        >
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold tracking-tight mb-2">
            No Representatives Found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {representatives?.map((rep, index) => (
            <motion.div
              key={rep._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card card-hover p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-600 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white font-bold text-xl">
                    {rep.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold tracking-tight mb-1">
                    {rep.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="pill bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs">
                      {rep.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    <span>{rep.district}</span>
                  </div>
                  {rep.constituency && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building size={14} />
                      <span>{rep.constituency}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {rep.phone && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <Phone size={16} className="text-green-400" />
                    <a
                      href={`tel:${rep.phone}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {rep.phone}
                    </a>
                  </motion.div>
                )}

                {rep.email && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <Mail size={16} className="text-blue-400" />
                    <a
                      href={`mailto:${rep.email}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {rep.email}
                    </a>
                  </motion.div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-white/20 dark:border-white/10">
                <div className="flex gap-2">
                  <button className="btn-ghost flex-1 text-sm">
                    <Phone size={14} className="mr-1" />
                    Call
                  </button>
                  <button className="btn-ghost flex-1 text-sm">
                    <Mail size={14} className="mr-1" />
                    Email
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
