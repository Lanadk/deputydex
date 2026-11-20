import {ScrutinResultDTO} from "@/app/domains/scrutins/dto/scrtins-result.dto";
import {VotesResultDTO} from "@/app/domains/votes/dto/votes-result.dto";
import {SummaryListItem} from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";

type TResult = ScrutinResultDTO["position"] | VotesResultDTO["position"];

// Omit distributif : garde la distinction badge | value de l'union.
type SummaryListItemContent = SummaryListItem extends infer T ? (T extends unknown ? Omit<T, "label"> : never) : never;

export const positionToBadge = (position: TResult): SummaryListItemContent => {
    switch (position) {
        case "pour":
            return {badge: {text: "Pour", variant: "primary"}};

        case "contre":
            return {badge: {text: "Contre", variant: "secondary"}};

        case "abstention":
            return {badge: {text: "Abst.", variant: "tertiary"}};

        case "non-votant":
            return {badge: {text: "Non-votant", variant: "tertiary"}};

        default:
            return {value: "-"};
    }
};
