const Card = require('../models/card');
const NotFoundErr = require('../errors/NotFoundErr');
const BadRequestErr = require('../errors/BadRequestErr');
const NotOwnerErr = require('../errors/NotOwnerErr');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch(() => {
      throw new BadRequestErr('Переданы некорректные данные при создании карточки.');
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        if (card.owner.toString() === req.user._id) {
          Card.findByIdAndRemove(req.params.cardId)
            .then((dataCard) => {
              res.status(200).send({ data: dataCard });
            });
        } else {
          throw new NotOwnerErr('Нельзя удалить чужую карточку.');
        }
      } else {
        throw new NotFoundErr('Карточка не найдена.');
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        throw new NotFoundErr('Карточка не найдена.');
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        throw new NotFoundErr('Карточка не найдена.');
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
