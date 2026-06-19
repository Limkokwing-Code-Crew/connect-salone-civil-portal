import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("news").withIndex("by_publishedAt", (q) => q);
    if (args.category) {
      q = q.filter((n) => n.eq(n.field("category"), args.category!));
    }
    const items = await q.order("desc").take(args.limit ?? 50);
    return items;
  },
});

export const getById = query({
  args: { id: v.id("news") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("news").collect();
    const cats = [...new Set(all.map((n) => n.category))];
    return cats.sort();
  },
});

export const createNews = mutation({
  args: {
    title: v.string(),
    summary: v.string(),
    category: v.string(),
    source: v.optional(v.string()),
    href: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const admin = await ctx.db.query("admins").withIndex("by_userId", (q) => q.eq("userId", userId)).first();
    if (!admin) throw new ConvexError("Unauthorized: Admin only");
    const now = Date.now();
    return await ctx.db.insert("news", {
      title: args.title,
      summary: args.summary,
      category: args.category,
      type: "manual",
      source: args.source,
      href: args.href,
      publishedAt: args.publishedAt ?? now,
      createdAt: now,
      createdBy: userId,
    });
  },
});

export const updateNews = mutation({
  args: {
    id: v.id("news"),
    title: v.optional(v.string()),
    summary: v.optional(v.string()),
    category: v.optional(v.string()),
    source: v.optional(v.string()),
    href: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
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

export const deleteNews = mutation({
  args: { id: v.id("news") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const admin = await ctx.db.query("admins").withIndex("by_userId", (q) => q.eq("userId", userId)).first();
    if (!admin) throw new ConvexError("Unauthorized: Admin only");
    await ctx.db.delete(args.id);
  },
});
