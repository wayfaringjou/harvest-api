const express = require('express');
const xss = require('xss');
const path = require('path');
const UsersService = require('./users-service');
const Garden = require('../gardens/gradens-service');

const usersRouter = express.Router();

usersRouter
  // eslint-disable-next-line consistent-return
  .post('/', express.json(), async (req, res, next) => {
    const { user_name, password } = req.body;

    if (!(user_name && password)) {
      return res.status(400).json({
        error: `Missing '${!user_name ? 'Username' : 'Password'}' on request body.`,
      });
    }

    const knex = req.app.get('db');

    // Check that user name isn't taken
    try {
      const userTaken = await UsersService.userNameTaken(knex, user_name);
      if (userTaken) {
        return res.status(400).json({
          error: 'Username is already taken',
        });
      }
      // Check that password is valid
      const passwordError = UsersService.validatePassword(password);
      if (passwordError) {
        return res.status(400).json({
          error: passwordError,
        });
      }

      // If both checks pass
      // Compose new user and add to db
      const sanitizedUserName = xss(user_name);
      const hashedPassword = await UsersService.hashPassword(password);
      const newUser = await UsersService.insertUser(knex, {
        user_name: sanitizedUserName,
        password: hashedPassword,
      });

      // Create a default garden for the new user
      const newGarden = Garden.serialize({
        user_id: newUser.id,
        name: `${newUser.user_name}'s garden`,
      });

      const [newGardenResponse] = await Garden.insert(
        req.app.get('db'),
        newGarden,
      );

      return res.status(201)
        .location(path.posix.join(req.originalUrl, `/${newUser.id}`))
        .json({ ...UsersService.serializeUser(newUser), garden: { ...newGardenResponse } });
    } catch (error) {
      next(error);
    }
  });

module.exports = usersRouter;
