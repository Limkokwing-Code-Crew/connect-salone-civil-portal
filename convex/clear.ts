import { mutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const clearAll = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!admin) throw new ConvexError("Unauthorized: Admin only");

    const services = await ctx.db.query("services").collect();
    for (const service of services) {
      await ctx.db.delete(service._id);
    }

    const representatives = await ctx.db.query("representatives").collect();
    for (const rep of representatives) {
      await ctx.db.delete(rep._id);
    }

    return { message: "All data cleared" };
  },
});
