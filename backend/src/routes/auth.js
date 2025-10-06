import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

router.post('/magic-link', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
  console.log(`Magic link for ${email}: http://localhost:5173/?token=${token}`);
  res.json({ token });
});

export default router;
