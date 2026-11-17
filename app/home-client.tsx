"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { useLegislature } from "@/app/(ui)/providers/legislature-provider";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { CardWall } from "@/app/(ui)/components/home/card-wall";

export default function HomeClient() {
    const { resolvedTheme } = useTheme();
    const { legislature } = useLegislature();
    const [mounted, setMounted] = useState(false);
    const [cards, setCards] = useState<DeputesCardDTO[]>([]);
    const legislatureNum = legislature?.number;

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!legislatureNum) return;
        deputesGateway
            .getDeputesCardsSample(legislatureNum)
            .then(setCards)
            .catch(console.error);
    }, [legislatureNum]);

    return (
        <div className="home">
            <div className="home__layout">
                <section className="home__hero">
                    <div className="h-24 flex items-center">
                        {mounted && (
                            <Image
                                src={
                                    resolvedTheme === "light"
                                        ? "/assets/imgs/ASS_DEX_LIGHT.svg"
                                        : "/assets/imgs/ASS_DEX_ACC.svg"
                                }
                                alt="Députédex - base de données des députés français"
                                width={160}
                                height={96}
                                priority
                            />
                        )}
                    </div>

                    {legislatureNum && <span className="page-pill">{legislatureNum}ème législature</span>}

                    <h1 className="home__title">Bienvenue sur Députédex</h1>
                    <p className="subtitle home__lead">
                        La base de données interactive des députés français : mandats, groupes
                        parlementaires, scrutins, votes et statistiques de l&apos;Assemblée nationale.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-1">
                        <Link href="/deputydex">
                            <ButtonLib text="Explorer les députés" variant="primary" size="large" />
                        </Link>
                        <Link href="/hemicycle">
                            <ButtonLib text="Voir l'hémicycle" variant="secondary" size="large" />
                        </Link>
                    </div>
                </section>

                <CardWall cards={cards} />
            </div>
        </div>
    );
}
