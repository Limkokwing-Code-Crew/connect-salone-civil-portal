import { query, mutation, action } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId, createAccount } from "@convex-dev/auth/server";
import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const isAdmin = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    return admin !== null;
  },
});

export const listUsers = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const callerIsAdmin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!callerIsAdmin) return [];
    const users = await ctx.db.query("users").collect();
    const adminIds = new Set(
      (await ctx.db.query("admins").collect()).map((a) => a.userId),
    );
    return users.map((u) => ({
      _id: u._id,
      email: String(u.email ?? "(no email)"),
      name: String(u.name ?? ""),
      isAdmin: adminIds.has(u._id),
    }));
  },
});

export const grantAdmin = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const callerAdmin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!callerAdmin) throw new ConvexError("Unauthorized: Admin only");
    const existing = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (existing) return { success: true, alreadyAdmin: true };
    await ctx.db.insert("admins", { userId: args.userId });
    return { success: true, alreadyAdmin: false };
  },
});

export const revokeAdmin = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const callerAdmin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!callerAdmin) throw new ConvexError("Unauthorized: Admin only");
    const existing = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (!existing) return { success: true, wasNotAdmin: true };
    await ctx.db.delete(existing._id);
    return { success: true, wasNotAdmin: false };
  },
});

export const seedGrantAdmin = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (existing) return { success: true, alreadyAdmin: true };
    await ctx.db.insert("admins", { userId: args.userId });
    return { success: true, alreadyAdmin: false };
  },
});

export const removeOldTestAccounts = mutation({
  args: {},
  handler: async (ctx) => {
    const testEmails = new Set(["admin@salonehub.sl", "alice@test.com", "bob@test.com"]);
    const accounts = await ctx.db.query("authAccounts").collect();
    let removed = 0;
    for (const acct of accounts) {
      if (testEmails.has(acct.providerAccountId)) {
        await ctx.db.delete(acct._id);
        removed++;
      }
    }
    return { removed };
  },
});

export const seedUsers = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthenticated");
    const callerAdmin = await ctx.runQuery(api.admin.isAdmin);
    if (!callerAdmin) throw new ConvexError("Unauthorized: Admin only");

    // Remove old accounts so we can re-create with updated passwords
    await ctx.runMutation(api.admin.removeOldTestAccounts);

    const testUsers = [
      { email: "admin@salonehub.sl", password: "admin1234", name: "Admin" },
      { email: "alice@test.com", password: "test1234", name: "Alice" },
      { email: "bob@test.com", password: "test1234", name: "Bob" },
    ];

    const results: {
      email: string;
      success: boolean;
      userId?: string;
      error?: string;
    }[] = [];

    for (const u of testUsers) {
      try {
        const { user } = await createAccount(ctx, {
          provider: "password",
          account: { id: u.email, secret: u.password },
          profile: { email: u.email, name: u.name },
          shouldLinkViaEmail: false,
          shouldLinkViaPhone: false,
        });
        results.push({ email: u.email, success: true, userId: user._id });
      } catch (e: any) {
        results.push({
          email: u.email,
          success: false,
          error: e.message ?? String(e),
        });
      }
    }

    // Grant admin to admin@salonehub.sl
    const adminUser = results.find(
      (r) => r.success && r.email === "admin@salonehub.sl",
    );
    if (adminUser?.userId) {
      await ctx.runMutation(api.admin.seedGrantAdmin, {
        userId: adminUser.userId as any,
      });
    }

    return { results };
  },
});

export const cleanupDuplicates = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const callerAdmin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!callerAdmin) throw new ConvexError("Unauthorized: Admin only");

    const results: { table: string; removed: number }[] = [];

    // Services — duplicates by name (case-insensitive)
    const services = await ctx.db.query("services").collect();
    const seenServices = new Map<string, string>();
    let removedServices = 0;
    for (const s of services) {
      const key = s.name.toLowerCase().trim();
      const existing = seenServices.get(key);
      if (existing) {
        await ctx.db.delete(s._id);
        removedServices++;
      } else {
        seenServices.set(key, s._id);
      }
    }
    results.push({ table: "services", removed: removedServices });

    // Representatives — duplicates by name + district
    const reps = await ctx.db.query("representatives").collect();
    const seenReps = new Map<string, string>();
    let removedReps = 0;
    for (const r of reps) {
      const key = `${r.name.toLowerCase().trim()}|${r.district.toLowerCase().trim()}`;
      const existing = seenReps.get(key);
      if (existing) {
        await ctx.db.delete(r._id);
        removedReps++;
      } else {
        seenReps.set(key, r._id);
      }
    }
    results.push({ table: "representatives", removed: removedReps });

    // News — duplicates by title (case-insensitive)
    const news = await ctx.db.query("news").collect();
    const seenNews = new Map<string, string>();
    let removedNews = 0;
    for (const n of news) {
      const key = n.title.toLowerCase().trim();
      const existing = seenNews.get(key);
      if (existing) {
        await ctx.db.delete(n._id);
        removedNews++;
      } else {
        seenNews.set(key, n._id);
      }
    }
    results.push({ table: "news", removed: removedNews });

    return results;
  },
});
