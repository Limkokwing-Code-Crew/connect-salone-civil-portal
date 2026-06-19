import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const searchRepresentatives = query({
  args: {
    searchTerm: v.optional(v.string()),
    district: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.searchTerm) {
      const searchTerm = args.searchTerm;
      return await ctx.db
        .query("representatives")
        .withSearchIndex("search_representatives", (q) => {
          let searchQuery = q.search("name", searchTerm);
          if (args.district) {
            searchQuery = searchQuery.eq("district", args.district);
          }
          if (args.role) {
            searchQuery = searchQuery.eq("role", args.role);
          }
          return searchQuery;
        })
        .collect();
    } else if (args.district) {
      const district = args.district;
      return await ctx.db
        .query("representatives")
        .withIndex("by_district", (q) => q.eq("district", district))
        .collect();
    } else if (args.role) {
      const role = args.role;
      return await ctx.db
        .query("representatives")
        .withIndex("by_role", (q) => q.eq("role", role))
        .collect();
    } else {
      return await ctx.db.query("representatives").collect();
    }
  },
});

export const getDistricts = query({
  args: {},
  handler: async (ctx) => {
    const representatives = await ctx.db.query("representatives").collect();
    const districts = [...new Set(representatives.map((r) => r.district))];
    return districts.sort();
  },
});

export const getRoles = query({
  args: {},
  handler: async (ctx) => {
    const representatives = await ctx.db.query("representatives").collect();
    const roles = [...new Set(representatives.map((r) => r.role))];
    return roles.sort();
  },
});

export const getAllRepresentatives = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("representatives").paginate(args.paginationOpts);
  },
});

export const getRepresentativesPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("representatives").paginate(args.paginationOpts);
  },
});

export const searchRepresentativesPaginated = query({
  args: {
    searchTerm: v.optional(v.string()),
    district: v.optional(v.string()),
    role: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { paginationOpts, searchTerm, district, role } = args;
    if (searchTerm) {
      return await ctx.db
        .query("representatives")
        .withSearchIndex("search_representatives", (q) => {
          let searchQuery = q.search("name", searchTerm);
          if (district) searchQuery = searchQuery.eq("district", district);
          if (role) searchQuery = searchQuery.eq("role", role);
          return searchQuery;
        })
        .paginate(paginationOpts);
    }
    if (district) {
      return await ctx.db
        .query("representatives")
        .withIndex("by_district", (q) => q.eq("district", district))
        .paginate(paginationOpts);
    }
    if (role) {
      return await ctx.db
        .query("representatives")
        .withIndex("by_role", (q) => q.eq("role", role))
        .paginate(paginationOpts);
    }
    return await ctx.db.query("representatives").paginate(paginationOpts);
  },
});

export const createRepresentative = mutation({
  args: {
    name: v.string(),
    role: v.optional(v.string()),
    district: v.string(),
    phone: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const admin = await ctx.db.query("admins").withIndex("by_userId", (q) => q.eq("userId", userId)).first();
    if (!admin) throw new ConvexError("Unauthorized: Admin only");
    const id = await ctx.db.insert("representatives", args);
    const roleLabel = args.role ? ` as ${args.role}` : "";
    await ctx.db.insert("news", {
      title: `New Representative: ${args.name}`,
      summary: `${args.name} has been appointed${roleLabel} for the ${args.district} district.`,
      category: "Public Notice",
      type: "auto",
      source: "SaloneHub",
      relatedEntityType: "representatives",
      relatedEntityId: id,
      publishedAt: Date.now(),
      createdAt: Date.now(),
      createdBy: userId,
    });
    return id;
  },
});

export const updateRepresentative = mutation({
  args: {
    id: v.id("representatives"),
    name: v.string(),
    role: v.optional(v.string()),
    district: v.string(),
    phone: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const admin = await ctx.db.query("admins").withIndex("by_userId", (q) => q.eq("userId", userId)).first();
    if (!admin) throw new ConvexError("Unauthorized: Admin only");
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const deleteRepresentative = mutation({
  args: {
    id: v.id("representatives"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const admin = await ctx.db.query("admins").withIndex("by_userId", (q) => q.eq("userId", userId)).first();
    if (!admin) throw new ConvexError("Unauthorized: Admin only");
    await ctx.db.delete(args.id);
  },
});
