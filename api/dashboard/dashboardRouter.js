var express = require('express');
var router = express.Router();
const createError = require('http-errors');
var DB = require('../../data/dbInterface');
var { authCreate, authEdit, decodeToken } = require('../middleware/auth');
var { validateResource, validatePayload } = require('../middleware/validate');

const dashAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error('Missing Authorization');
    const user = decodeToken(authHeader);
    res.locals.user = await DB.findById('profiles', user.subject);
    if (!res.locals.user) throw new Error('Incorrect Authorization');

    if (req.params.table === 'classes' && res.locals.user.operator === false)
      throw new Error('Incorrect Authorization');
    next();
  } catch (err) {
    next(createError(401, err.message));
  }
};

router.get('/reservations', dashAuth, function (req, res) {
  DB.findClassesByParticipant(res.locals.user.id)
    .then((classes) => {
      res.status(200).json(classes);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.get('/classes', dashAuth, function (req, res) {
  DB.findBy('classes', { ['classes.owner_id']: res.locals.user.id })
    .then((objs) => {
      res.status(200).json(objs);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

module.exports = router;
