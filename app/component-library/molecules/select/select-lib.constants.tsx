"use client"

import { SelectLib } from "@/app/component-library/molecules/select/select-lib";

export const SELECT_CODE_BASIC = `const [country, setCountry] = useState('');

const countries = [
  { value: 'fr', label: 'France' },
  { value: 'us', label: 'États-Unis' },
  { value: 'uk', label: 'Royaume-Uni' },
];

<SelectLib
  options={countries}
  value={country}
  onChange={setCountry}
  placeholder="Choisir un pays"
/>`;

export const SELECT_CODE_WITH_LABEL = `const [city, setCity] = useState('');

const cities = [
  { value: 'paris', label: 'Paris' },
  { value: 'lyon', label: 'Lyon' },
  { value: 'marseille', label: 'Marseille' },
];

<SelectLib
  label="Ville"
  options={cities}
  value={city}
  onChange={setCity}
  placeholder="Sélectionner une ville"
/>`;

export const SELECT_CODE_FILTER = `const [category, setCategory] = useState('');

const categories = [
  { value: 'tech', label: 'Technologie' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
];

<SelectLib
  label="Filtrer par catégorie"
  options={categories}
  value={category}
  onChange={setCategory}
  placeholder="Toutes les catégories"
/>`;

export const SELECT_CODE_DISABLED = `<SelectLib
  label="Lecture seule"
  options={countries}
  value="fr"
  onChange={() => {}}
  disabled
/>`;

export const COUNTRIES = [
    { value: 'fr', label: 'France' },
    { value: 'us', label: 'États-Unis' },
    { value: 'uk', label: 'Royaume-Uni' },
    { value: 'de', label: 'Allemagne' },
    { value: 'es', label: 'Espagne' },
];
export const CITIES = [
    { value: 'paris', label: 'Paris' },
    { value: 'lyon', label: 'Lyon' },
    { value: 'marseille', label: 'Marseille' },
    { value: 'toulouse', label: 'Toulouse' },
];
export const CATEGORIES = [
    { value: 'tech', label: 'Technologie' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
];

export const getSelectSections = (
    country: string,
    setCountry: (value: string) => void,
    city: string,
    setCity: (value: string) => void,
    category: string,
    setCategory: (value: string) => void
) => [
    {
        title: "Sans label",
        code: SELECT_CODE_BASIC,
        component: (
            <div className="w-1/2">
                <SelectLib
                    options={COUNTRIES}
                    value={country}
                    onChange={setCountry}
                    placeholder="Choisir un pays"
                />
            </div>
        )
    },
    {
        title: "Avec label",
        code: SELECT_CODE_WITH_LABEL,
        component: (
            <div className="w-1/2">
                <SelectLib
                    label="Ville"
                    options={CITIES}
                    value={city}
                    onChange={setCity}
                    placeholder="Sélectionner une ville"
                />
            </div>
        )
    },
    {
        title: "Filtre par catégorie",
        code: SELECT_CODE_FILTER,
        component: (
            <div className="w-1/2">
                <SelectLib
                    label="Filtrer par catégorie"
                    options={CATEGORIES}
                    value={category}
                    onChange={setCategory}
                    placeholder="Toutes les catégories"
                />
            </div>
        )
    },
    {
        title: "Désactivé",
        code: SELECT_CODE_DISABLED,
        component: (
            <div className="w-1/2">
                <SelectLib
                    label="Lecture seule"
                    options={COUNTRIES}
                    value="fr"
                    onChange={() => {}}
                    disabled
                />
            </div>
        )
    }
];