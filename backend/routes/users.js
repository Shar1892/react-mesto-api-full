const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);

router.get(
  '/me',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().alphanum().length(24),
    }),
  }),
  getUserInfo,
);

router.get(
  '/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().alphanum().length(24),
    }),
  }),
  getUser,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .pattern(
          /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/,
        ),
    }),
  }),
  updateUserAvatar,
);

module.exports = router;
