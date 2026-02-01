# 📚 Component Library - Architecture Data-Driven

## 🎯 Objectif

Ce document explique comment nous avons factorisé les pages de présentation de composants pour éviter la duplication de code et faciliter la maintenance.

## 🔄 Le Problème

Avant, chaque page de composant répétait la même structure :

```tsx
<div>
  <PageHeader title="..." subtitle="..." />
  <div className="space-y-8">
    <div>
      <h3>Section 1</h3>
      <div className="mt-4">
        <CodeBlock code={...}>
          <Component />
        </CodeBlock>
      </div>
    </div>
    <div>
      <h3>Section 2</h3>
      <div className="mt-4">
        <CodeBlock code={...}>
          <Component />
        </CodeBlock>
      </div>
    </div>
    {/* ... répété 5-10 fois */}
  </div>
</div>
```

**Problèmes** :
- ❌ 80+ lignes de JSX répétitif par page
- ❌ Structure dupliquée 10 fois dans le même fichier
- ❌ Difficile à maintenir (changer le style = modifier 10 endroits)
- ❌ Ajout d'une section = copier-coller tout le markup

## ✅ La Solution : Pattern Data-Driven

### Principe

Au lieu de répéter le JSX, on **configure les sections en data** et on les **map vers des composants**.

```tsx
// ❌ Avant (répétitif)
<div><h3>Title</h3><CodeBlock><Component /></CodeBlock></div>
<div><h3>Title</h3><CodeBlock><Component /></CodeBlock></div>
<div><h3>Title</h3><CodeBlock><Component /></CodeBlock></div>

// ✅ Après (data-driven)
const sections = [
  { title: "Title 1", code: CODE_1, component: <Component /> },
  { title: "Title 2", code: CODE_2, component: <Component /> },
  { title: "Title 3", code: CODE_3, component: <Component /> },
];

sections.map(section => <ComponentSectionCodeBlock {...section} />)
```

## 🏗️ Architecture

### 1. Templates (structure de page)

```tsx
// templates/page-content/page-content.tsx
export const PageContent = ({ children }) => (
  <div className="space-y-8">
    {children}
  </div>
);
```

### 2. Molecules (blocs réutilisables)

```tsx
// molecules/page-header/page-header.tsx
export const PageHeader = ({ title, subtitle }) => (
  <div className="mb-8">
    <h2>{title}</h2>
    <p className="subtitle mt-2">{subtitle}</p>
  </div>
);

// molecules/component-section-code-block/component-section-code-block.tsx
export const ComponentSectionCodeBlock = ({ title, code, children }) => (
  <div>
    <h3>{title}</h3>
    <div className="mt-4">
      <CodeBlock code={code}>
        {children}
      </CodeBlock>
    </div>
  </div>
);
```

### 3. Constants (configuration des sections)

```tsx
// atoms/button/button-lib.constants.ts
export const getButtonSections = (message, setMessage) => [
  {
    title: "Variants",
    code: BUTTON_CODE_VARIANTS,
    component: (
      <div className="flex gap-4">
        <ButtonLib text="Primary" variant="primary" />
        <ButtonLib text="Secondary" variant="secondary" />
        <ButtonLib text="Tertiary" variant="tertiary" />
      </div>
    )
  },
  {
    title: "Sizes",
    code: BUTTON_CODE_SIZES,
    component: (
      <div className="flex gap-4">
        <ButtonLib text="Small" size="small" />
        <ButtonLib text="Medium" size="medium" />
        <ButtonLib text="Large" size="large" />
      </div>
    )
  },
  // ... autres sections
];
```

### 4. Pages (juste du mapping)

```tsx
// atoms/button/page.tsx
export default function ButtonPage() {
  const [message, setMessage] = useState('');
  const sections = getButtonSections(message, setMessage);

  return (
    <div>
      <PageHeader
        title="Button"
        subtitle="Composant bouton avec différentes variantes et options"
      />

      <PageContent>
        {sections.map((section, index) => (
          <ComponentSectionCodeBlock
            key={index}
            title={section.title}
            code={section.code}
          >
            {section.component}
          </ComponentSectionCodeBlock>
        ))}
      </PageContent>
    </div>
  );
}
```

## 📊 Comparaison Avant/Après

### Avant (JSX répétitif)
- **100 lignes** de JSX par page
- Structure dupliquée 5-10 fois
- Modification = toucher 10 endroits

### Après (Data-driven)
- **25 lignes** dans la page
- Config centralisée dans `.constants.ts`
- Modification = changer 1 objet dans l'array

## 🎓 Comment Ajouter une Nouvelle Section ?

### Étape 1 : Ajoute le code d'exemple

```tsx
// button-lib.constants.ts
export const BUTTON_CODE_NEW_FEATURE = `<ButtonLib
  text="New Feature"
  newProp={true}
/>`;
```

### Étape 2 : Ajoute l'objet dans l'array

```tsx
export const getButtonSections = (message, setMessage) => [
  // ... sections existantes
  {
    title: "New Feature",
    code: BUTTON_CODE_NEW_FEATURE,
    component: <ButtonLib text="New Feature" newProp={true} />
  }
];
```

**C'est tout !** La page s'update automatiquement. ✅

## 🔧 Quand Utiliser ce Pattern ?

### ✅ Utilise Data-Driven POUR :
- Pages de documentation de composants (répétitives)
- Component library showcase
- Sections avec structure identique

### ❌ N'utilise PAS Data-Driven POUR :
- Pages métier de l'application
- Layouts uniques et complexes

## 📖 Exemple Complet Annoté

Voir le fichier [`atoms/button/page.tsx`](./atoms/button/page.tsx) pour un exemple complet avec annotations expliquant chaque partie.

## 🤔 Questions Fréquentes

**Q: Pourquoi passer `message` et `setMessage` en params ?**  
A: Certaines sections ont besoin du state React (ex: bouton avec onClick). On passe le state en paramètre pour l'utiliser dans les composants.

**Q: Pourquoi pas juste du JSX normal ?**  
A: Pour 2-3 sections, JSX normal suffit. Mais pour 10+ sections identiques, data-driven évite la duplication massive.

**Q: Comment débugger si une section crash ?**  
A: L'erreur pointera vers le `.map()` ligne X. Regarde l'index dans l'array pour identifier quelle section pose problème.

**Q: On peut réorganiser les sections facilement ?**  
A: Oui ! Change juste l'ordre dans l'array, pas besoin de toucher le JSX.

## 🚀 Composants Refactorisés

Pages utilisant ce pattern :
- ✅ Button
- ✅ Badge
- ✅ Avatar
- ✅ Span
- ✅ Input
- ✅ Select
- ✅ Toggle Switch
- ✅ Page Header
- ✅ Activity Calendar

## 💡 Tips

1. **Les constants doivent rester simples** 
2. **Si tu galères, ne fait pas de data driven, factoriser après création complète de la page** 
3. **Garde la logique dans les composants** : Pas dans les constants
4. **Si besoin de state** : Passe-le en paramètre à `getSections()`
5. **Un fichier par composant** : `button-lib.constants.ts`, `badge-lib.constants.ts`, etc.

---

**Créé pour faciliter la maintenance de la component library** 🎨
