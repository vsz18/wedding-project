import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'
import { tasksRouter } from './routes/tasks.js'
import { timelineRouter } from './routes/timeline.js'
import { packingRouter } from './routes/packing.js'
import { vendorsRouter } from './routes/vendors.js'
import { makeupRouter } from './routes/makeup.js'
import { bridesmaidsRouter } from './routes/bridesmaids.js'

const app = express()
const PORT = process.env.PORT || 3000
const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/v1/tasks',       tasksRouter)
app.use('/api/v1/timeline',    timelineRouter)
app.use('/api/v1/packing',     packingRouter)
app.use('/api/v1/vendors',     vendorsRouter)
app.use('/api/v1/makeup',      makeupRouter)
app.use('/api/v1/bridesmaids', bridesmaidsRouter)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

// Serve frontend in production
const distPath = join(__dirname, '../frontend/dist')
if (existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (_req, res) => res.sendFile(join(distPath, 'index.html')))
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
