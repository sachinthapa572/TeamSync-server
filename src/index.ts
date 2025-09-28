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

app.set('trust proxy', 1); // Trust first proxy for secure cookies behind load balancer

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(
  session({
    name: 'session',
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    cookie: {  // Nest here for precision
      secure: config.NODE_ENV === 'production',  // HTTPS only – your jam now
      httpOnly: true,  // XSS shield, always
      sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',  // Cross-origin unlocked in prod
      domain:
        config.NODE_ENV === 'production'
          ? `.${new URL(config.FRONTEND_ORIGIN.startsWith('http') ? config.FRONTEND_ORIGIN : `https://${config.FRONTEND_ORIGIN}`).hostname.replace(/^www\./, '')}`  // Now matches the comment and is more robust
          : undefined
    },
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
