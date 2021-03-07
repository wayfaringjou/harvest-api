const express = require('express');
const AuthService = require('./auth-service');

const authRouter = express.Router();

authRouter
  .post('/login', express.json(), async (req, res, next) => {
    // Destructure request
    const { user_name, password } = req.body;
    // Check that values aren't missing
    if (!(user_name && password)) {
      return res.status(400).json({
        error: `Missing '${!user_name ? 'Username' : 'Password'}' on request body.`,
      });
    }

    // Check if username is in database
    // Get db instance
    const knex = req.app.get('db');

    try {
      // Look for user in db
      const validUser = await AuthService.getUserWithUserName(knex, user_name);
      // If not found return error
      if (!validUser) {
        return res.status(401).json({
          error: 'Incorrect username or password',
        });
      }

      // If user found, check for password next
      const validPassword = await AuthService.comparePasswords(password, validUser.password);
      // If password not found return error
      if (!validPassword) {
        return res.status(401).json({
          error: 'Incorrect username or password',
        });
      }

      // If both found return authorization token
      return res.send({
        authToken: AuthService.createJWT(validUser.user_name, { user_id: validUser.id }),
      });
    } catch (error) { next(error); }
  });

module.exports = authRouter;
