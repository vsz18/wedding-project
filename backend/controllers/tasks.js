import { pool } from '../db/pool.js'

export async function listTasks(_req, res) {
  const { rows } = await pool.query(
    'SELECT * FROM tasks ORDER BY category, sort_order, id'
  )
  res.json(rows)
}

export async function getTask(req, res) {
  const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id])
  if (!rows.length) return res.status(404).json({ error: 'Task not found' })
  res.json(rows[0])
}

export async function createTask(req, res) {
  const { title, category, due_day, notes } = req.body
  const { rows } = await pool.query(
    `INSERT INTO tasks (title, category, due_day, notes, sort_order)
     VALUES ($1, $2, $3, $4,
       (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM tasks WHERE category = $2))
     RETURNING *`,
    [title, category ?? 'general', due_day, notes]
  )
  res.status(201).json(rows[0])
}

export async function updateTask(req, res) {
  const { title, category, due_day, completed, notes } = req.body
  const { rows } = await pool.query(
    `UPDATE tasks SET title=$1, category=$2, due_day=$3, completed=$4, notes=$5
     WHERE id=$6 RETURNING *`,
    [title, category, due_day, completed, notes, req.params.id]
  )
  if (!rows.length) return res.status(404).json({ error: 'Task not found' })
  res.json(rows[0])
}

export async function deleteTask(req, res) {
  const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id])
  if (!rowCount) return res.status(404).json({ error: 'Task not found' })
  res.status(204).end()
}

/** PATCH /reorder — body: { ids: number[] } in new sort order */
export async function reorderTasks(req, res) {
  const { ids } = req.body
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'ids must be a non-empty array' })
  }
  await pool.query(
    `UPDATE tasks
     SET sort_order = data.sort_order
     FROM (
       SELECT unnest($1::int[]) AS id,
              generate_series(1, cardinality($1::int[])) AS sort_order
     ) AS data
     WHERE tasks.id = data.id`,
    [ids]
  )
  res.status(204).end()
}
