import express, { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { Operation } from '../entities/operation';
import { User } from '../entities/user';

function getUserRoutes() {
  const router = express.Router();
  router.get('/', getAll);
  router.get('/:id', getOne);
  router.post('/', create);
  router.put('/:id', update);
  router.delete('/:id', _delete);
  router.post(`/:id/grant/:operationId`, grant);
  router.delete('/:id/revoke/:operationId', revoke);
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
  const operationRepo = getRepository(Operation);
  const userRepo = getRepository(User);
  const module = await operationRepo.findOne(req.params.operationId);
  const user = await userRepo.findOne(req.params.id, { relations: ['operations'] });
  if (user.operations.filter((o) => o.id === req.params.operationId).length > 0) {
    res.status(400).send('User has already been granted access to this operation');
    return;
  }
  user.operations.push(module);
  const result = await userRepo.save(user);
  res.send(result);
}

async function revoke(req: Request, res: Response) {
  const userRepo = getRepository(User);
  const user = await userRepo.findOne(req.params.id, { relations: ['operations'] });
  const prevLength = user.operations.length;
  user.operations = user.operations.filter((o) => o.id !== req.params.operationId);
  if (prevLength === user.operations.length) {
    res.status(400).send('User does not have access to this operation');
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
