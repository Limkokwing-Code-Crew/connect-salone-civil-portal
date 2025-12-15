import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { ChatInterface } from "./components/ChatInterface";
import { ServiceDirectory } from "./components/ServiceDirectory";
import { RepresentativeFinder } from "./components/RepresentativeFinder";
import { NewsSection } from "@/components/NewsSection";
import { AdminDashboard } from "@/components/AdminDashboard";
import { useEffect, useState } from "react";
import { LiquidBackground } from "@/components/LiquidBackground";
import { OfflineBanner } from "@/components/OfflineBanner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Modal } from "@/components/Modal";
import { Footer } from "@/components/Footer";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import "./i18n";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./components/LanguageSwitcher";


const TOUR_SEEN_KEY = "salone_hub_tour_seen";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "chat" | "services" | "representatives" | "news" | "admin"
  >("chat");
  const [tourOpen, setTourOpen] = useState(false);

  const { theme, resolvedTheme, cycleTheme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    try {
      const seen = window.localStorage.getItem(TOUR_SEEN_KEY);
      if (!seen) setTourOpen(true);
    } catch {
      // ignore
    }
  }, []);

  const onTourOpenChange = (open: boolean) => {
    setTourOpen(open);
    if (!open) {
      try {
        window.localStorage.setItem(TOUR_SEEN_KEY, "1");
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <LiquidBackground />

      <header className="sticky top-0 z-10">
        <div className="glass-surface border-b border-white/20 dark:border-white/10 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 via-green-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">SL</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    {t("appName")}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Sierra Leone civic portal • fast, friendly, and official
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <button
                  type="button"
                  className="btn-ghost px-3"
                  onClick={() => setTourOpen(true)}
                  title="Quick tour"
                  aria-label="Open quick tour"
                >
                  ?
                </button>
                <ThemeToggle theme={theme} onCycle={cycleTheme} />
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Content activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>

      <Footer />

      <Modal
        open={tourOpen}
        onOpenChange={onTourOpenChange}
        title="Welcome to Salone Hub"
      >
        <div className="space-y-4">
          <div className="glass-surface rounded-2xl p-4">
            <div className="font-semibold">What you can do here</div>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="mr-2">🤖</span>Ask the AI assistant about
                requirements, fees, and where to go.
              </li>
              <li>
                <span className="mr-2">📋</span>Browse government services with
                filters.
              </li>
              <li>
                <span className="mr-2">👥</span>Find officials and contact
                details by district.
              </li>
            </ul>
          </div>

          <div className="glass-surface rounded-2xl p-4">
            <div className="font-semibold">Pro tips</div>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="mr-2">🌓</span>Use the theme button to cycle
                Light → Dark → Auto.
              </li>
              <li>
                <span className="mr-2">✨</span>Click a tab — cards have hover
                lift, blur, and subtle motion.
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              className="btn-primary w-full"
              onClick={() => onTourOpenChange(false)}
            >
              Let’s go
            </button>
            <button
              className="btn-ghost w-full"
              onClick={() => onTourOpenChange(false)}
            >
              Maybe later
            </button>
          </div>
        </div>
      </Modal>

      <Toaster theme={resolvedTheme} richColors closeButton />
      <OfflineBanner />
    </div>
  );
}

function Content({
  activeTab,
  setActiveTab,
}: {
  activeTab: "chat" | "services" | "representatives" | "news" | "admin";
  setActiveTab: (tab: "chat" | "services" | "representatives" | "news" | "admin") => void;
}) {
  const { t } = useTranslation();
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const isAdmin = loggedInUser?.email === "admin@salonehub.sl";

  const handleLogout = () => {
    // Start sign out logic if needed, but SignOutButton handles it. 
    // We can just switch tab back to chat or something.
    window.location.reload();
  };

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Unauthenticated>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Welcome to Salone Hub
          </h2>
          <p className="text-lg text-muted-foreground mb-6 text-balance">
            Your unified portal for Sierra Leone government services — designed
            to be modern, friendly, and fast.
          </p>
          <div className="glass-card card-hover p-6">
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight mb-1">
            Welcome back, {loggedInUser?.email?.split("@")[0] || "Citizen"}!
          </h2>
          <p className="text-muted-foreground">
            What do you want to do today — ask the AI, browse services, or find
            officials?
          </p>
          {isAdmin && (
            <div className="mt-4">
              <button
                onClick={() => setActiveTab("admin")}
                className="btn-primary bg-red-600 hover:bg-red-700 border-red-500"
              >
                Enter Admin Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="glass-card p-1.5 mb-6 flex gap-1">
          <button
            onClick={() => setActiveTab("chat")}
            className={cn(
              "flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
              activeTab === "chat"
                ? "bg-white/70 dark:bg-white/10 shadow-sm"
                : "hover:bg-white/50 dark:hover:bg-white/5 text-muted-foreground",
            )}
          >
            🤖 {t("chat")}
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={cn(
              "flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
              activeTab === "services"
                ? "bg-white/70 dark:bg-white/10 shadow-sm"
                : "hover:bg-white/50 dark:hover:bg-white/5 text-muted-foreground",
            )}
          >
            📋 {t("services")}
          </button>
          <button
            onClick={() => setActiveTab("representatives")}
            className={cn(
              "flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
              activeTab === "representatives"
                ? "bg-white/70 dark:bg-white/10 shadow-sm"
                : "hover:bg-white/50 dark:hover:bg-white/5 text-muted-foreground",
            )}
          >
            👥 {t("representatives")}
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={cn(
              "flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
              activeTab === "news"
                ? "bg-white/70 dark:bg-white/10 shadow-sm"
                : "hover:bg-white/50 dark:hover:bg-white/5 text-muted-foreground",
            )}
          >
            📰 {t("news")}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "chat" && <ChatInterface />}
        {activeTab === "services" && <ServiceDirectory />}
        {activeTab === "representatives" && <RepresentativeFinder />}
        {activeTab === "news" && <NewsSection />}
        {activeTab === "admin" && isAdmin && <AdminDashboard onLogout={handleLogout} />}
      </Authenticated>
    </div>
  );
}
