import { config } from "dotenv"
import { existsSync } from "fs"
import { PrismaClient } from '../generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { DEV_PERF_ENABLED } from '@/app/_shared/dev-perf/dev-perf.config'
import { devPerfPrismaExtension } from '@/app/_shared/dev-perf/dev-perf.server'

if (existsSync('.env.local')) {
    config({ path: '.env.local' })
}

const pool = new Pool({
    connectionString: process.env.DB_URL,
})

const adapter = new PrismaPg(pool)

const client = new PrismaClient({
    adapter,
})

// Outil de perf (dev seulement, NEXT_PUBLIC_DEV_PERF=true) : chronomètre chaque
// requête SQL et la rattache à l'appel d'API en cours. Désactivé : client brut.
// Le client étendu expose la même API ; le cast garde le type d'origine pour les repositories.
const prisma = (DEV_PERF_ENABLED ? client.$extends(devPerfPrismaExtension) : client) as PrismaClient

export { prisma }