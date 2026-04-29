import { pool } from '../db/pool.js'

export async function listSlots(_req, res) {
  const { rows } = await pool.query(
    'SELECT * FROM makeup_schedule ORDER BY sort_order, start_time'
  )
  res.json(rows)
}

export async function createSlot(req, res) {
  const { name, role, start_time, end_time, artist_chair, notes, sort_order } = req.body
  const { rows } = await pool.query(
    `INSERT INTO makeup_schedule (name, role, start_time, end_time, artist_chair, notes, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [name, role ?? 'bridesmaid', start_time, end_time, artist_chair ?? 1, notes, sort_order ?? 0]
  )
  res.status(201).json(rows[0])
}

export async function updateSlot(req, res) {
  const { name, role, start_time, end_time, artist_chair, notes, sort_order } = req.body
  const { rows } = await pool.query(
    `UPDATE makeup_schedule SET name=$1, role=$2, start_time=$3, end_time=$4,
     artist_chair=$5, notes=$6, sort_order=$7 WHERE id=$8 RETURNING *`,
    [name, role, start_time, end_time, artist_chair, notes, sort_order, req.params.id]
  )
  if (!rows.length) return res.status(404).json({ error: 'Slot not found' })
  res.json(rows[0])
}

export async function deleteSlot(req, res) {
  const { rowCount } = await pool.query('DELETE FROM makeup_schedule WHERE id=$1', [req.params.id])
  if (!rowCount) return res.status(404).json({ error: 'Slot not found' })
  res.status(204).end()
}
