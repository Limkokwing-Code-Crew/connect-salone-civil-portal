import { query } from "./_generated/server";

export const getStats = query({
    args: {},
    handler: async (ctx) => {
        const services = await ctx.db.query("services").collect();
        const representatives = await ctx.db.query("representatives").collect();
        const feedback = await ctx.db.query("feedback").collect();
        const messages = await ctx.db.query("chatMessages").collect();

        return {
            totalServices: services.length,
            totalRepresentatives: representatives.length,
            totalFeedback: feedback.length,
            totalMessages: messages.length,
        };
    },
});
