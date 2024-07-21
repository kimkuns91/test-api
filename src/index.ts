import express, { Application, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app: Application = express();
const port = process.env.PORT || 8080;

app.get("/", (_req: Request, res: Response) => {
  return res.send("Express Typescript on Vercel");
});

app.get("/users", async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/users", async (_req: Request, res: Response) => {
  const user = await prisma.user.create({
    data: {
      name: "Kun Woo Kim",
      email: "kimkuns98@gmail.com",
      password: "password",
    },
  });
  res.json(user);
});

app.get("/ping", (_req: Request, res: Response) => {
  return res.send("pong 🏓");
});

app.listen(port, () => {
  return console.log(`This Server is listening on ${port}`);
});
