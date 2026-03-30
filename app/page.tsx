"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";

export default function Home() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-8">
            <div className="h-35 flex items-center justify-center">
                {mounted && (
                    <Image
                        src={
                            resolvedTheme === "light"
                                ? "/assets/imgs/ASS_DEX_LIGHT.svg"
                                : "/assets/imgs/ASS_DEX_ACC.svg"
                        }
                        alt="ASS DEX"
                        width={250}
                        height={250}
                        priority
                    />
                )}
            </div>

            <h1>Bienvenue</h1>

            <div className="flex gap-4">
                <Link href="/deputydex">
                    <ButtonLib text="DeputeDex" variant="primary" size="large" />
                </Link>
                <Link href="/groupes">
                    <ButtonLib text="Global DB" variant="secondary" size="large" />
                </Link>
            </div>
        </div>
    );
}