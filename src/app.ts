import express, { Application, Request, Response } from "express";
import { json, urlencoded } from "body-parser";

import apiRoutes from "./routes"; // 라우터 임포트
import cors from "cors";

const app: Application = express();

app.use(cors());
// 미들웨어 설정
app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  return res.send("Express Typescript on Vercel");
});
// 라우터 설정
app.use("/api", apiRoutes);

export default app;
