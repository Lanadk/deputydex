import { useEffect, useState } from "react";
import { SectionBlock } from "@/app/(ui)/component-library/template/block-section/block-section-renderer";

type BlockData = Record<string, unknown> | unknown[];

/**
export function useSectionData(blocks: SectionBlock[], legislature: number) {
    const [dataMap, setDataMap] = useState<Record<string, BlockData>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);

        // Collecte tous les blocks qui ont une gatewayFn
        const fetchables = blocks.flatMap((block) => {
            switch (block.type) {
                case "chart":
                    return [{ id: block.config.id, fn: () => block.config.gatewayFn(legislature) }];
                case "card":
                    return [{ id: block.config.id, fn: () => block.config.gatewayFn(legislature) }];
                case "activity-calendar":
                    return [{ id: block.config.id, fn: () => block.config.gatewayFn(legislature) }];
                case "table":
                    return [{ id: block.id, fn: () => block.gatewayFn(legislature) }];
                default:
                    return [];
            }
        });

        // Un seul Promise.all par section
        Promise.all(
            fetchables.map(({ id, fn }) =>
                fn().then((data) => ({ id, data }))
            )
        )
            .then((results) => {
                const map: Record<string, BlockData> = {};
                results.forEach(({ id, data }) => { map[id] = data; });
                setDataMap(map);
            })
            .finally(() => setLoading(false));

    }, [legislature]);

    return { dataMap, loading };
} */