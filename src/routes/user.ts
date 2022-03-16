import express, { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/user';

function getUserRoutes() {
  const router = express.Router();
  router.get('/', getAll);
  return router;
}

async function getAll(req: Request, res: Response) {
  const users = getRepository(User).find();
  res.send({ users });
}

export { getUserRoutes };
