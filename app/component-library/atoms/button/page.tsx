"use client"

import {ButtonLib} from "@/app/component-library/atoms/button/button-lib";
import {FaUser} from "react-icons/fa";
import {Plus} from "lucide-react";
import {useState} from "react";
import {CodeBlock} from "@/app/component-library/molecules/code-block/code-block";
import {
    BUTTON_CODE_VARIANTS,
    BUTTON_CODE_SIZES,
    BUTTON_CODE_LUCIDE_ICON,
    BUTTON_CODE_REACT_ICON,
    BUTTON_CODE_ON_CLICK
} from "@/app/component-library/atoms/button/button-lib.constants";
import {PageHeaderLib} from "@/app/component-library/molecules/page-header/page-header-lib";

export default function ButtonPage() {
    const [message, setMessage] = useState('');

    return (
        <div>
            <PageHeaderLib
                title="Button"
                subtitle="Composant bouton avec différentes variantes et options"
            />

            <div className="space-y-8">
                <div>
                    <h3>Variants</h3>
                    <div className="mt-4">
                        <CodeBlock code={BUTTON_CODE_VARIANTS}>
                            <div className="flex gap-4 flex-wrap">
                                <ButtonLib text="Primary" variant="primary" />
                                <ButtonLib text="Secondary" variant="secondary" />
                                <ButtonLib text="Tertiary" variant="tertiary" />
                            </div>
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Sizes</h3>
                    <div className="mt-4">
                        <CodeBlock code={BUTTON_CODE_SIZES}>
                            <div className="flex gap-4 items-center flex-wrap">
                                <ButtonLib text="Small" size="small" />
                                <ButtonLib text="Medium" size="medium" />
                                <ButtonLib text="Large" size="large" />
                            </div>
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>With Icon (Lucide)</h3>
                    <div className="mt-4">
                        <CodeBlock code={BUTTON_CODE_LUCIDE_ICON}>
                            <ButtonLib text="Add" icon={Plus}/>
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>With Icon (React Icons)</h3>
                    <div className="mt-4">
                        <CodeBlock code={BUTTON_CODE_REACT_ICON}>
                            <ButtonLib text="Profile" icon={FaUser}/>
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>With onClick</h3>
                    <div className="mt-4">
                        <CodeBlock code={BUTTON_CODE_ON_CLICK}>
                            <div className="space-y-2">
                                <ButtonLib
                                    text="Click Me"
                                    variant="primary"
                                    onClick={() => setMessage('Button clicked!')}
                                />
                                {message && (
                                    <p className="text-sm">{message}</p>
                                )}
                            </div>
                        </CodeBlock>
                    </div>
                </div>
            </div>
        </div>
    );
}