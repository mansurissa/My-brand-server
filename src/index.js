import 'dotenv/config.js';
import express from 'express';
import passport from 'passport';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import upload from 'express-fileupload';
import swagger from 'swagger-ui-express';
import blogRouter from './routes/blogRouter.js';
import usersRouter from './routes/usersRouter.js';
import connectDb from './config/database.js';
import errorRes from './helpers/errorHandler.js';
import jwtStrategy from './config/passport.js';
import githubStrategy from './config/github.js';
import swaggerDoc from '../documentation/swaggerDoc.json';

const app = express();
connectDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(upload({ useTempFiles: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(passport.initialize());
passport.use(jwtStrategy);
passport.use(githubStrategy);
app.use('/', swagger.serve, swagger.setup(swaggerDoc));
app.use('/blog', blogRouter);
app.use('/users', usersRouter);
app.use((req, res) => {
  errorRes(res, 404, 'Route not found');
});

const port = process.env.PORT;
app.listen(port, console.log('Server is running on port:', port));
