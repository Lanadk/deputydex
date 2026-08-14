# 🏛️ DeputyDex

> Base de données interactive des députés français

![nextjs](https://img.shields.io/badge/Next.js-16-black)
![typescript](https://img.shields.io/badge/TypeScript-3178C6)
![tailwind](https://img.shields.io/badge/TailwindCSS-38BDF8)
![prisma](https://img.shields.io/badge/Prisma-Postgres-2D3748)
![vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)

## 📊 Données

Sources :
- 🇫🇷 [Assemblée Nationale](https://data.assemblee-nationale.fr)

Les données sont stockées en **Postgres** et lues via **Prisma** — ce ne sont pas des fichiers JSON commités dans ce repo. Le schéma (`app/infrastructure/db/prisma/schema.prisma`) est synchronisé depuis un repo séparé (`deputydex-data`), et le rafraîchissement des données est géré par un pipeline externe à ce repo.

## 🚀 Stack Technique

- **Framework**: Next.js 16 + TypeScript
- **Styling**: Tailwind CSS
- **Data**: Postgres + Prisma (client généré dans `app/infrastructure/db/generated/prisma`)
- **Architecture**: Clean/Hexagonal (voir [`CLAUDE.md`](./CLAUDE.md) pour le détail)
- **Hosting**: Vercel

## 🛠️ Développement Local

```bash
# Installation
npm install

# Variables d'env nécessaires (.env.local) :
# DB_HOST, DB_PORT, DB_NAME, DB_USER_READER, DB_PASSWORD_READER
# (voir app/infrastructure/db/prisma/prisma.ts pour le détail de la connexion)

# Générer le client Prisma
npm run prisma:generate

# Dev server (127.0.0.1)
npm run dev
```

### Autres commandes

```bash
npm run build            # prisma generate && next build
npm run start             # démarre le build de prod (nécessite un build préalable)
npm run lint               # eslint
npm test                    # jest
npm run test:watch          # jest --watch
npm run test:coverage       # jest --coverage
```

## 🔁 CI/CD

`.github/workflows/ci.yml` tourne sur chaque push vers `main` :

```
lint + test → build → déploiement Vercel (preview, gate de validation) → trigger deploy prod (deputydex-cd)
```

Chaque étape dépend de la précédente : si les tests, le build ou le déploiement preview échouent, le déploiement prod n'est jamais déclenché. Ce pipeline ne gère que le déploiement de l'app — pas le rafraîchissement des données (voir ci-dessus).

## 📚 Documentation d'architecture

- [`CLAUDE.md`](./CLAUDE.md) — vue d'ensemble de l'architecture, commandes, conventions
- [`app/1.CLEAN-ARCHI_server_side.md`](./app/1.CLEAN-ARCHI_server_side.md)
- [`app/2.RESULT-PATTERN_server_side.md`](./app/2.RESULT-PATTERN_server_side.md)
- [`app/3.DATA-DRIVER_client_side.md`](./app/3.DATA-DRIVER_client_side.md)
- [`app/4.CONFIG-DRIVEN_client_side.md`](./app/4.CONFIG-DRIVEN_client_side.md)
- [`app/5.API-CACHE-STRATEGY.md`](./app/5.API-CACHE-STRATEGY.md)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésite pas à :
- 🐛 Signaler des bugs
- 💡 Proposer des features
- 🔧 Soumettre des PRs
