import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const checkUsers = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!admin) throw new Error("Unauthorized: Admin only");
    const users = await ctx.db.query("users").collect();
    const accounts = await ctx.db.query("authAccounts").collect();
    return {
      userCount: users.length,
      users: users.map((u) => ({ _id: u._id, email: u.email ?? "(no email)" })),
      accountCount: accounts.length,
      accounts: accounts.map((a) => ({
        _id: a._id,
        provider: a.provider,
        providerAccountId: a.providerAccountId,
        userId: a.userId,
      })),
    };
  },
});
