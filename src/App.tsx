import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useTranslation } from "react-i18next";
import { LiquidBackground } from "@/components/LiquidBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Modal } from "@/components/Modal";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { MobileMenu } from "./components/MobileMenu";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const AdminDashboard = lazy(() =>
  import("@/components/AdminDashboard").then((m) => ({
    default: m.AdminDashboard,
  })),
);
const ChatInterface = lazy(() =>
  import("./components/ChatInterface").then((m) => ({
    default: m.ChatInterface,
  })),
);
const ServiceDirectory = lazy(() =>
  import("./components/ServiceDirectory").then((m) => ({
    default: m.ServiceDirectory,
  })),
);
const RepresentativeFinder = lazy(() =>
  import("./components/RepresentativeFinder").then((m) => ({
    default: m.RepresentativeFinder,
  })),
);
const NewsSection = lazy(() =>
  import("@/components/NewsSection").then((m) => ({ default: m.NewsSection })),
);

const TOUR_SEEN_KEY = "salone_hub_tour_seen";

function IsAdmin({ children }: { children: ReactNode }) {
  const admin = useQuery(api.admin.isAdmin);
  if (admin !== true) return null;
  return <>{children}</>;
}

export default function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<
    "chat" | "services" | "representatives" | "news" | "admin"
  >("chat");
  const [tourOpen, setTourOpen] = useState(false);

  const { theme, resolvedTheme, cycleTheme } = useTheme();

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
          <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex justify-between items-center gap-1 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-emerald-500 via-green-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="text-white font-bold text-xs sm:text-sm">
                    SL
                  </span>
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-xl font-bold tracking-tight truncate">
                    SaloneHub
                  </h1>
                  <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                    Sierra Leone civic portal
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <IsAdmin>
                  <button
                    type="button"
                    className="btn-ghost px-2 sm:px-3 text-sm"
                    onClick={() => setActiveTab("admin")}
                    title="Admin panel"
                    aria-label="Admin panel"
                  >
                    ⚙️
                  </button>
                </IsAdmin>
                <button
                  type="button"
                  className="btn-ghost px-2 sm:px-3 text-sm"
                  onClick={() => setTourOpen(true)}
                  title="Quick tour"
                  aria-label="Open quick tour"
                >
                  ?
                </button>
                <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                  <LanguageSwitcher />
                  <ThemeToggle theme={theme} onCycle={cycleTheme} />
                  <SignOutButton />
                </div>
                <MobileMenu theme={theme} onCycle={cycleTheme} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          }
        >
          <Content activeTab={activeTab} setActiveTab={setActiveTab} t={t} />
        </Suspense>
      </main>

      <Footer />

      <Modal
        open={tourOpen}
        onOpenChange={onTourOpenChange}
        title="Welcome to SaloneHub"
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
    </div>
  );
}

function Content({
  activeTab,
  setActiveTab,
  t,
}: {
  activeTab: "chat" | "services" | "representatives" | "news" | "admin";
  setActiveTab: (
    tab: "chat" | "services" | "representatives" | "news" | "admin",
  ) => void;
  t: any;
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (activeTab === "admin") {
    return (
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <Unauthenticated>
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card card-hover p-8 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">SL</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to SaloneHub</h2>
              <p className="text-sm text-muted-foreground">
                Sign in to access Sierra Leone government services
              </p>
            </div>
            <SignInForm />
          </motion.div>
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
        </div>

        {/* Navigation Tabs */}
        <div className="glass-card p-1.5 mb-4 sm:mb-6 flex gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("chat")}
            className={cn(
              "flex-1 min-w-0 rounded-xl px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold smooth-transition",
              activeTab === "chat"
                ? "bg-white/70 dark:bg-white/10 shadow-sm"
                : "hover:bg-white/50 dark:hover:bg-white/5 text-muted-foreground",
            )}
          >
            🤖 {t("chat.title")}
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={cn(
              "flex-1 min-w-0 rounded-xl px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold smooth-transition",
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
              "flex-1 min-w-0 rounded-xl px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold smooth-transition",
              activeTab === "representatives"
                ? "bg-white/70 dark:bg-white/10 shadow-sm"
                : "hover:bg-white/50 dark:hover:bg-white/5 text-muted-foreground",
            )}
          >
            👥 {t("officials")}
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={cn(
              "flex-1 min-w-0 rounded-xl px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold smooth-transition",
              activeTab === "news"
                ? "bg-white/70 dark:bg-white/10 shadow-sm"
                : "hover:bg-white/50 dark:hover:bg-white/5 text-muted-foreground",
            )}
          >
            📰 {t("news")}
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === "chat" && <ChatInterface />}
          {activeTab === "services" && <ServiceDirectory />}
          {activeTab === "representatives" && <RepresentativeFinder />}
          {activeTab === "news" && <NewsSection />}
        </div>
      </Authenticated>
    </div>
  );
}
