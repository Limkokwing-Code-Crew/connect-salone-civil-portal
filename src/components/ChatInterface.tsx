import { useState, useRef, useEffect } from "react";
import { useAction, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";

export function ChatInterface() {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);

  const sendMessage = useAction(api.chat.sendMessage);
  const chatHistory = useQuery(api.chat.getChatHistory, { sessionId });

  // Only scroll when a new message is added (length increases)
  useEffect(() => {
    if (!chatHistory || isInitialLoad) return;
    if (chatHistory.length > prevLengthRef.current) {
      const container = messagesRef.current;
      if (container) {
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
        });
      }
    }
    prevLengthRef.current = chatHistory.length;
  }, [chatHistory, isInitialLoad]);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const send = (text: string) => {
    if (!text.trim() || isLoading) return;
    setMessage("");
    setIsLoading(true);
    sendMessage({ message: text.trim(), sessionId })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Failed to send message");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(message);
  };

  const handleSuggestionClick = (suggestion: string) => {
    const text = suggestion.replace(/^"|"$/g, "").trim();
    if (text) send(text);
  };

  return (
    <div className="glass-card card-hover flex flex-col flex-1 min-h-0 max-h-full overflow-hidden">
      <div className="p-4 border-b border-white/20 dark:border-white/10 bg-gradient-to-r from-emerald-600/90 to-cyan-600/80 text-white">
        <h3 className="font-semibold tracking-tight">{t("chat.title")}</h3>
        <p className="text-sm opacity-90">{t("chat.subtitle")}</p>
      </div>

      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4"
      >
        {!chatHistory?.length && (
          <div className="text-center text-muted-foreground py-8">
            <div className="text-4xl mb-4">🤖</div>
            <p className="text-lg font-semibold text-foreground mb-2">
              {t("chatGreeting")}
            </p>
            <p className="text-sm">{t("chatSuggestions")}</p>
            <div className="mt-4 space-y-2 text-left max-w-md mx-auto">
              <button
                type="button"
                onClick={() => handleSuggestionClick(t("chatSuggestion1"))}
                className="glass-surface rounded-xl p-3 text-sm w-full text-left cursor-pointer hover:bg-white/60 dark:hover:bg-white/10 smooth-transition"
              >
                {t("chatSuggestion1")}
              </button>
              <button
                type="button"
                onClick={() => handleSuggestionClick(t("chatSuggestion2"))}
                className="glass-surface rounded-xl p-3 text-sm w-full text-left cursor-pointer hover:bg-white/60 dark:hover:bg-white/10 smooth-transition"
              >
                {t("chatSuggestion2")}
              </button>
              <button
                type="button"
                onClick={() => handleSuggestionClick(t("chatSuggestion3"))}
                className="glass-surface rounded-xl p-3 text-sm w-full text-left cursor-pointer hover:bg-white/60 dark:hover:bg-white/10 smooth-transition"
              >
                {t("chatSuggestion3")}
              </button>
            </div>
          </div>
        )}

        {chatHistory?.map((chat, index) => (
          <div
            key={index}
            className="space-y-3 animate-fade-in smooth-transition"
          >
            <div className="flex justify-end animate-slide-in">
              <div className="bg-primary text-primary-foreground p-3 rounded-2xl max-w-[85%] lg:max-w-md shadow-sm hover-lift">
                <p className="text-sm">{chat.message}</p>
              </div>
            </div>

            <div
              className="flex justify-start animate-slide-in"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="glass-surface p-3 rounded-2xl max-w-[85%] lg:max-w-md hover-lift">
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
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 border-t border-white/20 dark:border-white/10"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              t("chat.placeholder") || "Ask about government services..."
            }
            className="input flex-1 min-w-0"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="btn-primary whitespace-nowrap"
          >
            {isLoading ? "..." : t("chat.send")}
          </button>
        </div>
      </form>
    </div>
  );
}
