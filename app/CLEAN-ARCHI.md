## Objectif

Avoir une architecture lisible pour :

- séparer le front, le serveur et la logique métier
- garder une structure simple
- tendre vers une clean architecture pragmatique
- éviter les dossiers fourre-tout

---

## Arborescence cible (Acteurs exemple)

```txt
app/
  api/
    acteurs/
      route.ts
    acteurs/
      export/
        route.ts

  (ui)/
    pages/
    views/
    components/
    gateways/
      acteurs/
        acteurs.gateway.ts
    providers/
      mui-provider.tsx
    component-library/
      molecules/
        filter-bar/
          filter-bar.tsx
          filter-bar.props.ts
          use-filter-bar.hook.ts
          filter-bar.query.ts
          filter-bar.operators.ts
          filter-bar.client-query.ts

  domains/
    acteurs/
      dto/
        acteur.dto.ts
      filters/
        acteurs.filters.ts
      repositories/
        acteurs.repository.ts
      gateways/
        IActeurs.gateway.ts
      use-cases/
        search-acteurs.use-case.ts
        export-acteurs.use-case.ts

  infrastructure/
    db/
      prisma/
        prisma.ts
    filtering/
      filter-bar-sanitize.ts
    acteurs/
      repositories/
        prisma-acteurs.repository.ts
      mappers/
        acteur.mapper.ts

  _shared/
    filtering/
      filter-bar.types.ts
    pagination/
      paginated-result.ts
    export/
      csv.ts
      export.types.ts
    utils/
      date.ts
```

---

## Responsabilité des dossiers

### `app/api`
Points d’entrée HTTP.

Contient :
- lecture du body
- valeurs par défaut
- appel du use case
- conversion en `NextResponse`
- injection des implémentations concrètes

Ne contient pas :
- logique Prisma
- logique métier complexe

---

### `app/(ui)`
Tout ce qui est rendu front et exécution navigateur.

Contient :
- pages
- vues
- composants
- providers React
- gateways HTTP côté front
- component-library interne au projet
- hooks

---

### `app/domains`
Le métier et les contrats de l’application.

Contient :
- DTO exposés au front
- contrats de repository
- contrats de gateway
- use cases
- configuration métier de filtres

Ne contient pas :
- Prisma
- `fetch`
- DOM
- composants React

---

### `app/infrastructure`
Les implémentations techniques.

Contient :
- Prisma
- repositories concrets
- mappers DB -> DTO
- sanitization serveur orientée usage backend

---

### `app/_shared`
Le partagé neutre.

Contient :
- types transverses
- pagination
- CSV pur
- helpers génériques de date

Ne contient pas :
- logique métier `acteurs`
- code React
- code Prisma

---

## Flux complet `acteurs`

### 1. UI
Un composant React déclenche une recherche.

Il appelle la gateway front :

```txt
app/(ui)/gateways/acteurs/acteurs.gateway.ts
```

---

### 2. Gateway front
La gateway fait un `fetch('/api/acteurs')`.

Elle implémente le contrat défini dans :

```txt
app/domains/acteurs/gateways/IActeurs.gateway.ts
```

Rôle :
- parler HTTP
- retourner le bon DTO
- masquer le détail du `fetch`

---

### 3. Route API
La route Next reçoit la requête.

Exemple :

```txt
app/api/acteurs/route.ts
```

Rôle :
- lire `query`, `page`, `pageSize`
- injecter le repository Prisma dans le use case
- retourner la réponse JSON

---

### 4. Use case
Le use case porte la logique applicative.

Exemple :

```txt
app/domains/acteurs/use-cases/search-acteurs.use-case.ts
```

Rôle :
- sanitization de la query
- calcul pagination
- appel repository via contrat
- mapping en DTO
- construction du résultat final

---

### 5. Repository
Le repository concret connaît Prisma.

Exemple :

```txt
app/infrastructure/acteurs/repositories/prisma-acteurs.repository.ts
```

Rôle :
- exécuter `prisma.acteurs.findMany`
- exécuter `prisma.acteurs.count`
- retourner les rows brutes

---

### 6. Mapper
Le mapper convertit la row DB en DTO exposé.

Exemple :

```txt
app/infrastructure/acteurs/mappers/acteur.mapper.ts
```

Flux :

```txt
Prisma row -> mapper -> ActeurDTO
```

---

## Cas particulier DTO

### `ActeurDTO`

Exemple :

```ts
export type ActeurDTO = {
  id: string;
  prenom: string | null;
  nom: string | null;
  professionCategorie: string | null;
  dateNaissance: string | null;
};
```

Règle :
- le DTO est le contrat exposé au front
- il ne doit pas reprendre les champs Prisma en snake_case si on peut l’éviter
- le mapping snake_case -> camelCase se fait dans l’infra

---

## FilterBar : comment le penser ?

`FilterBar` n’est pas une vraie librairie externe. C’est une component-library interne au projet.

Conséquence :
- ses types de query doivent être partagés au niveau app
- le composant les consomme
- ce n’est pas le composant qui possède la vérité du contrat global

### Types partagés

```txt
app/_shared/filtering/filter-bar.types.ts
```

Contient :
- `FilterBarQuery`
- `FilterField`
- `SortOption`
- `ActiveFieldFilter`
- `ApplyMode`

### Fichiers propres au composant

```txt
app/(ui)/component-library/molecules/filter-bar/
```

Contient :
- `filter-bar.tsx`
- `filter-bar.props.ts`
- `use-filter-bar.hook.ts`
- `filter-bar.query.ts`
- `filter-bar.operators.ts`
- `filter-bar.client-query.ts`

### Règle
- types de contrat = `_shared/filtering`
- logique interne du composant = `component-library/filter-bar`

---

## Filtres `acteurs`

Fichier :

```txt
app/domains/acteurs/filters/acteurs.filters.ts
```

Contient :
- `ACTEURS_FILTER_FIELDS`
- `ACTEURS_SORT_OPTIONS`

Rôle :
- décrire les filtres autorisés pour le domaine `acteurs`
- être utilisés par l’UI
- être utilisés par les use cases pour construire les options de sanitization

Note : actuellement les `field` ressemblent encore à des champs Prisma. C’est acceptable dans un premier temps. Plus tard, on pourra introduire un mapping domaine -> champ technique si besoin.

---

## Dépendances autorisées

### Autorisé

```txt
(ui) -> domains
(ui) -> _shared
(ui) -> (ui)/gateways
api -> domains/use-cases
api -> infrastructure uniquement pour injecter les implémentations concrètes (rare)
infrastructure -> domains
infrastructure -> _shared
domains -> _shared
```

### Interdit

```txt
domains -> (ui)
domains -> prisma directement
(ui) -> prisma
(ui) -> use-cases serveur directement
_shared -> React
_shared -> Prisma
```

---

## Exemple de lecture simple

### Search acteurs

```txt
UI page
  -> acteursGateway.search(...)
  -> /api/acteurs
  -> searchActeursUseCase(prismaActeursRepository, ...)
  -> prismaActeursRepository.search(...)
  -> prisma.acteurs.findMany / count
  -> mapActeursToDTO(...)
  -> réponse JSON
```

### Export acteurs

```txt
UI
  -> acteursGateway.export(...)
  -> /api/acteurs/export
  -> exportActeursUseCase(prismaActeursRepository, ...)
  -> prismaActeursRepository.findManyForExport(...)
  -> mapActeursToDTO(...)
  -> toCsv(...)
  -> réponse fichier
```

---

## Règles simples à retenir

1. `domains` définit, `infrastructure` implémente.
2. `api` orchestre l’entrée HTTP, mais ne porte pas le métier.
3. `(ui)` affiche et appelle des gateways.
4. les DTO exposés au front sont dans `domains`.
5. les mappers Prisma -> DTO sont dans `infrastructure`.
6. `_shared` ne contient que du neutre.
