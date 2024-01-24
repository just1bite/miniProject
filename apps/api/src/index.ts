import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import apiRouter from './common/router/api.router';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(json());
app.use(
  urlencoded({
    extended: true,
  }),
);

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`[API] -> http://localhost:${PORT}`);
});
