import {LegislatureSelector} from "@/app/(ui)/components/legislature-selector/legislature-selector";

export default function DeputedexLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <LegislatureSelector />
            {children}
        </>
    );
}