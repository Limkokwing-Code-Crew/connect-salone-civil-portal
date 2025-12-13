const API_BASE = '/api'

export const api = {
  // Services
  getServices: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString()
      const res = await fetch(`${API_BASE}/services.php?${query}`)
      const data = await res.json()
      return data.success ? data.data : []
    } catch (error) {
      console.log('Backend not available, using fallback data')
      // Fallback data for demo purposes
      return [
        {
          id: 1,
          name: "Voter Registration",
          agency: "ECSL",
          fee: "NLe 0",
          processing_time: "2 days",
          documents: "Birth Certificate, National ID, Passport Photo",
          eligibility: "Sierra Leone citizen, 18 years or older",
          process_steps: "1. Visit ECSL office 2. Submit documents 3. Receive voter card",
          locations: "Freetown, Bo, Kenema, Makeni",
          contacts: "+232 22 123456, info@ecsl.gov.sl",
          notes: "Avoid middlemen - registration is free",
          last_verified: "2024-01-15",
          region: "Freetown"
        },
        {
          id: 2,
          name: "National ID (NIN)",
          agency: "NCRA",
          fee: "NLe 120",
          processing_time: "5 days",
          documents: "Birth Certificate, Affidavit if no birth certificate, Passport photos",
          eligibility: "All Sierra Leone citizens",
          process_steps: "1. Complete application form 2. Submit documents 3. Biometric capture 4. Receive NIN card",
          locations: "All district offices",
          contacts: "+232 22 789012, support@ncra.gov.sl",
          notes: "Bring original documents for verification",
          last_verified: "2024-01-10",
          region: "Bo"
        },
        {
          id: 3,
          name: "Business Registration",
          agency: "CAC",
          fee: "NLe 450",
          processing_time: "7 days",
          documents: "Business name, Owner ID, Tax identification, Business address",
          eligibility: "Individuals and companies",
          process_steps: "1. Name search 2. Form completion 3. Document submission 4. Payment 5. Certificate issuance",
          locations: "Freetown office, Regional business centers",
          contacts: "+232 33 456789, business@cac.gov.sl",
          notes: "Single window processing available",
          last_verified: "2024-01-12",
          region: "Freetown"
        },
        {
          id: 4,
          name: "Passport Renewal",
          agency: "Immigration",
          fee: "NLe 850",
          processing_time: "10 days",
          documents: "Current passport, Application form, Passport photos, Birth certificate",
          eligibility: "Sierra Leone citizens with expired/expiring passports",
          process_steps: "1. Online application 2. Document submission 3. Biometric capture 4. Payment 5. Collection",
          locations: "Freetown Immigration HQ, Regional offices",
          contacts: "+232 22 345678, passport@immigration.gov.sl",
          notes: "Avoid unofficial fees - only pay at government offices",
          last_verified: "2024-01-08",
          region: "Freetown"
        }
      ]
    }
  },

  createService: async (service) => {
    const res = await fetch(`${API_BASE}/services.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    })
    return res.json()
  },

  updateService: async (id, service) => {
    const res = await fetch(`${API_BASE}/services.php?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    })
    return res.json()
  },

  deleteService: async (id) => {
    const res = await fetch(`${API_BASE}/services.php?id=${id}`, {
      method: 'DELETE',
    })
    return res.json()
  },

// Representatives
  getRepresentatives: async (district = '') => {
    try {
      const query = district ? `?district=${encodeURIComponent(district)}` : ''
      const res = await fetch(`${API_BASE}/reps.php${query}`)
      const data = await res.json()
      return data.success ? data : { data: [], districts: [] }
    } catch (error) {
      console.log('Backend not available, using fallback data')
      const reps = [
        { id: 1, name: "Hon. John Kamara", role: "Member of Parliament", district: "Freetown", constituency: "Central", phone: "+232 76 123456", email: "jkamara@parliament.sl" },
        { id: 2, name: "Hon. Mary Conteh", role: "Member of Parliament", district: "Freetown", constituency: "East", phone: "+232 76 234567", email: "mconteh@parliament.sl" },
        { id: 3, name: "Hon. James Bundu", role: "Member of Parliament", district: "Bo", constituency: "North", phone: "+232 76 345678", email: "jbundu@parliament.sl" },
        { id: 4, name: "Hon. Aminata Turay", role: "Local Councilor", district: "Kenema", constituency: "Town", phone: "+232 76 456789", email: "aturay@kenema.gov.sl" },
        { id: 5, name: "Hon. Mohamed Koroma", role: "Mayor", district: "Makeni", constituency: "City", phone: "+232 76 567890", email: "mkoroma@makeni.gov.sl" }
      ]
      return { data: district ? reps.filter(r => r.district === district) : reps, districts: ["Freetown", "Bo", "Kenema", "Makeni"] }
    }
  },

  // Auth
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    return res.json()
  },

  checkAuth: async () => {
    const res = await fetch(`${API_BASE}/auth.php`)
    return res.json()
  },

  logout: async () => {
    const res = await fetch(`${API_BASE}/auth.php`, {
      method: 'DELETE',
    })
    return res.json()
  },
}

