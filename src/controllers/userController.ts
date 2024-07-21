import { Request, Response } from 'express';

import prisma from '../prisma';

// 모든 사용자 조회
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export default {
  getAllUsers
};