import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const sendMessage = action({
  args: {
    message: v.string(),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get AI response using Convex OpenAI integration
    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({
      baseURL: process.env.CONVEX_OPENAI_BASE_URL,
      apiKey: process.env.CONVEX_OPENAI_API_KEY,
    });

    // Rate Limiting: Check last message time
    const lastMessage = await ctx.runQuery(api.chat.getLastMessage, {
      sessionId: args.sessionId,
    });
    if (lastMessage && Date.now() - lastMessage.timestamp < 5000) {
      throw new Error("Whoa, slow down! Please wait a few seconds.");
    }

    // Check if OpenAI credentials are configured
    if (!process.env.CONVEX_OPENAI_API_KEY) {
      const errorResponse = "OpenAI API key is not configured. Please set CONVEX_OPENAI_API_KEY in your Convex Dashboard environment variables.";
      console.error("DEBUG: OpenAI credentials missing");

      await ctx.runMutation(api.chat.saveMessage, {
        message: args.message,
        response: errorResponse,
        sessionId: args.sessionId,
      });

      return errorResponse;
    }

    try {
      console.log(`DEBUG: Processing message from session ${args.sessionId}`);
      // Check for specific greeting pattern
      if (args.message.toLowerCase().trim() === "hy" || args.message.toLowerCase().trim() === "hi") {
        const greetingResponse = "hi";
        console.log("DEBUG: Greeting detected, skipping OpenAI");

        // Save the conversation
        await ctx.runMutation(api.chat.saveMessage, {
          message: args.message,
          response: greetingResponse,
          sessionId: args.sessionId,
        });

        return greetingResponse;
      }

      console.log("DEBUG: Calling OpenAI...");
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are SaloneHub AI, an intelligent assistant for Sierra Leone government services. You help citizens navigate government processes, find information about services, fees, requirements, and contact details.

Key guidelines:
- Provide accurate information about Sierra Leone government services
- Always mention official fees, processing times, and required documents when known
- Direct users to appropriate ministries and offices
- Be helpful, professional, and culturally sensitive
- If you don't have specific information, suggest contacting the relevant ministry
- Use simple, clear language accessible to all education levels
- Include contact information when available

Available services include passport applications, business registration, driver's licenses, birth certificates, marriage certificates, tax registration, land titles, import/export licenses, health certificates, police clearances, work permits, and many others across various ministries.`,
          },
          {
            role: "user",
            content: args.message,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const aiResponse =
        completion.choices[0]?.message?.content ||
        "I apologize, but I'm having trouble processing your request right now. Please try again or contact the relevant ministry directly.";

      console.log("DEBUG: OpenAI responded successfully");

      // Save the conversation
      await ctx.runMutation(api.chat.saveMessage, {
        message: args.message,
        response: aiResponse,
        sessionId: args.sessionId,
      });

      return aiResponse;
    } catch (error: any) {
      console.error("DEBUG: OpenAI API error history:", error);
      const errorMessage = error?.message || String(error);
      console.error("DEBUG: Error message:", errorMessage);

      const fallbackResponse = `Error: ${errorMessage}. (This message is for debugging. Please try again or contact support.)`;

      // Save the conversation with fallback response
      try {
        await ctx.runMutation(api.chat.saveMessage, {
          message: args.message,
          response: fallbackResponse,
          sessionId: args.sessionId,
        });
      } catch (saveError) {
        console.error("DEBUG: Failed to save fallback message:", saveError);
      }

      return fallbackResponse;
    }
  },
});

export const saveMessage = mutation({
  args: {
    message: v.string(),
    response: v.string(),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    console.log(`DEBUG: saveMessage - userId: ${userId}, sessionId: ${args.sessionId}`);

    try {
      await ctx.db.insert("chatMessages", {
        userId: userId || undefined,
        sessionId: args.sessionId,
        message: args.message,
        response: args.response,
        timestamp: Date.now(),
      });
      console.log("DEBUG: Message saved to DB");
    } catch (dbError) {
      console.error("DEBUG: Database insert error:", dbError);
      throw dbError;
    }
  },
});

export const getChatHistory = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("asc")
      .collect();
  },
});

export const getLastMessage = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .first();
  },
});
