import { pool } from '../db/pool.js'

export async function listItems(req, res) {
  const { person } = req.query
  const query = person
    ? 'SELECT * FROM packing_items WHERE person=$1 ORDER BY section, id'
    : 'SELECT * FROM packing_items ORDER BY person, section, id'
  const { rows } = await pool.query(query, person ? [person] : [])
  res.json(rows)
}

export async function createItem(req, res) {
  const { title, person, section } = req.body
  const { rows } = await pool.query(
    'INSERT INTO packing_items (title, person, section) VALUES ($1,$2,$3) RETURNING *',
    [title, person ?? 'bride', section ?? 'ceremony']
  )
  res.status(201).json(rows[0])
}

export async function updateItem(req, res) {
  const { title, person, section, packed } = req.body
  const { rows } = await pool.query(
    'UPDATE packing_items SET title=$1, person=$2, section=$3, packed=$4 WHERE id=$5 RETURNING *',
    [title, person, section, packed, req.params.id]
  )
  if (!rows.length) return res.status(404).json({ error: 'Item not found' })
  res.json(rows[0])
}

export async function patchPacked(req, res) {
  const { packed } = req.body
  const { rows } = await pool.query(
    'UPDATE packing_items SET packed=$1 WHERE id=$2 RETURNING *',
    [packed, req.params.id]
  )
  if (!rows.length) return res.status(404).json({ error: 'Item not found' })
  res.json(rows[0])
}

export async function deleteItem(req, res) {
  const { rowCount } = await pool.query('DELETE FROM packing_items WHERE id=$1', [req.params.id])
  if (!rowCount) return res.status(404).json({ error: 'Item not found' })
  res.status(204).end()
}
