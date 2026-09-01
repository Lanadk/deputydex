# NOTICE — périmètre de la licence

Ce fichier précise ce que couvre (et ne couvre pas) la licence [`LICENSE`](./LICENSE)
(GNU AGPL-3.0) de ce dépôt. En cas de contradiction, la page
[Mentions légales](https://deputydex.fr/mentions-legales) du site fait foi pour le
public ; ce fichier fait foi pour les contributeurs et réutilisateurs du code.

## Ce qui est sous licence AGPL-3.0

- Tout le code source applicatif de ce dépôt (`app/`, y compris la couche domaine,
  l'infrastructure, les routes API et la couche présentation), **y compris la
  librairie de composants** `app/(ui)/component-library/`.
- Toute personne peut lire, auditer, forker et modifier ce code. Toute
  personne qui déploie une version modifiée de ce code, y compris pour la
  faire tourner comme service accessible publiquement (obligation propre à
  l'AGPL, contrairement à une GPL classique), doit republier le code source
  correspondant sous la même licence.

## Ce qui est explicitement exclu de l'AGPL-3.0

- **`app/(ui)/component-library/external/`** — composants adaptés depuis des
  sources tierces (ex. bibliothèques de composants externes). Ces fichiers
  restent régis par la licence de leur auteur d'origine, pas par l'AGPL-3.0.
  Toute autre dépendance tierce listée dans `package.json` reste également
  régie par sa propre licence (indiquée dans son propre `LICENSE`/`package.json`),
  telle quelle : l'AGPL-3.0 de ce dépôt ne la remplace ni ne la modifie.
- **La marque, le nom « Députédex » et le logo associé** ne sont pas couverts
  par cette licence de code. L'AGPL-3.0 porte sur le droit d'auteur du code,
  pas sur le droit des marques : forker ce dépôt n'autorise pas à réutiliser
  le nom, le logo ou l'identité visuelle « Députédex » pour un autre service,
  a fortiori un service concurrent. Un fork doit se présenter sous un autre
  nom et une autre identité visuelle.
- **Les contenus éditoriaux et la charte graphique propres au site**
  (textes, visuels, illustrations, mise en page hors composants de code)
  qui ne sont pas eux-mêmes du code source restent soumis aux mentions de
  la page [Mentions légales](https://deputydex.fr/mentions-legales)
  (« tous droits réservés » sauf mention contraire).
- **Les données parlementaires affichées** (députés, groupes, mandats,
  scrutins, votes) ne sont ni notre code ni notre propriété : elles
  proviennent de l'open data de l'Assemblée nationale sous
  [Licence Ouverte / Open Licence Etalab](https://www.etalab.gouv.fr/licence-ouverte-open-licence/)
  et restent réutilisables selon les termes de cette licence, indépendamment
  de l'AGPL-3.0 appliquée au code de ce dépôt.
