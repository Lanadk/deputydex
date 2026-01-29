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