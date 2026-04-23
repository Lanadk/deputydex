import { LucideIcon } from "lucide-react";
import {IconType} from "react-icons";
import {
    BlockDataWrapper,
    SectionBlock
} from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";

export interface AnchorSection {
    id: string;
    label: string;
    icon: LucideIcon | IconType;
}

export interface PageSection extends AnchorSection {
    description?: string;
    cols: 1 | 2 | 3 | 4;
    blocks: SectionBlock<any>[];
    gatewayFn?: (params: Record<string, unknown>) => Promise<Record<string, BlockDataWrapper>>;
    lazy?: boolean;
}