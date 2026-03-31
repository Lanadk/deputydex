type SpinnerLibProps = {
    size?: number;
    className?: string;
};

export const SpinnerLib: React.FC<SpinnerLibProps> = ({ size = 32, className = "" }) => (
    <div
        className={`rounded-full border-2 border-main animate-spin ${className}`}
        style={{
            width: size,
            height: size,
            borderTopColor: "var(--accent)",
        }}
    />
);