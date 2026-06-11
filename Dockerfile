FROM node:22-alpine AS builder

WORKDIR /app

# Copie les fichiers de dépendances en premier (cache Docker)
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Copie le reste du code
COPY . .

# Le .env est injecté par Ansible au moment du build
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Crée un user non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copie uniquement ce qui est nécessaire pour tourner
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]