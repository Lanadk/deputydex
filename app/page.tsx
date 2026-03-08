import Link from "next/link";
import {ButtonLib} from "@/app/(ui)/component-library/atoms/button/button-lib";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-8">
            <h1>Bienvenue</h1>
            <div className="flex gap-4">
                <Link href="/deputydex">
                    <ButtonLib text="DeputeDex" variant="primary" size="large" />
                </Link>
                <Link href="/globaldb/deputies">
                    <ButtonLib text="Global DB" variant="secondary" size="large" />
                </Link>
            </div>
        </div>
    );
}