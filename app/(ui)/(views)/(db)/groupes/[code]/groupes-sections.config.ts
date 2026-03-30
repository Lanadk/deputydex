import {AnchorSection} from "@/app/(ui)/component-library/template/anchor-section/anchor.types";
import {SectionBlock} from "@/app/(ui)/component-library/template/block-section/block-section-renderer";


export interface GroupesSection extends AnchorSection {
    description: string;
    cols: 1 | 2 | 3 | 4;
    blocks: SectionBlock[];
}


export const GROUPES_SECTIONS: GroupesSection[] = [

];