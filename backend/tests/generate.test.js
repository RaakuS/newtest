import request from 'supertest';
import app from '../src/server.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const token = jwt.sign({ email: 'test@example.com' }, JWT_SECRET);

describe('POST /generate', () => {
  it('generates video url', async () => {
    const res = await request(app)
      .post('/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ topic: 'bees', name: 'Ava', theme: 'space' });
    expect(res.status).toBe(200);
    expect(res.body.url).toBeTruthy();
  });
});
