import express from 'express';
import generateRouter from './routes/generate.js';
import feedbackRouter from './routes/feedback.js';
import authRouter from './routes/auth.js';

const app = express();
app.use(express.json());

app.use('/auth', authRouter);
app.use('/generate', generateRouter);
app.use('/feedback', feedbackRouter);

app.get('/', (req, res) => {
  res.json({ status: 'KidStory backend running' });
});

const port = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Backend listening on ${port}`));
}

export default app;
