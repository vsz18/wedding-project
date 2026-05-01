import { pool } from '../db/pool.js'

export async function listEvents(_req, res) {
  const { rows } = await pool.query(
    'SELECT * FROM timeline_events ORDER BY start_time, sort_order'
  )
  res.json(rows)
}

export async function updateEvent(req, res) {
  const { title, start_time, duration_mins, buffer_mins, location, category, delay_mins, notes, point_person } = req.body
  const { rows } = await pool.query(
    `UPDATE timeline_events
     SET title=$1, start_time=$2, duration_mins=$3, buffer_mins=$4,
         location=$5, category=$6, delay_mins=$7, notes=$8, point_person=$9
     WHERE id=$10 RETURNING *`,
    [title, start_time, duration_mins, buffer_mins, location, category, delay_mins ?? 0, notes, point_person ?? null, req.params.id]
  )
  if (!rows.length) return res.status(404).json({ error: 'Event not found' })
  res.json(rows[0])
}

export async function patchDelay(req, res) {
  const { delay_mins } = req.body
  const { rows } = await pool.query(
    'UPDATE timeline_events SET delay_mins=$1 WHERE id=$2 RETURNING *',
    [delay_mins ?? 0, req.params.id]
  )
  if (!rows.length) return res.status(404).json({ error: 'Event not found' })
  res.json(rows[0])
}

export async function createEvent(req, res) {
  const { title, start_time, duration_mins, buffer_mins, location, category, notes, sort_order, point_person } = req.body
  const { rows } = await pool.query(
    `INSERT INTO timeline_events (title, start_time, duration_mins, buffer_mins, location, category, notes, sort_order, point_person)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [title, start_time, duration_mins ?? 30, buffer_mins ?? 0, location, category ?? 'general', notes, sort_order ?? 0, point_person ?? null]
  )
  res.status(201).json(rows[0])
}

export async function deleteEvent(req, res) {
  const { rowCount } = await pool.query('DELETE FROM timeline_events WHERE id=$1', [req.params.id])
  if (!rowCount) return res.status(404).json({ error: 'Event not found' })
  res.status(204).end()
}
