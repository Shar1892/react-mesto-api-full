const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const User = require('../models/user');
const NotFoundErr = require('../errors/NotFoundErr');
const NotAuthErr = require('../errors/NotAuthErr');
const BadRequestErr = require('../errors/BadRequestErr');
const RepeatEmailErr = require('../errors/RepeatEmailErr');

dotenv.config();

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params._id)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        throw new NotFoundErr('Пользователь не найден.');
      }
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        throw new NotFoundErr('Пользователь не найден.');
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    password, email,
  } = req.body;

  if (!email || !password) {
    throw new BadRequestErr('Почта или пароль не указаны.');
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash,
      })
        .then((user) => {
          res.status(200).send({ data: user });
        })
        .catch((err) => {
          if (err.name === 'MongoError' && err.code === 11000) {
            throw new RepeatEmailErr('Такой пользователь уже существует.');
          } else if (err.name === 'ValidationError') {
            throw new BadRequestErr('Переданы некорректные данные при создании пользователя.');
          }
        });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        throw new NotFoundErr('Пользователь не найден.');
      }
    })
    .catch(() => {
      throw new BadRequestErr('Переданы некорректные данные при обновлении.');
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        throw new NotFoundErr('Пользователь не найден.');
      }
    })
    .catch(() => {
      throw new BadRequestErr('Переданы некорректные данные при обновлении.');
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new NotAuthErr('Почта или пароль не указаны.');
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      throw new NotAuthErr(err.message);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
  getUserInfo,
};
