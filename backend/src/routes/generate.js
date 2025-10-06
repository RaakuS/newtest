import express from 'express';
import jwt from 'jsonwebtoken';
import { isSafe } from '../utils/safety.js';
import { findAssets } from '../utils/assets.js';
import { generateScript, safetyCheck } from '../services/gemini.js';
import { generateVideo } from '../services/veo.js';
import { textToSpeech } from '../services/elevenlabs.js';
import { assembleVideo } from '../services/ffmpeg.js';
import { logGeneration } from '../metrics.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing token' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.post('/', auth, async (req, res) => {
  const { topic, name, theme } = req.body;
  if (!topic || !name || !theme) {
    return res.status(400).json({ error: 'topic, name, and theme required' });
  }
  const prompt = `${topic} ${name} ${theme}`;
  if (!await isSafe(prompt)) {
    return res.status(400).json({ error: 'Unsafe content detected' });
  }
  const safety = await safetyCheck(prompt);
  if (!safety.safe) {
    return res.status(400).json({ error: 'Semantic safety failed' });
  }
  const script = await generateScript(topic, name, theme);
  const assets = findAssets(topic);
  const videoBase = await generateVideo(script, assets);
  const audio = await textToSpeech(script);
  const finalUrl = await assembleVideo(videoBase, audio, script);
  logGeneration();
  res.json({ url: finalUrl });
});

export default router;
