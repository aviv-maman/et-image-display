import path from 'path';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import app from './app';
import api from './routes/api';

dotenv.config({ path: './.env' });

process.on('uncaughtException', (err: Error) => {
  console.log('Uncaught Exception! 💥 Shutting down... 💩');
  console.error(`${err.name} has occurred: ${err.message}`);
  process.exit(1);
});

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use('/api', api);

const server = app.listen(port, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server is running on development environment: http://localhost:${port}`);
  }
});

process.on('unhandledRejection', (err: Error) => {
  console.log('Unhandled Rejection! 💥 Shutting down... 🤡');
  console.error(`${err.name} has occurred: ${err.message}`);
  server.close((err) => {
    process.exit(1);
  });
});

process.on('SIGTERM', (listener) => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close((err) => {
    console.error(`${err?.name} has occurred: ${err?.message}`);
    console.log('💥 Process terminated!');
    process.exit(0);
  });
});
