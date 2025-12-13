import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, FileText, MapPin, Phone, AlertTriangle, Printer } from 'lucide-react'
import { api } from '../api/api'
import { useSearchParams } from 'react-router-dom'

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [agency, setAgency] = useState('')
  const [region, setRegion] = useState('')
  const [selectedService, setSelectedService] = useState(null)

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services', search, agency, region],
    queryFn: () => api.getServices({ search, agency, region }),
  })

  const agencies = [...new Set(services.map(s => s.agency))].sort()

  const openModal = (service) => {
    setSelectedService(service)
  }

  const closeModal = () => {
    setSelectedService(null)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="text-accent font-bold text-sm uppercase tracking-wider mb-2">Directory</p>
        <h1 className="text-4xl font-bold mb-4">Government Services</h1>
        <p className="text-gray-400">Search verified fees, documents, and contacts. Updated with corruption warnings.</p>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search service or keyword"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <select
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
            className="px-4 py-3 rounded-xl glass text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">All Agencies</option>
            {agencies.map(a => (
              <option key={a} value={a} className="bg-slate-800">{a}</option>
            ))}
          </select>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="px-4 py-3 rounded-xl glass text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">All Regions</option>
            <option value="Freetown" className="bg-slate-800">Freetown</option>
            <option value="Bo" className="bg-slate-800">Bo</option>
            <option value="Kenema" className="bg-slate-800">Kenema</option>
            <option value="Makeni" className="bg-slate-800">Makeni</option>
          </select>
        </div>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">No services found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass rounded-2xl p-6 cursor-pointer group"
              onClick={() => openModal(service)}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold">
                  Service
                </span>
                <span className="text-xs text-gray-400">{service.region}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{service.name}</h3>
              <p className="text-gray-400 text-sm mb-4">Agency: {service.agency}</p>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <span className="text-gray-400">Fee:</span>
                  <p className="font-semibold">{service.fee}</p>
                </div>
                <div>
                  <span className="text-gray-400">Time:</span>
                  <p className="font-semibold">{service.processing_time}</p>
                </div>
              </div>
              <button className="w-full py-2 rounded-lg bg-gradient-to-r from-accent to-accent-light text-slate-900 font-bold hover:shadow-lg transition-all">
                View details →
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <p className="text-accent text-sm uppercase tracking-wider mb-2">SERVICE</p>
                  <h2 className="text-3xl font-bold mb-2">{selectedService.name}</h2>
                  <p className="text-gray-400">
                    Agency: {selectedService.agency} | Verified: {selectedService.last_verified || 'N/A'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrint}
                    className="p-3 rounded-lg glass-hover text-white hover:text-accent transition-colors"
                    title="Print Checklist"
                  >
                    <Printer size={24} />
                  </button>
                  <button
                    onClick={closeModal}
                    className="p-3 rounded-lg glass-hover text-white hover:text-accent transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="glass rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Fee</p>
                  <p className="text-xl font-bold">{selectedService.fee}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Processing Time</p>
                  <p className="text-xl font-bold">{selectedService.processing_time}</p>
                </div>
              </div>

              {selectedService.documents && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={20} className="text-accent" />
                    <h3 className="font-bold">Documents Required</h3>
                  </div>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {selectedService.documents.split(',').map((doc, i) => (
                      <li key={i}>{doc.trim()}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedService.locations && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={20} className="text-accent" />
                    <h3 className="font-bold">Locations</h3>
                  </div>
                  <p className="text-gray-300">{selectedService.locations}</p>
                </div>
              )}

              {selectedService.contacts && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Phone size={20} className="text-accent" />
                    <h3 className="font-bold">Contacts</h3>
                  </div>
                  <p className="text-gray-300">{selectedService.contacts}</p>
                </div>
              )}

              {selectedService.notes && (
                <div className="glass rounded-xl p-4 border border-yellow-500/50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={20} className="text-yellow-400" />
                    <h3 className="font-bold text-yellow-400">Important Notes</h3>
                  </div>
                  <p className="text-gray-300">{selectedService.notes}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

