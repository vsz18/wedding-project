import { pool } from '../db/pool.js'

export async function listBridesmaidsTasksCtrl(_req, res) {
  const { rows } = await pool.query(
    'SELECT * FROM bridesmaids_tasks ORDER BY due_day NULLS LAST, due_time NULLS LAST, id'
  )
  res.json(rows)
}

export async function createBridesmaidsTask(req, res) {
  const { title, assignee, due_day, due_time, notes } = req.body
  const { rows } = await pool.query(
    `INSERT INTO bridesmaids_tasks (title, assignee, due_day, due_time, notes)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [title, assignee ?? 'all', due_day, due_time, notes]
  )
  res.status(201).json(rows[0])
}

export async function updateBridesmaidsTask(req, res) {
  const { title, assignee, completed, due_day, due_time, notes } = req.body
  const { rows } = await pool.query(
    `UPDATE bridesmaids_tasks SET title=$1, assignee=$2, completed=$3,
     due_day=$4, due_time=$5, notes=$6 WHERE id=$7 RETURNING *`,
    [title, assignee, completed, due_day, due_time, notes, req.params.id]
  )
  if (!rows.length) return res.status(404).json({ error: 'Task not found' })
  res.json(rows[0])
}

export async function deleteBridesmaidsTask(req, res) {
  const { rowCount } = await pool.query('DELETE FROM bridesmaids_tasks WHERE id=$1', [req.params.id])
  if (!rowCount) return res.status(404).json({ error: 'Task not found' })
  res.status(204).end()
}
