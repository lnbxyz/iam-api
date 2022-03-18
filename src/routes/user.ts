import express, { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Module } from '../entities/module';
import { User } from '../entities/user';

function getUserRoutes() {
  const router = express.Router();
  router.get('/', getAll);
  router.get('/:id', getOne);
  router.post('/', create);
  router.put('/:id', update);
  router.delete('/:id', _delete);
  router.post('/:id/grant/:moduleId', grant);
  router.delete('/:id/revoke/:moduleId', revoke);
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

async function grant(req: Request, res: Response) {
  const moduleRepo = getRepository(Module);
  const userRepo = getRepository(User);
  const module = await moduleRepo.findOne(req.params.moduleId);
  const user = await userRepo.findOne(req.params.id);
  if (user.modules.filter((m) => m.id === req.params.moduleId).length > 0) {
    // todo error
  }
  user.modules.push(module);
  const result = await userRepo.update(req.params.id, user);
  res.send(result);
}

async function revoke(req: Request, res: Response) {
  const userRepo = getRepository(User);
  const user = await userRepo.findOne(req.params.id);
  const prevLength = user.modules.length;
  user.modules = user.modules.filter((m) => m.id !== req.params.moduleId);
  if (prevLength === user.modules.length) {
    // todo error
  }
  const result = await userRepo.update(req.params.id, user);
  res.send(result);
}

export { getUserRoutes };
