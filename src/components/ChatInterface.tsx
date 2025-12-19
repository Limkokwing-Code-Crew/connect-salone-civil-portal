import { useState, useRef, useEffect } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function ChatInterface() {
  const [message, setMessage] = useState("");
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = useAction(api.chat.sendMessage);
  const chatHistory = useQuery(api.chat.getChatHistory, { sessionId });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);

    try {
      await sendMessage({
        message: userMessage,
        sessionId,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card card-hover h-[600px] flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/20 dark:border-white/10 bg-gradient-to-r from-emerald-600/90 to-cyan-600/80 text-white">
        <h3 className="font-semibold tracking-tight">SaloneHub AI Assistant</h3>
        <p className="text-sm opacity-90">
          Ask about requirements, fees, processing time, and where to go.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!chatHistory?.length && (
          <div className="text-center text-muted-foreground py-8">
            <div className="text-4xl mb-4">🤖</div>
            <p className="text-lg font-semibold text-foreground mb-2">
              Welcome to SaloneHub AI!
            </p>
            <p className="text-sm">Try one of these:</p>
            <div className="mt-4 space-y-2 text-left max-w-md mx-auto">
              <div className="glass-surface rounded-xl p-3 text-sm">
                “How do I apply for a passport?”
              </div>
              <div className="glass-surface rounded-xl p-3 text-sm">
                “What are the fees for business registration?”
              </div>
              <div className="glass-surface rounded-xl p-3 text-sm">
                “Where can I get a driver’s license in Bo?”
              </div>
            </div>
          </div>
        )}

        {chatHistory?.map((chat, index) => (
          <div key={index} className="space-y-3 animate-fade-in">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground p-3 rounded-2xl max-w-xs lg:max-w-md shadow-sm">
                <p className="text-sm">{chat.message}</p>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex justify-start">
              <div className="glass-surface p-3 rounded-2xl max-w-xs lg:max-w-md">
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{chat.response}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="glass-surface p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/20 dark:border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about government services..."
            className="input flex-1"
            disabled={isLoading}
          />
          <button type="submit" disabled={!message.trim() || isLoading} className="btn-primary">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
