import express, { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { Module } from '../entities/module';

function getModuleRoutes() {
  const router = express.Router();
  router.get('/', getAll);
  router.get('/:id', getOne);
  router.post('/', create);
  router.put('/:id', update);
  router.delete('/:id', _delete);
  return router;
}

async function getAll(req: Request, res: Response) {
  const modules = await getRepository(Module).find();
  res.send(modules);
}

async function getOne(req: Request, res: Response) {
  const repository = getRepository(Module);
  const module = await repository.findOne(req.params.id);
  res.send(module);
}

async function create(req: Request, res: Response) {
  const repository = getRepository(Module);

  const existingByActivityName = await getByActivityName(repository, req.body.activityName);
  if (existingByActivityName) {
    res.status(400).send('Activity name is taken');
    return;
  }

  const result = await repository.save(req.body);
  res.send(result);
}

async function update(req: Request, res: Response) {
  const repository = getRepository(Module);

  const existingByActivityName = await getByActivityName(repository, req.body.activityName);
  if (existingByActivityName && existingByActivityName.id !== req.params.id) {
    res.status(400).send('Activity name is taken');
    return;
  }

  const result = repository.update(req.params.id, req.body);
  res.send(result);
}

async function _delete(req: Request, res: Response) {
  const repository = getRepository(Module);
  const module = await repository.findOne(req.params.id);
  await repository.delete(module);
  res.send();
}

async function getByActivityName(
  repository: Repository<Module>,
  activityName: string
): Promise<Module> {
  return repository.findOne({ activityName });
}

export { getModuleRoutes };
