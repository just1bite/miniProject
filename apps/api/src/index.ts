import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
// import cors from 'cors';
import { PORT } from './config';
import apiRouter from './common/router/api.router';
import cookieParser from 'cookie-parser';
const cors = require('cors');

const app = express();
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(json());
app.use(
  urlencoded({
    extended: true,
  }),
);

app.use('/api', apiRouter);
app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(PORT, () => {
  console.log(`[API] -> http://localhost:${PORT}`);
});
