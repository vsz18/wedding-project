import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { tasksRouter } from './routes/tasks.js'
import { timelineRouter } from './routes/timeline.js'
import { packingRouter } from './routes/packing.js'
import { vendorsRouter } from './routes/vendors.js'
import { makeupRouter } from './routes/makeup.js'
import { bridesmaidsRouter } from './routes/bridesmaids.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/v1/tasks',    tasksRouter)
app.use('/api/v1/timeline', timelineRouter)
app.use('/api/v1/packing',  packingRouter)
app.use('/api/v1/vendors',     vendorsRouter)
app.use('/api/v1/makeup',      makeupRouter)
app.use('/api/v1/bridesmaids', bridesmaidsRouter)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
