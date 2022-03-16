import express from 'express';
import { getUserRoutes } from './user';

function getRoutes() {
  const router = express.Router();
  router.use('/user', getUserRoutes());
  return router;
}

export { getRoutes };
