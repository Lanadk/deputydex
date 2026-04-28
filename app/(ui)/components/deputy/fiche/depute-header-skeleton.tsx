import React from "react";

export const DeputeHeaderSkeleton: React.FC = () => {
    return (
        <div className="relative w-full rounded-xl p-4 sm:p-6 overflow-hidden animate-pulse">
            <div className="absolute top-0 left-0 h-3 w-full bg-gray-200 rounded-t-xl" />
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-2">
                <div className="w-32 h-40 rounded-xl bg-gray-200 shrink-0 self-center sm:self-start" />
                <div className="flex flex-col flex-1 gap-4 p-2">
                    <div className="h-8 w-64 bg-gray-200 rounded" />
                    <div className="h-4 w-80 bg-gray-200 rounded" />
                    <div className="flex gap-2">
                        <div className="h-6 w-16 bg-gray-200 rounded-full" />
                        <div className="h-6 w-24 bg-gray-200 rounded-full" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded-lg" />
                ))}
            </div>
        </div>
    );
};
