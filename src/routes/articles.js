import { Router } from 'express';
import { pool } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id,title,content,age_group,created_at FROM articles ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAuth, requireRole('doctor', 'admin'), async (req, res) => {
  try {
    const { title, content, age_group = 'all' } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Missing fields' });
    const [result] = await pool.query(
      'INSERT INTO articles (title, content, age_group, author_id) VALUES (?,?,?,?)',
      [title, content, age_group, req.user.id]
    );
    res.status(201).json({ id: result.insertId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
