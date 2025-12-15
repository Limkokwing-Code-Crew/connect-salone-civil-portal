import React, { Component, ErrorInfo, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { LiquidBackground } from "./LiquidBackground";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return <ErrorView error={this.state.error} onReset={() => this.setState({ hasError: false, error: null })} />;
        }

        return this.props.children;
    }
}

function ErrorView({ error, onReset }: { error: Error | null; onReset: () => void }) {
    // We can't use hooks like useTranslation directly in Class component securely without wrapper,
    // but ErrorView is functional.
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <LiquidBackground />
            <div className="glass-card p-8 max-w-md w-full text-center relative z-10">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold mb-2">{t("common.error") || "Something went wrong"}</h1>
                <p className="text-muted-foreground mb-6">
                    {error?.message || "An unexpected error occurred."}
                </p>
                <button className="btn-primary w-full justify-center" onClick={() => window.location.reload()}>
                    Reload Page
                </button>
                <button className="btn-ghost w-full justify-center mt-2" onClick={onReset}>
                    Try again
                </button>
            </div>
        </div>
    );
}
