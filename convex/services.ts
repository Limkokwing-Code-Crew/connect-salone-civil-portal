import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllServices = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("services").collect();
  },
});

export const searchServices = query({
  args: {
    searchTerm: v.optional(v.string()),
    agency: v.optional(v.string()),
    region: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.searchTerm) {
      return await ctx.db
        .query("services")
        .withSearchIndex("search_services", (q) => {
          let searchQuery = q.search("name", args.searchTerm!);
          if (args.agency) {
            searchQuery = searchQuery.eq("agency", args.agency);
          }
          if (args.region) {
            searchQuery = searchQuery.eq("region", args.region);
          }
          return searchQuery;
        })
        .collect();
    } else if (args.agency) {
      return await ctx.db
        .query("services")
        .withIndex("by_agency", (q) => q.eq("agency", args.agency!))
        .collect();
    } else if (args.region) {
      return await ctx.db
        .query("services")
        .withIndex("by_region", (q) => q.eq("region", args.region!))
        .collect();
    } else {
      return await ctx.db.query("services").collect();
    }
  },
});

export const getAgencies = query({
  args: {},
  handler: async (ctx) => {
    const services = await ctx.db.query("services").collect();
    const agencies = [...new Set(services.map((s) => s.agency))];
    return agencies.sort();
  },
});

export const getRegions = query({
  args: {},
  handler: async (ctx) => {
    const services = await ctx.db.query("services").collect();
    const regions = [...new Set(services.map((s) => s.region))];
    return regions.sort();
  },
});

export const createService = mutation({
  args: {
    name: v.string(),
    agency: v.string(),
    fee: v.string(),
    processingTime: v.string(),
    documents: v.array(v.string()),
    eligibility: v.string(),
    processSteps: v.array(v.string()),
    locations: v.array(v.string()),
    contacts: v.string(),
    notes: v.string(),
    lastVerified: v.string(),
    region: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("services", args);
  },
});

export const deleteService = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateService = mutation({
  args: {
    id: v.id("services"),
    name: v.optional(v.string()),
    agency: v.optional(v.string()),
    fee: v.optional(v.string()),
    processingTime: v.optional(v.string()),
    documents: v.optional(v.array(v.string())),
    eligibility: v.optional(v.string()),
    processSteps: v.optional(v.array(v.string())),
    locations: v.optional(v.array(v.string())),
    contacts: v.optional(v.string()),
    notes: v.optional(v.string()),
    lastVerified: v.optional(v.string()),
    region: v.optional(v.string()),
    ministry: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    requirements: v.optional(v.array(v.string())),
    officialFees: v.optional(v.string()),
    contactInfo: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return id;
  },
});
