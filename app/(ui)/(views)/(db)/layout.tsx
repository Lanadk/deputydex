import { LegislatureSelector } from "@/app/(ui)/components/legislature-selector/legislature-selector";
import {LegislatureProvider} from "@/app/(ui)/providers/legislature-provider";

export default function DBLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <LegislatureProvider>
                <LegislatureSelector />
                {children}
            </LegislatureProvider>
        </>
    );
}