"use client"

import { CodeBlock } from "@/app/component-library/molecules/code-block/code-block"
import {
    AVATAR_CODE_BROKEN_IMAGE, AVATAR_CODE_PICTURE,
    AVATAR_CODE_SIZES,
    AVATAR_CODE_USE_CASE, AVATAR_CODE_WITH_IMAGE, AVATAR_CODE_WITHOUT_IMAGE
} from "@/app/component-library/atoms/badge-avatar/avatar-picture-lib.constants";
import {AvatarLib} from "@/app/component-library/atoms/badge-avatar/avatar-picture-lib";
import {PageHeaderLib} from "@/app/component-library/molecules/page-header/page-header-lib";

export default function AvatarPage() {
    return (
        <div>
            <PageHeaderLib
                title="Avatar"
                subtitle="Composant avatar rond avec photo ou initiales en fallback"
            />

            <div className="space-y-8">
                <div>
                    <h3>Sizes</h3>
                    <div className="mt-4">
                        <CodeBlock code={AVATAR_CODE_SIZES}>
                            <div className="flex gap-6 items-center">
                                <AvatarLib
                                    src="/nico.svg"
                                    name="Emmanuel Macron"
                                    size="small"
                                />
                                <AvatarLib
                                    src="/nico.svg"
                                    name="Marine Le Pen"
                                    size="medium"
                                />
                                <AvatarLib
                                    src="/nico.svg"
                                    name="Jean Lassalle"
                                    size="large"
                                />
                            </div>
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Picture (format profil)</h3>
                    <div className="mt-4">
                        <CodeBlock code={AVATAR_CODE_PICTURE}>
                            <div className="flex gap-8 items-start">
                                <AvatarLib
                                    src="/nico.svg"
                                    name="Gabriel Attal"
                                    size="picture"
                                />
                            </div>
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Avec image</h3>
                    <div className="mt-4">
                        <CodeBlock code={AVATAR_CODE_WITH_IMAGE}>
                            <AvatarLib
                                src="/nico.svg"
                                name="Député Example"
                                size="medium"
                            />
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Sans image (initiales)</h3>
                    <div className="mt-4">
                        <CodeBlock code={AVATAR_CODE_WITHOUT_IMAGE}>
                            <div className="flex gap-4">
                                <AvatarLib
                                    name="François Hollande"
                                    size="medium"
                                />
                                <AvatarLib
                                    name="Édouard Philippe"
                                    size="medium"
                                />
                                <AvatarLib
                                    name="Yaël Braun-Pivet"
                                    size="medium"
                                />
                            </div>
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Image cassée (fallback auto)</h3>
                    <div className="mt-4">
                        <CodeBlock code={AVATAR_CODE_BROKEN_IMAGE}>
                            <AvatarLib
                                name="Jean Castex"
                                size="medium"
                            />
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Cas usage (liste députés)</h3>
                    <div className="mt-4">
                        <CodeBlock code={AVATAR_CODE_USE_CASE}>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <AvatarLib
                                        src="/nico.svg"
                                        name="Gabriel Attal"
                                        size="medium"
                                    />
                                    <div>
                                        <p className="font-semibold">Gabriel Attal</p>
                                        <p className="text-sm opacity-70">Renaissance • Hauts-de-Seine</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <AvatarLib
                                        src="/nico.svg"
                                        name="Mathilde Panot"
                                        size="medium"
                                    />
                                    <div>
                                        <p className="font-semibold">Mathilde Panot</p>
                                        <p className="text-sm opacity-70">LFI • Val-de-Marne</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <AvatarLib
                                        src="/nico.svg"
                                        name="Éric Ciotti"
                                        size="medium"
                                    />
                                    <div>
                                        <p className="font-semibold">Éric Ciotti</p>
                                        <p className="text-sm opacity-70">LR • Alpes-Maritimes</p>
                                    </div>
                                </div>
                            </div>
                        </CodeBlock>
                    </div>
                </div>
            </div>
        </div>
    )
}