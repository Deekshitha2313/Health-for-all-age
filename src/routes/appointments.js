import { Router } from 'express';
import { pool } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM appointments WHERE user_id = ? ORDER BY date DESC, time DESC', [req.user.id]);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { doctor_name, date, time, reason } = req.body;
    if (!doctor_name || !date || !time) return res.status(400).json({ error: 'Missing fields' });
    const [result] = await pool.query(
      'INSERT INTO appointments (user_id, doctor_name, date, time, reason) VALUES (?,?,?,?,?)',
      [req.user.id, doctor_name, date, time, reason || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
