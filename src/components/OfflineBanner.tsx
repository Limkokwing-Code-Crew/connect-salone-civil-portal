import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { useTranslation } from "react-i18next";

export function OfflineBanner() {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const { t } = useTranslation();

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="bg-red-500/90 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2 backdrop-blur-sm fixed bottom-0 w-full z-50 animate-in fade-in slide-in-from-bottom-5">
            <WifiOff size={16} />
            <span>{t("common.offline") || "You are offline. Some features may not be available."}</span>
        </div>
    );
}
