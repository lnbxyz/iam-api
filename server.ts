import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({ message: 'hewwo world' });
});

try {
  app.listen(port, (): void => {
    console.log(`yay! connected successfully on port ${port} uwu`);
  });
} catch (error) {
  console.log(`oopsies! ${error}`);
}
