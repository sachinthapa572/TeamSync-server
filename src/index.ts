import session from 'cookie-session';
import cors from 'cors';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import { config } from './config/app.config';
import connectDatabase from './config/database.config';
import { ErrorCodeEnum } from './enums/error-code.enum';
import { asyncHandler } from './middlewares/asyncHandler.middleware';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { BadRequestException } from './utils/appError';

import morgan from 'morgan';
import passport from 'passport';
import './config/passport.config';
import router from './routes/router';

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(
  session({
    name: 'session',
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
    domain:
      config.NODE_ENV === 'production' ? config.FRONTEND_ORIGIN : undefined,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException(
      'This is a bad request',
      ErrorCodeEnum.AUTH_INVALID_TOKEN
    );
  })
);

app.use(`${BASE_PATH}`, router);
app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
