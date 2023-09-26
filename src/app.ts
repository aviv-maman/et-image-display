import express from 'express';
import type { Application } from 'express';
import path from 'path';

const app: Application = express();

// Serving static files
app.use(express.static(path.join(__dirname, '../public')));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Test middleware
app.use((req, res, next) => {
  //   req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

export default app;
