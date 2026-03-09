import { LegislatureSelector } from "@/app/(ui)/components/legislature-selector/legislature-selector";

export default function DBLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <LegislatureSelector />
            {children}
        </>
    );
}