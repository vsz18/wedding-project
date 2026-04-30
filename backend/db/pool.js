import pg from 'pg'

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set')
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

pool.on('error', (err) => console.error('Database pool error:', err.message))
