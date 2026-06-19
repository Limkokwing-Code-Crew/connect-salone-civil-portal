import { query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!admin) throw new ConvexError("Unauthorized: Admin only");

    const [services, representatives, feedback, logs, users] = await Promise.all([
      ctx.db.query("services").collect(),
      ctx.db.query("representatives").collect(),
      ctx.db.query("feedback").collect(),
      ctx.db.query("adminLogs").order("desc").take(10),
      ctx.db.query("users").collect(),
    ]);

    const openFeedback = feedback.filter((f) => f.status === "open").length;

    return {
      totalServices: services.length,
      totalRepresentatives: representatives.length,
      totalUsers: users.length,
      openFeedbackCount: openFeedback,
      totalFeedbackCount: feedback.length,
      recentLogs: logs,
    };
  },
});
