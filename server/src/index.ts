import express from 'express';
import moviesRouter from "./routers/movie"

const app = express();
const PORT = 3001;

app.use(express.json()); 
app.use('/api/movies', moviesRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API запущен: http://localhost:${PORT}`);
});