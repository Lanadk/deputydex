"use client"

import { CheckboxLib } from "@/app/(ui)/component-library/molecules/checkbox/checkbox-lib";

export const CHECKBOX_CODE_BASIC = `const [checked, setChecked] = useState(false);

<CheckboxLib
  isChecked={checked}
  onToggle={() => setChecked(!checked)}
/>`;

export const CHECKBOX_CODE_LABEL = `const [checked, setChecked] = useState(true);

<CheckboxLib
  isChecked={checked}
  onToggle={() => setChecked(!checked)}
  label="Répartition par tranche d'âge"
/>`;

export const CHECKBOX_CODE_DISABLED = `<CheckboxLib
  isChecked={false}
  onToggle={() => {}}
  label="Indisponible pour l'instant"
  disabled
/>`;

export const CHECKBOX_CODE_LIST = `const [selected, setSelected] = useState<string[]>(["age"]);
const toggle = (id: string) =>
  setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

<div className="flex flex-col gap-2">
  <CheckboxLib isChecked={selected.includes("age")} onToggle={() => toggle("age")} label="Répartition par âge" />
  <CheckboxLib isChecked={selected.includes("parite")} onToggle={() => toggle("parite")} label="Parité" />
  <CheckboxLib isChecked={selected.includes("mandat")} onToggle={() => toggle("mandat")} label="Ancienneté du mandat" />
</div>`;

export const getCheckboxSections = (
    checked: boolean,
    setChecked: (value: boolean) => void,
    labelChecked: boolean,
    setLabelChecked: (value: boolean) => void,
    selected: string[],
    toggle: (id: string) => void
) => [
    {
        title: "Sans label",
        code: CHECKBOX_CODE_BASIC,
        component: (
            <CheckboxLib isChecked={checked} onToggle={() => setChecked(!checked)} />
        )
    },
    {
        title: "Avec label",
        code: CHECKBOX_CODE_LABEL,
        component: (
            <CheckboxLib
                isChecked={labelChecked}
                onToggle={() => setLabelChecked(!labelChecked)}
                label="Répartition par tranche d'âge"
            />
        )
    },
    {
        title: "Désactivé",
        code: CHECKBOX_CODE_DISABLED,
        component: (
            <CheckboxLib
                isChecked={false}
                onToggle={() => {}}
                label="Indisponible pour l'instant"
                disabled
            />
        )
    },
    {
        title: "Liste à sélection multiple",
        code: CHECKBOX_CODE_LIST,
        component: (
            <div className="flex flex-col gap-2">
                <CheckboxLib isChecked={selected.includes("age")} onToggle={() => toggle("age")} label="Répartition par âge" />
                <CheckboxLib isChecked={selected.includes("parite")} onToggle={() => toggle("parite")} label="Parité" />
                <CheckboxLib isChecked={selected.includes("mandat")} onToggle={() => toggle("mandat")} label="Ancienneté du mandat" />
            </div>
        )
    },
];
