import express, { Request, Response } from 'express';

function getUserRoutes() {
  const router = express.Router();
  router.get('/test', test);
  return router;
}

async function test(req: Request, res: Response) {
  res.send({
    message: 'working'
  });
}

export { getUserRoutes };
