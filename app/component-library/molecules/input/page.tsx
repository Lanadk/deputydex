"use client"

import { useState } from 'react'
import { CodeBlock } from "@/app/component-library/molecules/code-block/code-block"
import { InputLib } from "@/app/component-library/molecules/input/input-lib"
import {
    INPUT_CODE_SEARCH,
    INPUT_CODE_FILTER,
    INPUT_CODE_WITH_LABEL,
    INPUT_CODE_DISABLED
} from "@/app/component-library/molecules/input/input-lib.constants"
import {PageHeaderLib} from "@/app/component-library/molecules/page-header/page-header-lib";

export default function InputPage() {
    const [searchValue, setSearchValue] = useState('')
    const [filterValue, setFilterValue] = useState('')
    const [nameValue, setNameValue] = useState('')
    const [disabledValue] = useState('Read only value')

    return (
        <div>
            <PageHeaderLib
                title="Input"
                subtitle="Composant input pour recherche, filtres et saisie"
            />

            <div className="space-y-8">
                <div>
                    <h3>Recherche</h3>
                    <div className="mt-4">
                        <CodeBlock code={INPUT_CODE_SEARCH}>
                            <InputLib
                                placeholder="Rechercher..."
                                value={searchValue}
                                onChange={setSearchValue}
                            />
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Avec label</h3>
                    <div className="mt-4">
                        <CodeBlock code={INPUT_CODE_WITH_LABEL}>
                            <InputLib
                                label="Nom"
                                placeholder="Entrez un nom"
                                value={nameValue}
                                onChange={setNameValue}
                            />
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Filtre + W1/2</h3>
                    <div className="mt-4">
                        <CodeBlock code={INPUT_CODE_FILTER}>
                            <InputLib
                                className="w-1/2"
                                label="Filtrer par ville"
                                placeholder="Paris, Lyon..."
                                value={filterValue}
                                onChange={setFilterValue}
                            />
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Désactivé</h3>
                    <div className="mt-4">
                        <CodeBlock code={INPUT_CODE_DISABLED}>
                            <InputLib
                                label="Lecture seule"
                                value={disabledValue}
                                onChange={() => {}}
                                disabled
                            />
                        </CodeBlock>
                    </div>
                </div>
            </div>
        </div>
    )
}