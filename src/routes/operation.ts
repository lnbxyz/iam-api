import express, { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { Module } from '../entities/module';
import { Operation } from '../entities/operation';

function getOperationRoutes() {
  const router = express.Router();
  router.get('/', getAll);
  router.get('/:id', getOne);
  router.post('/', create);
  router.put('/:id', update);
  router.delete('/:id', _delete);
  return router;
}

async function getAll(req: Request, res: Response) {
  const operations = await getRepository(Operation).find();
  res.send(operations);
}

async function getOne(req: Request, res: Response) {
  const repository = getRepository(Operation);
  const operation = await repository.findOne(req.params.id);
  res.send(operation);
}

async function create(req: Request, res: Response) {
  const repository = getRepository(Operation);

  console.log(doesModuleExist(req.body.moduleId));
  if (!(await doesModuleExist(req.body.moduleId))) {
    res.status(400).send('Module does not exist');
    return;
  }

  const existingByActivityName = await getByActivityName(repository, req.body.activityName);
  if (existingByActivityName) {
    res.status(400).send('Activity name is taken');
    return;
  }

  const result = await repository.save(req.body);
  res.send(result);
}

async function update(req: Request, res: Response) {
  const repository = getRepository(Operation);

  if (!(await doesModuleExist(req.body.moduleId))) {
    res.status(400).send('Module does not exist');
    return;
  }

  const existingByActivityName = await getByActivityName(repository, req.body.activityName);
  if (existingByActivityName && existingByActivityName.id !== req.params.id) {
    res.status(400).send('Activity name is taken');
    return;
  }

  const result = repository.update(req.params.id, req.body);
  res.send(result);
}

async function _delete(req: Request, res: Response) {
  const repository = getRepository(Operation);
  const operation = await repository.findOne(req.params.id);
  await repository.delete(operation);
  res.send();
}

async function getByActivityName(
  repository: Repository<Operation>,
  activityName: string
): Promise<Operation> {
  return repository.findOne({ activityName });
}

async function doesModuleExist(moduleId: string): Promise<boolean> {
  return !!(await getRepository(Module).findOne(moduleId));
}

export { getOperationRoutes };
