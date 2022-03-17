import express from 'express';
import { getModuleRoutes } from './module';
import { getUserRoutes } from './user';

function getRoutes() {
  const router = express.Router();
  router.use('/user', getUserRoutes());
  router.use('/module', getModuleRoutes());
  return router;
}

export { getRoutes };
