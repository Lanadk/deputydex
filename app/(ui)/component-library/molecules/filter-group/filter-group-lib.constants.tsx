"use client"

import { FilterGroupLib } from "@/app/(ui)/component-library/molecules/filter-group/filter-group-lib";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";

export const FILTER_GROUP_CODE_BASIC = `<FilterGroupLib label="Législature">
  <ButtonLib text="16ᵉ législature" size="small" variant="primary" onClick={() => {}} />
  <ButtonLib text="17ᵉ législature" size="small" variant="tertiary" onClick={() => {}} />
</FilterGroupLib>`;

export const FILTER_GROUP_CODE_MULTIPLE = `<div className="flex flex-col gap-3">
  <FilterGroupLib label="Portée">
    <ButtonLib text="Un groupe précis" size="small" variant="secondary" onClick={() => {}} />
    <ButtonLib text="Tous les groupes" size="small" variant="primary" onClick={() => {}} />
  </FilterGroupLib>

  <FilterGroupLib label="Législature">
    <ButtonLib text="16ᵉ législature" size="small" variant="tertiary" onClick={() => {}} />
    <ButtonLib text="17ᵉ législature" size="small" variant="primary" onClick={() => {}} />
  </FilterGroupLib>
</div>`;

export const getFilterGroupSections = () => [
    {
        title: "Un seul groupe",
        code: FILTER_GROUP_CODE_BASIC,
        component: (
            <FilterGroupLib label="Législature">
                <ButtonLib text="16ᵉ législature" size="small" variant="primary" onClick={() => {}} />
                <ButtonLib text="17ᵉ législature" size="small" variant="tertiary" onClick={() => {}} />
            </FilterGroupLib>
        ),
    },
    {
        title: "Plusieurs groupes empilés — séparation claire entre chaque filtre",
        code: FILTER_GROUP_CODE_MULTIPLE,
        component: (
            <div className="flex flex-col gap-3">
                <FilterGroupLib label="Portée">
                    <ButtonLib text="Un groupe précis" size="small" variant="secondary" onClick={() => {}} />
                    <ButtonLib text="Tous les groupes" size="small" variant="primary" onClick={() => {}} />
                </FilterGroupLib>

                <FilterGroupLib label="Législature">
                    <ButtonLib text="16ᵉ législature" size="small" variant="tertiary" onClick={() => {}} />
                    <ButtonLib text="17ᵉ législature" size="small" variant="primary" onClick={() => {}} />
                </FilterGroupLib>
            </div>
        ),
    },
];
