import { pool } from '../db/pool.js'

export async function listVendors(_req, res) {
  const { rows } = await pool.query('SELECT * FROM vendors ORDER BY category, name')
  res.json(rows)
}

export async function createVendor(req, res) {
  const { name, company, phone, email, arrival_time, location, category, notes } = req.body
  const { rows } = await pool.query(
    `INSERT INTO vendors (name, company, phone, email, arrival_time, location, category, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [name, company, phone, email, arrival_time || null, location, category ?? 'other', notes]
  )
  res.status(201).json(rows[0])
}

export async function updateVendor(req, res) {
  const { name, company, phone, email, arrival_time, location, category, notes } = req.body
  const { rows } = await pool.query(
    `UPDATE vendors SET name=$1, company=$2, phone=$3, email=$4,
     arrival_time=$5, location=$6, category=$7, notes=$8
     WHERE id=$9 RETURNING *`,
    [name, company, phone, email, arrival_time || null, location, category, notes, req.params.id]
  )
  if (!rows.length) return res.status(404).json({ error: 'Vendor not found' })
  res.json(rows[0])
}

export async function deleteVendor(req, res) {
  const { rowCount } = await pool.query('DELETE FROM vendors WHERE id=$1', [req.params.id])
  if (!rowCount) return res.status(404).json({ error: 'Vendor not found' })
  res.status(204).end()
}
