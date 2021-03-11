const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const { JWT_SECRET } = require('../../config');
const { validateRegisterInput, validateLoginInput } = require('../../utils/validators');

const generateToken = user =>
  jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, {
    expiresIn: '1d',
  });

module.exports = {
  Mutation: {
    async register(parent, args, context, info) {
      const {
        registerInput: { username, password, confirmPassword, email },
      } = args;

      // validate user data
      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // make sure user doesn't already exists
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username taken', {
          errors: {
            username: 'This username is taken',
          },
        });
      }

      // hash the password and create an auth token
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },

    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });
      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Invalid credentials';
        throw new UserInputError('Invalid credentials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};
