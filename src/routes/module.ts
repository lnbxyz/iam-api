import express, { Request, Response } from 'express';
import { getRepository } from 'typeorm';
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
  console.log(req.body);
  const result = await repository.save(req.body);
  res.send(result);
}

async function update(req: Request, res: Response) {
  const repository = getRepository(Module);
  const result = repository.update(req.params.id, req.body);
  res.send(result);
}

async function _delete(req: Request, res: Response) {
  const repository = getRepository(Module);
  const module = await repository.findOne(req.params.id);
  await repository.delete(module);
  res.send();
}

export { getModuleRoutes };
