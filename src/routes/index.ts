import express from 'express';
import { getModuleRoutes } from './module';
import { getOperationRoutes } from './operation';
import { getUserRoutes } from './user';

function getRoutes() {
  const router = express.Router();
  router.use('/user', getUserRoutes());
  router.use('/module', getModuleRoutes());
  router.use('/operation', getOperationRoutes());
  return router;
}

export { getRoutes };
