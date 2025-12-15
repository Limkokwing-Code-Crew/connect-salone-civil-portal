export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-white/10 rounded-md ${className}`} />
    );
}

export function ServiceCardSkeleton() {
    return (
        <div className="glass-card p-6 h-[200px] flex flex-col justify-between">
            <div>
                <div className="flex justify-between mb-3">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex gap-4 mt-4">
                <Skeleton className="h-10 w-full rounded-xl" />
            </div>
        </div>
    );
}
