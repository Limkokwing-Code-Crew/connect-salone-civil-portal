import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Modal } from "@/components/Modal";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  AlertTriangle,
  Check,
} from "lucide-react";

const REGIONS = [
  "Freetown",
  "Bo",
  "Kenema",
  "Makeni",
  "Port Loko",
  "Kono",
  "Bombali",
  "Tonkolili",
  "Kailahun",
  "Bonthe",
  "Pujehun",
  "Kambia",
  "Moyamba",
  "Karene",
] as const;

function matchesRegion(locations: string[], region: string) {
  const joined = locations.join(" ").toLowerCase();
  return joined.includes(region.toLowerCase());
}

export function ServiceDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgency, setSelectedAgency] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  );

  const services = useQuery(api.services.searchServices, {
    searchTerm: searchTerm || undefined,
    agency: selectedAgency || undefined,
    region: selectedRegion || undefined,
  });

  const agencies = useQuery(api.services.getAgencies);
  const regions = useQuery(api.services.getRegions);

  const filtered = useMemo(() => {
    const list = services ?? [];
    if (!selectedRegion) return list;
    return list.filter(
      (s) => s.locations && matchesRegion(s.locations, selectedRegion),
    );
  }, [services, selectedRegion]);

  const selectedService = useMemo(() => {
    if (!selectedServiceId) return null;
    return (services ?? []).find((s) => s._id === selectedServiceId) ?? null;
  }, [services, selectedServiceId]);

  const handlePrint = () => {
    window.print();
  };

  if (!services?.length && !searchTerm && !selectedAgency && !selectedRegion) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card card-hover p-8 text-center"
      >
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-2xl font-bold tracking-tight mb-2">
          Service Directory
        </h3>
        <p className="text-muted-foreground mb-6">
          Browse verified government services, fees, and requirements.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full glass text-sm">
            <Check size={16} className="text-green-400" />
            <span>Verified data</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full glass text-sm">
            <Clock size={16} className="text-yellow-400" />
            <span>Real-time updates</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Loading services from database...
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
              placeholder="Search services (e.g., passport, driver's license)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-12"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
              className="select"
            >
              <option value="">All Agencies</option>
              {agencies?.map((agency) => (
                <option key={agency} value={agency}>
                  {agency}
                </option>
              ))}
            </select>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="select"
            >
              <option value="">All Regions</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Services Grid */}
      {filtered.length === 0 &&
      (searchTerm || selectedAgency || selectedRegion) ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card card-hover p-8 text-center"
        >
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold tracking-tight mb-2">
            No Services Found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card card-hover p-6 cursor-pointer"
              onClick={() => setSelectedServiceId(service._id)}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="pill bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30">
                  Fast Track
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin size={12} />
                  {service.locations
                    ? (REGIONS.find((r) =>
                        matchesRegion(service.locations, r),
                      ) ?? "Nationwide")
                    : "Nationwide"}
                </span>
              </div>

              <h3 className="text-lg font-bold tracking-tight mb-2 line-clamp-2">
                {service.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {service.agency}
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Fee:</span>
                    <p className="font-semibold line-clamp-1">{service.fee}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Time:</span>
                    <p className="font-semibold line-clamp-1">
                      {service.processingTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="btn-primary w-full justify-center">
                View details →
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        open={!!selectedService}
        onOpenChange={(open) => {
          if (!open) setSelectedServiceId(null);
        }}
        title={selectedService?.name ?? "Service details"}
        description={
          selectedService
            ? `${selectedService.agency} • ${selectedService.region}`
            : undefined
        }
        className="max-w-4xl"
      >
        {selectedService ? (
          <div className="space-y-5">
            <div className="flex gap-2">
              <button type="button" className="btn-ghost" onClick={handlePrint}>
                Print checklist
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-surface rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <DollarSign size={16} />
                  <span>Official Fee</span>
                </div>
                <div className="mt-1 text-xl font-bold text-emerald-400">
                  {selectedService.fee}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-surface rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Clock size={16} />
                  <span>Processing Time</span>
                </div>
                <div className="mt-1 text-xl font-bold text-blue-400">
                  {selectedService.processingTime}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-surface rounded-2xl p-4"
            >
              <div className="font-semibold mb-3 flex items-center gap-2">
                <Check size={18} className="text-green-400" />
                Eligibility
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedService.eligibility}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-surface rounded-2xl p-4"
            >
              <div className="font-semibold mb-3 flex items-center gap-2">
                <Check size={18} className="text-blue-400" />
                Required Documents
              </div>
              <ul className="mt-2 space-y-2">
                {selectedService.documents?.map((doc, i) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground flex items-start"
                  >
                    <span className="text-primary mr-2">•</span>
                    {doc}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-surface rounded-2xl p-4"
            >
              <div className="font-semibold mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-orange-400" />
                Office Locations
              </div>
              <ul className="mt-2 space-y-1">
                {selectedService.locations?.map((loc, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    📍 {loc}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-surface rounded-2xl p-4"
            >
              <div className="font-semibold mb-3 flex items-center gap-2">
                <Phone size={18} className="text-purple-400" />
                Contact Information
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                <a
                  className="text-primary hover:underline flex items-center gap-2"
                  href={`tel:${selectedService.contacts}`}
                >
                  <Phone size={14} />
                  {selectedService.contacts}
                </a>
              </div>
            </motion.div>

            {selectedService.notes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-4"
              >
                <div className="font-semibold text-yellow-200 mb-2 flex items-center gap-2">
                  <AlertTriangle size={18} />
                  Important Notice
                </div>
                <p className="mt-1 text-sm text-yellow-100/90">
                  {selectedService.notes}
                </p>
              </motion.div>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
