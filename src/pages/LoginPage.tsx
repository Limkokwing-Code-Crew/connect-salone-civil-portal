import { useQuery } from "convex/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { SignInForm } from "../SignInForm";
import { LiquidBackground } from "@/components/LiquidBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "./../components/LanguageSwitcher";
import { useTheme } from "@/hooks/useTheme";
import { useEffect } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const isAuthenticated = loggedInUser !== undefined && loggedInUser !== null;
  const { theme, cycleTheme } = useTheme();
  const returnTo = searchParams.get("returnTo") || "/";

  useEffect(() => {
    if (isAuthenticated) {
      void navigate(returnTo, { replace: true });
    }
  }, [isAuthenticated, navigate, returnTo]);

  return (
    <div className="min-h-screen flex flex-col">
      <LiquidBackground />
      <header className="sticky top-0 z-10">
        <div className="glass-surface border-b border-white/20 dark:border-white/10 shadow-sm">
          <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-emerald-500 via-green-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-xs sm:text-sm">SL</span>
                </div>
                <div>
                  <h1 className="text-base sm:text-xl font-bold tracking-tight">SaloneHub</h1>
                  <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                    Sierra Leone civic portal
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeToggle theme={theme} onCycle={cycleTheme} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-3 sm:px-4 py-8">
        <div className="w-full max-w-md">
          <div className="glass-card p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-green-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-white font-bold text-xl">SL</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Welcome to SaloneHub</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Sign in or create an account to get started
              </p>
            </div>

            <SignInForm
              onSuccess={() => void navigate(returnTo, { replace: true })}
            />

            <div className="mt-6 text-center">
              <button
                type="button"
                className="text-sm text-muted-foreground hover:underline"
                onClick={() => void navigate("/")}
              >
                ← Back to home
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
