"use client"

import { InputLib } from "@/app/component-library/molecules/input/input-lib";

export const INPUT_CODE_SEARCH = `const [search, setSearch] = useState('');

<InputLib
  placeholder="Rechercher..."
  value={search}
  onChange={setSearch}
/>`;

export const INPUT_CODE_WITH_LABEL = `<InputLib
  label="Nom"
  placeholder="Entrez un nom"
  value={name}
  onChange={setName}
/>`;

export const INPUT_CODE_DISABLED = `<InputLib
  label="Lecture seule"
  value="Read only value"
  onChange={() => {}}
  disabled
/>`;

export const getInputSections = (
    searchValue: string,
    setSearchValue: (value: string) => void,
    nameValue: string,
    setNameValue: (value: string) => void,
    disabledValue: string
) => [
    {
        title: "Recherche",
        code: INPUT_CODE_SEARCH,
        component: (
            <InputLib
                placeholder="Rechercher..."
                value={searchValue}
                onChange={setSearchValue}
            />
        )
    },
    {
        title: "Avec label",
        code: INPUT_CODE_WITH_LABEL,
        component: (
            <InputLib
                label="Nom"
                placeholder="Entrez un nom"
                value={nameValue}
                onChange={setNameValue}
            />
        )
    },
    {
        title: "Désactivé",
        code: INPUT_CODE_DISABLED,
        component: (
            <InputLib
                label="Lecture seule"
                value={disabledValue}
                onChange={() => {}}
                disabled
            />
        )
    }
];
