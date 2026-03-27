import React from "react";

interface BaseLayoutLibProps {
    children: React.ReactNode;
}

export const BaseLayout: React.FC<BaseLayoutLibProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
                {children}
            </div>
        </div>
    );
};