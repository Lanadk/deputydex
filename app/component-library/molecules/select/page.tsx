"use client"

import { useState } from 'react'
import { CodeBlock } from "@/app/component-library/molecules/code-block/code-block"
import { SelectLib } from "@/app/component-library/molecules/select/select-lib"
import {
    SELECT_CODE_BASIC,
    SELECT_CODE_WITH_LABEL,
    SELECT_CODE_FILTER,
    SELECT_CODE_DISABLED
} from "@/app/component-library/molecules/select/select-lib.constants"
import {PageHeaderLib} from "@/app/component-library/molecules/page-header/page-header-lib";

const COUNTRIES = [
    { value: 'fr', label: 'France' },
    { value: 'us', label: 'États-Unis' },
    { value: 'uk', label: 'Royaume-Uni' },
    { value: 'de', label: 'Allemagne' },
    { value: 'es', label: 'Espagne' },
]

const CITIES = [
    { value: 'paris', label: 'Paris' },
    { value: 'lyon', label: 'Lyon' },
    { value: 'marseille', label: 'Marseille' },
    { value: 'toulouse', label: 'Toulouse' },
]

const CATEGORIES = [
    { value: 'tech', label: 'Technologie' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
]

export default function SelectPage() {
    const [country, setCountry] = useState('')
    const [city, setCity] = useState('')
    const [category, setCategory] = useState('')

    return (
        <div>
            <PageHeaderLib
                title="Select"
                subtitle="Composant select avec options dynamiques pour filtres et sélection"
            />

            <div className="space-y-8">
                <div>
                    <h3>Sans label</h3>
                    <div className="mt-4">
                        <CodeBlock code={SELECT_CODE_BASIC}>
                            <div className="w-1/2">
                                <SelectLib
                                    options={COUNTRIES}
                                    value={country}
                                    onChange={setCountry}
                                    placeholder="Choisir un pays"
                                />
                            </div>
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Avec label</h3>
                    <div className="mt-4">
                        <CodeBlock code={SELECT_CODE_WITH_LABEL}>
                            <div className="w-1/2">
                                <SelectLib
                                    label="Ville"
                                    options={CITIES}
                                    value={city}
                                    onChange={setCity}
                                    placeholder="Sélectionner une ville"
                                />
                            </div>
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Filtre par catégorie</h3>
                    <div className="mt-4">
                        <CodeBlock code={SELECT_CODE_FILTER}>
                            <div className="w-1/2">
                                <SelectLib
                                    label="Filtrer par catégorie"
                                    options={CATEGORIES}
                                    value={category}
                                    onChange={setCategory}
                                    placeholder="Toutes les catégories"
                                />
                            </div>
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Désactivé</h3>
                    <div className="mt-4">
                        <CodeBlock code={SELECT_CODE_DISABLED}>
                            <div className="w-1/2">
                                <SelectLib
                                    label="Lecture seule"
                                    options={COUNTRIES}
                                    value="fr"
                                    onChange={() => {}}
                                    disabled
                                />
                            </div>
                        </CodeBlock>
                    </div>
                </div>
            </div>
        </div>
    )
}