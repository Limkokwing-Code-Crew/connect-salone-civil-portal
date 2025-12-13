import { mutation } from "./_generated/server";

export const clearAll = mutation({
  handler: async (ctx) => {
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
