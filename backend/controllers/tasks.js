import { pool } from '../db/pool.js'

export async function listTasks(_req, res) {
  const { rows } = await pool.query('SELECT * FROM tasks ORDER BY due_day ASC')
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
    'INSERT INTO tasks (title, category, due_day, notes) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, category, due_day, notes]
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
