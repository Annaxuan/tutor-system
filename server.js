import path from 'path';
import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import authRouter from './routes/authRoutes.js';
import messagingRouter from './routes/messagingRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import scheduleRoute from './routes/scheduleRoutes.js';
import accountRoutes from "./routes/account/accountRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";

// Do this first. This will look into .env to load environment vars
dotenv.config();

// prepare for serveing the static files
// source: https://expressjs.com/en/starter/static-files.html
const __dirname = dirname(fileURLToPath(import.meta.url));

// starting the express server
const app = express();

const port = process.env.PORT || 5002;

const corsOptions = {
  credentials: true,
  origin: process.env.CLIENT_URL || '*',
};

// enable CORS if in development, for React local development server
// to connect to the web server.
app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());
// body-parser: middleware for parsing parts of the request into a usable
// object (onto req.body)
import bodyParser from 'body-parser';
app.use(bodyParser.json()); // parsing JSON body
// parsing URL-encoded form data (from form POST requests)
app.use(bodyParser.urlencoded({ extended: true }));

/*** Webpage routes below **********************************/
// Serve the build
// TODO: run npm build for production in frontend, which
// creates the public folder to serve
app.use('/', express.static(join(__dirname, 'client/build')));

// register and login routes
app.use('/api/auth', authRouter);

app.use('/api/message', messagingRouter);

app.use('/api/course', courseRouter);

app.use('/api/schedule', scheduleRoute);

app.use('/api/account', accountRoutes);

app.use('/api/connection', connectionRoutes);

// All routes other than above will go to index.html
app.get('*', (req, res) => {
  // check for page routes that we expect in the frontend to provide correct status code.
  // TODO: Add good routes
  const goodPageRoutes = ['/', '/login', '/signup', '/dashboard', "/profile", "/schedule", "/management"];
  if (!goodPageRoutes.includes(req.url)) {
    // if url not in expected page routes, set status to 404.
    res.status(404);
  }

  // send index.html
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});
app.listen(port, () => console.log(`Server listening on port ${port}...`));
