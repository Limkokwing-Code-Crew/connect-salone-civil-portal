import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'
import { api } from '../api/api'

export default function Representatives() {
  const [district, setDistrict] = useState('')

  const { data: { data: reps = [], districts: districtList = [] } = {}, isLoading } = useQuery({
    queryKey: ['representatives', district],
    queryFn: () => api.getRepresentatives(district),
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="text-accent font-bold text-sm uppercase tracking-wider mb-2">Representatives</p>
        <h1 className="text-4xl font-bold mb-4">Find your MP or Local Council</h1>
        <p className="text-gray-400">Filter by district and contact them directly.</p>
      </div>

      {/* District Filter */}
      <div className="glass rounded-2xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl glass text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">All Districts</option>
            {districtList.map(d => (
              <option key={d} value={d} className="bg-slate-800">{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Representatives Grid */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : reps.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">No representatives found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reps.map((rep) => (
            <motion.div
              key={rep.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                  {rep.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div className="flex-1">
                  <span className="text-accent text-xs font-bold uppercase">{rep.district}</span>
                  <h3 className="text-xl font-bold mt-1">{rep.name}</h3>
                  <p className="text-gray-400 text-sm">{rep.role} · {rep.constituency}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {rep.phone && (
                  <a
                    href={`tel:${rep.phone}`}
                    className="flex items-center gap-3 p-3 rounded-lg glass-hover text-gray-300 hover:text-accent transition-colors"
                  >
                    <Phone size={18} />
                    <span>{rep.phone}</span>
                  </a>
                )}
                {rep.email && (
                  <a
                    href={`mailto:${rep.email}`}
                    className="flex items-center gap-3 p-3 rounded-lg glass-hover text-gray-300 hover:text-accent transition-colors"
                  >
                    <Mail size={18} />
                    <span className="text-sm">{rep.email}</span>
                  </a>
                )}
              </div>

              {rep.email && (
                <a
                  href={`mailto:${rep.email}`}
                  className="block w-full py-2 rounded-lg bg-gradient-to-r from-accent to-accent-light text-slate-900 font-bold text-center hover:shadow-lg transition-all"
                >
                  Contact Representative →
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

