// based on literature by Kent C. Dodds
// https://kentcdodds.com/blog/how-i-structure-express-apps

// TODO: add proper types
// TODO: swap console for a proper logger

import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { getRoutes } from './routes';

function startServer({ port = process.env.PORT || 8080 } = {}) {
  const app = express();

  app.use('/', getRoutes());
  app.use(errorMiddleware);

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.info(`Listening on port ${port}`);

      const originalClose = server.close.bind(server);
      server.close = (): any => {
        return new Promise((resolveClose) => {
          originalClose(resolveClose);
        });
      };

      setupCloseOnExit(server);

      resolve(server);
    });
  });
}

function errorMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    next(error);
  } else {
    res.status(500);
    res.json({
      message: error.message
    });
  }
}

function setupCloseOnExit(server: any) {
  async function exitHandler(options: any = {}) {
    await server
      .close()
      .then(() => {
        console.info('Server successfully closed');
      })
      .catch((e: any) => {
        console.warn('Something went wrong closing the server', e.stack);
      });

    if (options.exit) process.exit();
  }

  // do something when app is closing
  process.on('exit', exitHandler);

  // catches ctrl+c event
  process.on('SIGINT', exitHandler.bind(null, { exit: true }));

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
  process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

  // catches uncaught exceptions
  process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
}

export { startServer };
