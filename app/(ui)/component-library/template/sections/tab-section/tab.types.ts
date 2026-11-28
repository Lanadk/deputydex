import { AnchorSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";

/** Un onglet de TabLayout et ses sections (sous-thèmes), dans l'ordre d'affichage. */
export type TabDefinition<S extends AnchorSection = AnchorSection> = AnchorSection & { sections: S[] };

/** Ids DOM liant un onglet à son panneau (aria-controls / aria-labelledby). */
export const tabId = (tabKey: string) => `tab-${tabKey}`;
export const tabPanelId = (tabKey: string) => `tabpanel-${tabKey}`;
