import { config } from "dotenv"
import { existsSync } from "fs"
import { PrismaClient } from '../generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

if (existsSync('.env.local')) {
    config({ path: '.env.local' })
}

const pool = new Pool({
    connectionString: process.env.DB_URL,
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
    adapter,
})

export { prisma }