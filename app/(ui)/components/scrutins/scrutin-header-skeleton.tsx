import React from "react";

export const ScrutinHeaderSkeleton: React.FC = () => {
    return (
        <div className="relative w-full rounded-xl p-4 sm:p-6 overflow-hidden animate-pulse">
            <div className="absolute top-0 left-0 h-3 w-full bg-surface-3 rounded-t-xl" />
            <div className="flex flex-col gap-4 p-2 mt-2">
                <div className="h-8 w-56 bg-surface-3 rounded" />
                <div className="h-5 w-full max-w-2xl bg-surface-3 rounded" />
                <div className="flex gap-2">
                    <div className="h-6 w-24 bg-surface-3 rounded-full" />
                    <div className="h-6 w-40 bg-surface-3 rounded-full" />
                    <div className="h-6 w-32 bg-surface-3 rounded-full" />
                </div>
            </div>
        </div>
    );
};
