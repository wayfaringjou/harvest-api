require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV, CLIENT_ORIGIN } = require('../config');

// Routers
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');
const notesRouter = require('./notes/notes-router');
const gardensRouter = require('./gardens/gardens-router');
const areasRouter = require('./garden-areas/garden-areas-router');
const plantsRouter = require('./plants/plants-router');
const trefleRouter = require('./auth/trefle-router');

const app = express();

app.use(logger((NODE_ENV === 'production') ? 'common' : 'common', {
  skip: () => NODE_ENV === 'test',
}));
app.use(cors({
  origin: CLIENT_ORIGIN,
}));
app.use(helmet());

app.use(express.json());

// Authorization related endpoints
app.use('/auth', usersRouter, authRouter);
app.use('/auth/trefle', trefleRouter);
// Resource related endpoints
app.use('/api/areas', areasRouter);
app.use('/api/plants', plantsRouter);

// User-specific resource endpoints
app.use('/api/users/:userId/garden/notes', (req, res, next) => {
  res.locals.user_id = req.params.userId;
  next();
}, notesRouter);

app.use('/api/users/:userId/gardens', (req, res, next) => {
  res.locals.user_id = req.params.userId;
  next();
}, gardensRouter);

// Garden-specific resource endpoints
app.use('/api/gardens/:gardenId/areas', (req, res, next) => {
  res.locals.garden_id = req.params.gardenId;
  next();
}, areasRouter);

app.use('/api/gardens/:gardenId/plants', (req, res, next) => {
  res.locals.garden_id = req.params.gardenId;
  next();
}, plantsRouter);

// Error handling
app.use((error, _req, res, _next) => {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: 'Server error' };
  } else {
    console.error(error);
    response = { error: error.message, object: error };
  }
  res.status(500).json(response);
});

module.exports = app;
