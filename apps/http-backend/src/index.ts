import express from 'express';
import cors from 'cors';
import router from './api/api.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const port = 4001;

app.use('/api', router);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
