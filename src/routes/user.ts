import express, { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
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

  const existingUserByEmail = await getByEmail(repository, req.body.email);
  if (existingUserByEmail) {
    res.status(400).send('Email is taken');
    return;
  }

  const existingUserByUsername = await getByUsername(repository, req.body.username);
  if (existingUserByUsername) {
    res.status(400).send('Username is taken');
    return;
  }

  const result = await repository.save(req.body);
  res.send(result);
}

async function update(req: Request, res: Response) {
  const repository = getRepository(User);

  const existingUserByEmail = await getByEmail(repository, req.body.email);
  if (existingUserByEmail && existingUserByEmail.id !== req.params.id) {
    res.status(400).send('Email is taken');
    return;
  }

  const existingUserByUsername = await getByUsername(repository, req.body.username);
  if (existingUserByUsername && existingUserByUsername.id !== req.params.id) {
    res.status(400).send('Username is taken');
    return;
  }

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
  const user = await userRepo.findOne(req.params.id, { relations: ['modules'] });
  if (user.modules.filter((m) => m.id === req.params.moduleId).length > 0) {
    res.status(400).send('User has already been granted access to this module');
    return;
  }
  user.modules.push(module);
  const result = await userRepo.save(user);
  res.send(result);
}

async function revoke(req: Request, res: Response) {
  const userRepo = getRepository(User);
  const user = await userRepo.findOne(req.params.id, { relations: ['modules'] });
  const prevLength = user.modules.length;
  user.modules = user.modules.filter((m) => m.id !== req.params.moduleId);
  if (prevLength === user.modules.length) {
    res.status(400).send('User does not have access to this module');
    return;
  }
  const result = await userRepo.save(user);
  res.send(result);
}

async function getByEmail(repository: Repository<User>, email: string): Promise<User> {
  return repository.findOne({ email });
}

async function getByUsername(repository: Repository<User>, username: string): Promise<User> {
  return repository.findOne({ username });
}

export { getUserRoutes };
