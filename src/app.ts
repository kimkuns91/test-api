import express, { Application } from 'express';
import { json, urlencoded } from 'body-parser';

import apiRoutes from './routes'; // 라우터 임포트

const app: Application = express();

// 미들웨어 설정
app.use(json());
app.use(urlencoded({ extended: true }));

// 라우터 설정
app.use('/api', apiRoutes);

export default app;
