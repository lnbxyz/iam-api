import express, { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/user';

function getUserRoutes() {
  const router = express.Router();
  router.get('/', getAll);
  router.get('/:id', getOne);
  router.post('/', create);
  router.put('/:id', update);
  router.delete('/:id', _delete);
  return router;
}

async function getAll(req: Request, res: Response) {
  const users = await getRepository(User).find();
  res.send(users);
}

async function getOne(req: Request, res: Response) {
  const repository = getRepository(User);
  const user = await repository.findOne(req.params.id);
  res.send(user);
}

async function create(req: Request, res: Response) {
  const repository = getRepository(User);
  console.log(req.body);
  const result = await repository.save(req.body);
  res.send(result);
}

async function update(req: Request, res: Response) {
  const repository = getRepository(User);
  const result = repository.update(req.params.id, req.body);
  res.send(result);
}

async function _delete(req: Request, res: Response) {
  const repository = getRepository(User);
  const user = await repository.findOne(req.params.id);
  await repository.delete(user);
  res.send();
}

export { getUserRoutes };
