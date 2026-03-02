"use client"

import { AvatarLib } from "@/app/component-library/atoms/badge-avatar/avatar-picture-lib";

export const AVATAR_CODE_SIZES = `<div className="flex gap-6 items-center">
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
</div>`;

export const AVATAR_CODE_PICTURE = `<div className="flex gap-8">
  <AvatarLib name="Gabriel Attal" size="picture" />
  <AvatarLib 
    src="https://hostname.domain/monimage"
    name="Yaël Braun-Pivet" 
    size="picture" 
  />
</div>`;

export const AVATAR_CODE_WITH_IMAGE = `<AvatarLib
  src="https://hostname.domain/monimage"
  name="Député Example"
  size="medium"
/>`;

export const AVATAR_CODE_WITHOUT_IMAGE = `<div className="flex gap-4">
  <AvatarLib name="François Hollande" size="medium" />
  <AvatarLib name="Édouard Philippe" size="medium" />
  <AvatarLib name="Yaël Braun-Pivet" size="medium" />
</div>`;

export const AVATAR_CODE_BROKEN_IMAGE = `<AvatarLib
  src=""
  name="Jean Castex"
  size="medium"
/>`;

export const AVATAR_CODE_USE_CASE = `<div className="space-y-3">
  <div className="flex items-center gap-3">
    <AvatarLib name="Gabriel Attal" size="medium" />
    <div>
      <p className="font-semibold">Gabriel Attal</p>
      <p className="text-sm opacity-70">Renaissance • Hauts-de-Seine</p>
    </div>
  </div>
  {/* Répéter pour autres députés */}
</div>`;

export const getAvatarSections = () => [
    {
        title: "Sizes",
        code: AVATAR_CODE_SIZES,
        component: (
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
        )
    },
    {
        title: "Picture (format profil)",
        code: AVATAR_CODE_PICTURE,
        component: (
            <div className="flex gap-8 items-start">
                <AvatarLib
                    src="/nico.svg"
                    name="Gabriel Attal"
                    size="picture"
                />
            </div>
        )
    },
    {
        title: "Avec image",
        code: AVATAR_CODE_WITH_IMAGE,
        component: (
            <AvatarLib
                src="/nico.svg"
                name="Député Example"
                size="medium"
            />
        )
    },
    {
        title: "Sans image (initiales)",
        code: AVATAR_CODE_WITHOUT_IMAGE,
        component: (
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
        )
    },
    {
        title: "Image cassée (fallback auto)",
        code: AVATAR_CODE_BROKEN_IMAGE,
        component: (
            <AvatarLib
                name="Jean Castex"
                size="medium"
            />
        )
    },
    {
        title: "Cas d'usage (liste députés)",
        code: AVATAR_CODE_USE_CASE,
        component: (
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
        )
    }
];