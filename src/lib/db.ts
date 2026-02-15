import 'dotenv/config';
import { PrismaClient } from '@prisma/client'
import path from 'path'

// Ensure we have an absolute path to the database for Prisma
const dbPath = path.resolve(process.cwd(), 'prisma', 'dev.db')
const databaseUrl = `file:${dbPath}`

if (!process.env.DATABASE_URL || process.env.DATABASE_URL === "") {
    process.env.DATABASE_URL = databaseUrl
    console.log('[db.ts] Forced DATABASE_URL fallback:', process.env.DATABASE_URL)
}

console.log('[db.ts] Final DATABASE_URL target:', databaseUrl)

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
    datasources: {
        db: {
            url: databaseUrl, // Use absolute path directly
        },
    },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
