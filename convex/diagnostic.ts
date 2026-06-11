import { query } from "./_generated/server";

export const checkUsers = query({
  handler: async (ctx) => {
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
