const bcrypt = require('bcryptjs');
const xss = require('xss');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  usersTable: 'users',
  async userNameTaken(db, user_name) {
    return Boolean(
      await db(this.usersTable)
        .where({ user_name })
        .first(),
    );
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character';
    }
    return null;
  },
  async insertUser(db, newUser) {
    const [user] = await db
      .insert(newUser)
      .into(this.usersTable)
      .returning('*');
    return user;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser: (user) => ({
    id: user.id,
    user_name: user.user_name,
    date_created: new Date(user.date_created),
  }),
};

module.exports = UsersService;
