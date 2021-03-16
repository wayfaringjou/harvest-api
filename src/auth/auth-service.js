const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config');

const AuthService = {
  usersTable: 'users',
  secret: config.JWT_SECRET,
  getUserWithUserName(db, user_name) {
    return db(this.usersTable)
      .where({ user_name })
      .first();
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  createJWT(subject, payload) {
    return jwt.sign(payload, this.secret, {
      subject,
      algorithm: 'HS256',
    });
  },
  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
    });
  },
};

module.exports = AuthService;
