# Contribuer à deputydex-front

Merci de l'intérêt porté à Députédex ! Ce dépôt est le front/API de
l'écosystème (voir aussi [`deputydex-data`](https://github.com/Lanadk/deputydex-data),
l'ETL qui calcule les données). La page [/contribute](https://deputydex.fr/contribute)
du site donne une vue d'ensemble accessible des deux dépôts ; ce fichier est
la référence technique côté contribution pour celui-ci.

## Comment contribuer

- 🐛 **Bug** (chiffre qui semble faux, comportement inattendu) → ouvrez une
  [issue](https://github.com/Lanadk/deputydex/issues/new) détaillée : URL de
  la page, comportement attendu vs observé, capture d'écran si utile.
- 💡 **Idée / amélioration** → même chose, en précisant le cas d'usage.
- 🔧 **Pull request** → forkez le repo, créez une branche depuis `main`,
  ouvrez la PR. Pas besoin de discuter au préalable pour un fix évident ;
  pour un changement structurant, une issue en amont évite le travail perdu.

## Avant d'ouvrir une PR

- Lisez [`CLAUDE.md`](./CLAUDE.md) — c'est la référence de l'architecture
  (Clean/Hexagonal, Result pattern, config-driven sections, etc.) et des
  conventions du repo.
- `npm run lint` et `npm test` doivent passer.
- Respectez la structure existante d'un domaine (`entities/`, `dto/`,
  `mappers/`, `repositories/`, `use-cases/`, `gateways/`) plutôt que d'en
  inventer une nouvelle — voir le domaine `groupes` comme référence.
- Pour un nouveau composant d'UI, ajoutez sa démo (`constants` + `page.tsx`)
  dans la component library et référencez-la dans
  `component-library/page.tsx`, comme les composants existants.

## Licence de vos contributions

Ce dépôt est sous licence [GNU AGPL-3.0](./LICENSE) (voir
[`NOTICE.md`](./NOTICE.md) pour le détail du périmètre). En ouvrant une pull
request, vous acceptez que votre contribution soit distribuée sous cette
même licence — comme le veut l'usage standard sur GitHub (« inbound =
outbound »). Il n'y a pas de CLA (Contributor License Agreement) à signer.

## Ce qu'une contribution ne couvre pas

Le nom « Députédex », son logo et son identité visuelle ne sont pas
couverts par la licence de code : un fork de ce dépôt ne donne pas le droit
de les réutiliser pour un autre site ou service. Voir la section
[Propriété intellectuelle](https://deputydex.fr/mentions-legales#propriete-intellectuelle)
des mentions légales.

## Questions

Pour toute question qui ne rentre pas dans une issue GitHub :
[contact@ottmanbecuwe.com](mailto:contact@ottmanbecuwe.com).
