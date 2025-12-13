import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { LogOut, Plus, Edit, Trash2, Save } from 'lucide-react'
import { api } from '../api/api'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    name: '', agency: '', fee: '', processing_time: '', documents: '',
    eligibility: '', process_steps: '', locations: '', contacts: '', notes: '',
    last_verified: '', region: ''
  })

  // Check auth status
  const { data: authData } = useQuery({
    queryKey: ['auth'],
    queryFn: api.checkAuth,
  })

  useEffect(() => {
    if (authData?.authenticated) {
      setAuthenticated(true)
    }
  }, [authData])

  // Get services
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.getServices(),
    enabled: authenticated,
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: () => api.login(username, password),
    onSuccess: (data) => {
      if (data.success) {
        setAuthenticated(true)
        queryClient.invalidateQueries(['auth'])
      }
    },
  })

  // Create/Update service mutation
  const saveServiceMutation = useMutation({
    mutationFn: (service) => editingService
      ? api.updateService(editingService.id, service)
      : api.createService(service),
    onSuccess: () => {
      queryClient.invalidateQueries(['services'])
      setEditingService(null)
      setFormData({
        name: '', agency: '', fee: '', processing_time: '', documents: '',
        eligibility: '', process_steps: '', locations: '', contacts: '', notes: '',
        last_verified: '', region: ''
      })
    },
  })

  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: api.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries(['services'])
    },
  })

  // Logout
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await api.logout()
      setAuthenticated(false)
      queryClient.invalidateQueries(['auth'])
    }
  }

  // Edit service
  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({
      name: service.name || '',
      agency: service.agency || '',
      fee: service.fee || '',
      processing_time: service.processing_time || '',
      documents: service.documents || '',
      eligibility: service.eligibility || '',
      process_steps: service.process_steps || '',
      locations: service.locations || '',
      contacts: service.contacts || '',
      notes: service.notes || '',
      last_verified: service.last_verified || '',
      region: service.region || '',
    })
  }

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault()
    saveServiceMutation.mutate(formData)
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-8 max-w-md w-full"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <form onSubmit={(e) => { e.preventDefault(); loginMutation.mutate(); }} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="salonehub2025"
                required
              />
            </div>
            {loginMutation.isError && (
              <p className="text-red-400 text-sm">Invalid credentials</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-accent to-accent-light text-slate-900 font-bold hover:shadow-lg transition-all"
            >
              Sign in
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-accent font-bold text-sm uppercase tracking-wider mb-2">Admin</p>
          <h1 className="text-4xl font-bold">Control Center</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg glass-hover text-red-400 hover:text-red-300"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Service Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold mb-4">
            {editingService ? 'Edit Service' : 'Create Service'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Service Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
            <input
              type="text"
              placeholder="Agency"
              value={formData.agency}
              onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Fee (NLe)"
                value={formData.fee}
                onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                className="px-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
              <input
                type="text"
                placeholder="Processing Time"
                value={formData.processing_time}
                onChange={(e) => setFormData({ ...formData, processing_time: e.target.value })}
                className="px-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <textarea
              placeholder="Documents (comma separated)"
              value={formData.documents}
              onChange={(e) => setFormData({ ...formData, documents: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              rows="3"
            />
            <textarea
              placeholder="Locations (comma separated)"
              value={formData.locations}
              onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              rows="2"
            />
            <textarea
              placeholder="Contacts"
              value={formData.contacts}
              onChange={(e) => setFormData({ ...formData, contacts: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              rows="2"
            />
            <textarea
              placeholder="Notes / corruption warnings"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              rows="2"
            />
            <div className="flex items-center gap-4">
              <input
                type="date"
                placeholder="Last Verified"
                value={formData.last_verified}
                onChange={(e) => setFormData({ ...formData, last_verified: e.target.value })}
                className="px-4 py-3 rounded-xl glass text-white focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                type="text"
                placeholder="Region"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="flex-1 px-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-light text-slate-900 font-bold hover:shadow-lg transition-all"
              >
                <Save size={18} />
                {editingService ? 'Update' : 'Create'} Service
              </button>
              {editingService && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null)
                    setFormData({
                      name: '', agency: '', fee: '', processing_time: '', documents: '',
                      eligibility: '', process_steps: '', locations: '', contacts: '', notes: '',
                      last_verified: '', region: ''
                    })
                  }}
                  className="px-4 py-3 rounded-xl glass-hover text-gray-300"
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
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold mb-4">Services ({services.length})</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {services.map((service) => (
              <div
                key={service.id}
                className="glass rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-bold">{service.name}</h3>
                  <p className="text-sm text-gray-400">{service.agency} · {service.region}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 rounded-lg glass-hover text-accent hover:bg-accent/20"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this service?')) {
                        deleteServiceMutation.mutate(service.id)
                      }
                    }}
                    className="p-2 rounded-lg glass-hover text-red-400 hover:bg-red-400/20"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

