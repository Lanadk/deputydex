# Setup du projet

1. Copier `.env.local` → `.env` et configurer `DATABASE_URL`
2. Lancer Postgres Docker : `docker-compose up -d`
3. Installer les dépendances : `npm install`
4. Générer Prisma et migrer la DB : `npm run setup:db`
