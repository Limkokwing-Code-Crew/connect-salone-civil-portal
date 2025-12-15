import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Modal } from "@/components/Modal";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface FeedbackModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submitFeedback = useMutation(api.feedback.submitFeedback);
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;

        setIsSubmitting(true);
        try {
            await submitFeedback({ rating, comment });
            toast.success(t("common.success"));
            onOpenChange(false);
            setRating(0);
            setComment("");
        } catch (error) {
            toast.error(t("common.error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={t("feedback")}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center gap-2">
                    <label className="text-sm font-medium text-muted-foreground">
                        Rate your experience
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`p-1 transition-transform hover:scale-110 ${rating >= star ? "text-yellow-400" : "text-gray-300 dark:text-gray-700"
                                    }`}
                            >
                                <Star
                                    size={32}
                                    fill={rating >= star ? "currentColor" : "none"}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                        Comments (optional)
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="textarea w-full"
                        placeholder="Tell us what you think..."
                        rows={3}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        {t("common.cancel")}
                    </button>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={rating === 0 || isSubmitting}
                    >
                        {isSubmitting ? t("common.loading") : t("common.send")}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
