import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAllServices = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("services").paginate(args.paginationOpts);
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
      const searchTerm = args.searchTerm;
      return await ctx.db
        .query("services")
        .withSearchIndex("search_services", (q) => {
          let searchQuery = q.search("name", searchTerm);
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
      const agency = args.agency;
      return await ctx.db
        .query("services")
        .withIndex("by_agency", (q) => q.eq("agency", agency))
        .collect();
    } else if (args.region) {
      const region = args.region;
      return await ctx.db
        .query("services")
        .withIndex("by_region", (q) => q.eq("region", region))
        .collect();
    } else {
      return await ctx.db.query("services").collect();
    }
  },
});

export const getServicesPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("services").paginate(args.paginationOpts);
  },
});

export const searchServicesPaginated = query({
  args: {
    searchTerm: v.optional(v.string()),
    agency: v.optional(v.string()),
    region: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { paginationOpts, searchTerm, agency, region } = args;
    if (searchTerm) {
      return await ctx.db
        .query("services")
        .withSearchIndex("search_services", (q) => {
          let searchQuery = q.search("name", searchTerm);
          if (agency) searchQuery = searchQuery.eq("agency", agency);
          if (region) searchQuery = searchQuery.eq("region", region);
          return searchQuery;
        })
        .paginate(paginationOpts);
    }
    if (agency) {
      return await ctx.db
        .query("services")
        .withIndex("by_agency", (q) => q.eq("agency", agency))
        .paginate(paginationOpts);
    }
    if (region) {
      return await ctx.db
        .query("services")
        .withIndex("by_region", (q) => q.eq("region", region))
        .paginate(paginationOpts);
    }
    return await ctx.db.query("services").paginate(paginationOpts);
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
    latitude: v.optional(v.float64()),
    longitude: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const admin = await ctx.db.query("admins").withIndex("by_userId", (q) => q.eq("userId", userId)).first();
    if (!admin) throw new ConvexError("Unauthorized: Admin only");
    const id = await ctx.db.insert("services", args);
    await ctx.db.insert("news", {
      title: `New Service: ${args.name}`,
      summary: `The ${args.name} service has been added to the directory.`,
      category: "Government",
      type: "auto",
      source: "SaloneHub",
      relatedEntityType: "services",
      relatedEntityId: id,
      publishedAt: Date.now(),
      createdAt: Date.now(),
      createdBy: userId,
    });
    return id;
  },
});

export const updateService = mutation({
  args: {
    id: v.id("services"),
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
    latitude: v.optional(v.float64()),
    longitude: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const admin = await ctx.db.query("admins").withIndex("by_userId", (q) => q.eq("userId", userId)).first();
    if (!admin) throw new ConvexError("Unauthorized: Admin only");
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new ConvexError("Service not found");
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    if (fields.fee && fields.fee !== existing.fee) {
      await ctx.db.insert("news", {
        title: `Fee Update: ${existing.name}`,
        summary: `The fee for ${existing.name} has been updated to ${fields.fee}.`,
        category: "Government",
        type: "auto",
        source: "SaloneHub",
        relatedEntityType: "services",
        relatedEntityId: id,
        publishedAt: Date.now(),
        createdAt: Date.now(),
        createdBy: userId,
      });
    }
  },
});

export const deleteService = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const admin = await ctx.db.query("admins").withIndex("by_userId", (q) => q.eq("userId", userId)).first();
    if (!admin) throw new ConvexError("Unauthorized: Admin only");
    await ctx.db.delete(args.id);
  },
});
