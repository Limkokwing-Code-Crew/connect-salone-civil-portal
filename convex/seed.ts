import { mutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const seed = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!admin) throw new ConvexError("Unauthorized: Admin only");

    // Check if data already exists
    const existingServices = await ctx.db.query("services").first();
    if (existingServices) {
      return { message: "Data already seeded" };
    }

    // Seed services
    const services = [
      {
        name: "Voter Registration",
        agency: "ECSL",
        fee: "NLe 0",
        processingTime: "2 days",
        documents: ["National ID", "Birth certificate"],
        eligibility: "18+ Sierra Leonean citizen",
        processSteps: [
          "Visit ECSL center",
          "Capture biometrics",
          "Receive slip",
        ],
        locations: ["Freetown", "Bo", "Kenema", "Makeni"],
        contacts: "info@ec.gov.sl / 076-000-000",
        notes: "Beware of middlemen; registration is free",
        lastVerified: "2024-12-01",
        region: "Freetown",
      },
      {
        name: "National ID (NIN)",
        agency: "NCRA",
        fee: "NLe 120",
        processingTime: "5 days",
        documents: ["Birth certificate", "Proof of residence"],
        eligibility: "Citizens and legal residents",
        processSteps: ["Fill NCRA form", "Biometrics", "Pickup ID"],
        locations: ["Freetown", "Bo", "Kenema", "Makeni"],
        contacts: "support@ncra.gov.sl / 078-111-111",
        notes: "Pay only official receipt at NCRA desk",
        lastVerified: "2024-12-02",
        region: "Bo",
      },
      {
        name: "Business Registration",
        agency: "CAC",
        fee: "NLe 450",
        processingTime: "7 days",
        documents: ["Name search", "ID", "Tax ID"],
        eligibility: "18+ applicants",
        processSteps: [
          "Name search",
          "Submit forms",
          "Pay fees",
          "Certificate",
        ],
        locations: ["Freetown"],
        contacts: "info@cac.gov.sl / 079-222-222",
        notes: "Use CAC cash office only; avoid agents",
        lastVerified: "2024-12-03",
        region: "Freetown",
      },
      {
        name: "Driver's License",
        agency: "SLRSA",
        fee: "NLe 350",
        processingTime: "10 days",
        documents: ["Learner permit", "Medical certificate"],
        eligibility: "Passed driving test",
        processSteps: ["Apply", "Test", "Pay", "Collect license"],
        locations: ["Freetown", "Bo"],
        contacts: "help@slrsa.gov.sl / 077-333-333",
        notes: "Testing centers only; no roadside payments",
        lastVerified: "2024-12-04",
        region: "Bo",
      },
      {
        name: "Passport Renewal",
        agency: "Immigration",
        fee: "NLe 850",
        processingTime: "10 days",
        documents: ["Old passport", "ID", "Payment receipt"],
        eligibility: "Existing passport holders",
        processSteps: ["Book appointment", "Biometrics", "Collect passport"],
        locations: ["Freetown", "Makeni"],
        contacts: "contact@immigration.gov.sl / 079-444-444",
        notes: 'Do not pay extra for "express" outside office',
        lastVerified: "2024-12-05",
        region: "Makeni",
      },
      {
        name: "Birth Certificate",
        agency: "NCRA",
        fee: "NLe 80",
        processingTime: "3 days",
        documents: ["Hospital letter", "Parents ID"],
        eligibility: "Newborns and adults",
        processSteps: ["Submit documents", "Pay", "Collect certificate"],
        locations: ["Freetown", "Kenema"],
        contacts: "support@ncra.gov.sl / 078-111-111",
        notes: "Fees are fixed; insist on receipt",
        lastVerified: "2024-12-06",
        region: "Kenema",
      },
      {
        name: "Tax Identification",
        agency: "NRA",
        fee: "NLe 0",
        processingTime: "2 days",
        documents: ["National ID", "Proof of address"],
        eligibility: "Individuals and businesses",
        processSteps: ["Fill TIN form", "Submit", "Receive TIN"],
        locations: ["Freetown"],
        contacts: "tin@nra.gov.sl / 076-555-555",
        notes: "TIN is free; report unofficial charges",
        lastVerified: "2024-12-07",
        region: "Freetown",
      },
      {
        name: "Customs Clearance",
        agency: "NRA Customs",
        fee: "Varies",
        processingTime: "4 days",
        documents: ["Bill of lading", "Invoice", "ID"],
        eligibility: "Importers/exporters",
        processSteps: ["Pre-clearance", "Duties", "Inspection", "Release"],
        locations: ["Queen Elizabeth II Quay"],
        contacts: "customs@nra.gov.sl / 030-666-666",
        notes: "Use official tariffs; avoid cash to agents",
        lastVerified: "2024-12-08",
        region: "Freetown",
      },
      {
        name: "Fisheries License",
        agency: "MFMR",
        fee: "NLe 600",
        processingTime: "6 days",
        documents: ["Boat registration", "ID"],
        eligibility: "Fishing operators",
        processSteps: ["Apply", "Inspection", "Pay", "Permit"],
        locations: ["Tombo", "Goderich"],
        contacts: "permits@mfmr.gov.sl / 033-777-777",
        notes: "Verify permit hologram; no beach payments",
        lastVerified: "2024-12-09",
        region: "Freetown",
      },
      {
        name: "Tourism Permit",
        agency: "NTB",
        fee: "NLe 300",
        processingTime: "5 days",
        documents: ["Business registration", "ID"],
        eligibility: "Tour operators/hospitality",
        processSteps: ["Submit dossier", "Pay", "Site review", "Permit"],
        locations: ["Freetown"],
        contacts: "info@tourism.gov.sl / 031-888-888",
        notes: "Official receipts only; inspections are scheduled",
        lastVerified: "2024-12-10",
        region: "Freetown",
      },
    ];

    for (const service of services) {
      await ctx.db.insert("services", service);
    }

    // Seed representatives
    const representatives = [
      {
        name: "Hon. Mohamed Bangura",
        role: "Member of Parliament",
        district: "Freetown",
        constituency: "Constituency 001",
        phone: "076000101",
        email: "m.bangura@parliament.sl",
      },
      {
        name: "Hon. Fatmata Sesay",
        role: "Member of Parliament",
        district: "Bo",
        constituency: "Constituency 025",
        phone: "076000102",
        email: "f.sesay@parliament.sl",
      },
      {
        name: "Hon. Sahr Kamara",
        role: "Member of Parliament",
        district: "Kenema",
        constituency: "Constituency 040",
        phone: "076000103",
        email: "s.kamara@parliament.sl",
      },
      {
        name: "Hon. Aminata Conteh",
        role: "Member of Parliament",
        district: "Makeni",
        constituency: "Constituency 055",
        phone: "076000104",
        email: "a.conteh@parliament.sl",
      },
      {
        name: "Councillor James Koroma",
        role: "Local Council",
        district: "Freetown",
        constituency: "Ward 002",
        phone: "076000105",
        email: "j.koroma@council.sl",
      },
      {
        name: "Councillor Mary Kallon",
        role: "Local Council",
        district: "Bo",
        constituency: "Ward 018",
        phone: "076000106",
        email: "m.kallon@council.sl",
      },
      {
        name: "Councillor Josephine Pratt",
        role: "Local Council",
        district: "Kenema",
        constituency: "Ward 030",
        phone: "076000107",
        email: "j.pratt@council.sl",
      },
      {
        name: "Councillor Abdul Turay",
        role: "Local Council",
        district: "Makeni",
        constituency: "Ward 045",
        phone: "076000108",
        email: "a.turay@council.sl",
      },
      {
        name: "Hon. Idrissa Jalloh",
        role: "Member of Parliament",
        district: "Port Loko",
        constituency: "Constituency 060",
        phone: "076000109",
        email: "i.jalloh@parliament.sl",
      },
      {
        name: "Hon. Hawa Mansaray",
        role: "Member of Parliament",
        district: "Kono",
        constituency: "Constituency 070",
        phone: "076000110",
        email: "h.mansaray@parliament.sl",
      },
      {
        name: "Hon. Peter Samura",
        role: "Member of Parliament",
        district: "Tonkolili",
        constituency: "Constituency 080",
        phone: "076000111",
        email: "p.samura@parliament.sl",
      },
      {
        name: "Hon. Mariama Bah",
        role: "Member of Parliament",
        district: "Bombali",
        constituency: "Constituency 090",
        phone: "076000112",
        email: "m.bah@parliament.sl",
      },
      {
        name: "Hon. Samuel Kargbo",
        role: "Member of Parliament",
        district: "Kailahun",
        constituency: "Constituency 100",
        phone: "076000113",
        email: "s.kargbo@parliament.sl",
      },
      {
        name: "Hon. Isata Bangalie",
        role: "Member of Parliament",
        district: "Bonthe",
        constituency: "Constituency 110",
        phone: "076000114",
        email: "i.bangalie@parliament.sl",
      },
      {
        name: "Councillor Francis Cole",
        role: "Local Council",
        district: "Pujehun",
        constituency: "Ward 120",
        phone: "076000115",
        email: "f.cole@council.sl",
      },
      {
        name: "Councillor Alice Pratt",
        role: "Local Council",
        district: "Kambia",
        constituency: "Ward 130",
        phone: "076000116",
        email: "a.pratt@council.sl",
      },
      {
        name: "Councillor David Conteh",
        role: "Local Council",
        district: "Moyamba",
        constituency: "Ward 140",
        phone: "076000117",
        email: "d.conteh@council.sl",
      },
      {
        name: "Councillor Grace Sesay",
        role: "Local Council",
        district: "Tonkolili",
        constituency: "Ward 150",
        phone: "076000118",
        email: "g.sesay@council.sl",
      },
      {
        name: "Councillor Paul Rogers",
        role: "Local Council",
        district: "Kono",
        constituency: "Ward 160",
        phone: "076000119",
        email: "p.rogers@council.sl",
      },
      {
        name: "Councillor Mariatu Bah",
        role: "Local Council",
        district: "Karene",
        constituency: "Ward 170",
        phone: "076000120",
        email: "m.bah@council.sl",
      },
    ];

    for (const rep of representatives) {
      await ctx.db.insert("representatives", rep);
    }

    return { message: "Database seeded successfully" };
  },
});
