# 🏛️ DeputyDex

> Base de données interactive des députés français

![nextjs](https://img.shields.io/badge/Next.js-16-black)
![typescript](https://img.shields.io/badge/TypeScript-3178C6)
![tailwind](https://img.shields.io/badge/TailwindCSS-38BDF8)
![vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)

## 📊 Données en temps réel

Les données sont automatiquement mises à jour **chaque jour** via GitHub Actions.

Sources :
- 🇫🇷 [API Assemblée Nationale](https://data.assemblee-nationale.fr)
- 👥 [NosDéputés.fr](https://www.nosdeputes.fr)

## 🚀 Stack Technique

- **Framework**: Next.js 16 + TypeScript
- **Styling**: Tailwind CSS
- **Data Pipeline**: GitHub Actions + Scripts ETL
- **Hosting**: Vercel
- **Data**: API publiques

## 🛠️ Développement Local
```bash
# Installation
npm install

# Générer les données
npm run data:generate

# Dev server
npm run dev
```

## 📈 Stats du Projet

- **XXX députés** référencés
- **Mise à jour quotidienne** automatique
- **Open Source** et données publiques

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésite pas à :
- 🐛 Signaler des bugs
- 💡 Proposer des features
- 🔧 Soumettre des PRs

## 📜 License

TODO © 2026 TODO
```

---
### **Vercel détecte automatiquement tes push**
```
Push sur main
↓
GitHub Actions update data
↓
Commit public/data/*.json
↓
Vercel détecte le commit
↓
Build + Deploy automatique
↓
Site à jour ! ✨