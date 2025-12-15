import { useState } from "react";
import { toast } from "sonner";
import { FeedbackModal } from "./FeedbackModal";
import { useTranslation } from "react-i18next";

export function Footer() {
  const [email, setEmail] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { t } = useTranslation();

  const submit = () => {
    const value = email.trim();
    if (!value) {
      toast.error("Enter an email to subscribe.");
      return;
    }
    toast.success("Subscribed! We’ll send you service updates.");
    setEmail("");
  };

  return (
    <footer className="mt-10">
      <div className="bg-gradient-to-r from-slate-950/90 to-slate-900/90 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div>
              <div className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
                Salone Hub
              </div>
              <p className="mt-3 text-sm text-slate-300/80">
                Fast, transparent access to Sierra Leone’s verified government services.
              </p>
            </div>

            <div>
              <div className="font-semibold text-slate-100 mb-3">Quick Links</div>
              <ul className="space-y-2 text-sm text-slate-300/80">
                <li>
                  <a className="hover:text-yellow-300 transition" href="#">
                    Services
                  </a>
                </li>
                <li>
                  <a className="hover:text-yellow-300 transition" href="#">
                    Officials
                  </a>
                </li>
                <li>
                  <a className="hover:text-yellow-300 transition" href="#">
                    {t("news")}
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setFeedbackOpen(true)}
                    className="hover:text-yellow-300 transition text-left"
                  >
                    {t("feedback")}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-slate-100 mb-3">Stay Updated</div>
              <p className="text-sm text-slate-300/80 mb-3">
                Subscribe for updates on requirements, fees, and timelines.
              </p>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Notify me"
                  className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-400 text-sm"
                />
                <button
                  type="button"
                  onClick={submit}
                  className="btn-ghost px-3 text-slate-100"
                  title="Subscribe"
                  aria-label="Subscribe"
                >
                  Send
                </button>
              </div>
            </div>

            <div>
              <div className="font-semibold text-slate-100 mb-3">Contact</div>
              <div className="space-y-2 text-sm text-slate-300/80">
                <div>📞 +232 76 XXX XXX</div>
                <div>✉️ info@salonehub.sl</div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center text-xs text-slate-400">
            <p>Built for citizens & teams. Hackathon-ready MVP.</p>
            <p className="mt-2 opacity-75">Offline-ready · Secure · Transparent</p>
          </div>
        </div>
      </div>
      <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </footer>
  );
}
