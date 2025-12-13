import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, Check, Zap } from 'lucide-react'
import { useState } from 'react'

const featuredServices = [
  { name: 'Voter Registration', agency: 'ECSL', fee: 'NLe 0', time: '2 days', region: 'Freetown', desc: 'Register safely without middlemen.' },
  { name: 'National ID (NIN)', agency: 'NCRA', fee: 'NLe 120', time: '5 days', region: 'Bo', desc: 'Bring birth certificate or affidavit.' },
  { name: 'Business Registration', agency: 'CAC', fee: 'NLe 450', time: '7 days', region: 'Freetown', desc: 'Single window processing.' },
  { name: 'Passport Renewal', agency: 'Immigration', fee: 'NLe 850', time: '10 days', region: 'Freetown + Regions', desc: 'Avoid unofficial fees.' },
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      window.location.href = `/services?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full glass text-accent text-sm font-bold mb-6"
          >
            Premium Civic Portal
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Find Government Services
            <br />
            <span className="text-accent">in 3 Clicks</span>
          </h1>

          <p className="text-xl text-gray-400 mb-8">
            Passport · Driver's License · NIN · Business Registration
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                className="w-full pl-12 pr-4 py-4 rounded-xl glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <Link
              to="/services"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-accent to-accent-light text-slate-900 font-bold hover:shadow-2xl hover:shadow-accent/50 transition-all"
            >
              Browse Services →
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm">
              <Check size={16} className="text-green-400" />
              <span>Verified data</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm">
              <Zap size={16} className="text-yellow-400" />
              <span>Lightning navigation</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Services */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-accent font-bold text-sm uppercase tracking-wider mb-2">Featured</p>
          <h2 className="text-4xl font-bold mb-4">Priority Government Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass rounded-2xl p-6 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold">
                  Fast Track
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{service.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{service.desc}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Agency:</span>
                  <span className="font-semibold">{service.agency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee:</span>
                  <span className="font-semibold">{service.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span className="font-semibold">{service.time}</span>
                </div>
              </div>
              <Link
                to="/services"
                className="mt-4 block text-center py-2 rounded-lg glass-hover text-accent font-semibold"
              >
                View details →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

