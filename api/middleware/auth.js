const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const DB = require('../../data/dbInterface');
require('dotenv').config();

const makeToken = (profile) => {
  const payload = {
    id: profile.id,
    email: profile.email,
    instructor: profile.instructor,
    name: profile.name,
  };
  const config = {
    jwtSecret: process.env.JWT_SECRET,
  };
  const options = {
    expiresIn: '2 weeks',
  };
  return jwt.sign(payload, config.jwtSecret, options);
};

const decodeToken = (token) => {
  const jwtSecret = process.env.JWT_SECRET;
  return jwt.decode(token, jwtSecret);
};

const reqHasToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      throw new Error('Missing Authorization Token');
    next();
  } catch (err) {
    next(createError(401, err.message));
  }
};

const tokenHasValidProfile = async (req, res, next) => {
  try {
    res.locals.user = decodeToken(req.headers.authorization);
    const verify = await DB.findById('profiles', res.locals.user.id);
    if (verify[0].id != res.locals.user.id)
      throw new Error('User profile does not exist');
    next();
  } catch (err) {
    next(createError(401, err.message));
  }
};

const profileCanCreateObject = async (req, res, next) => {
  try {
    if (
      ['classes', 'class_cards'].includes(req.params.table) &&
      res.locals.user.instructor === false
    )
      throw new Error('User must be an instructor');
    next();
  } catch (err) {
    next(createError(401, err.message));
  }
};

const profileCanEditObject = async (req, res, next) => {
  try {
    if (!req.params.id) {
      next();
    } else {
      const { table, id } = req.params;
      const resource = await DB.findById(table, id);
      if (resource[0].owner_id != res.locals.user.id)
        throw new Error('User does not have permission to do this');
      next();
    }
  } catch (err) {
    next(createError(401, err.message));
  }
};

const auth = [
  reqHasToken,
  tokenHasValidProfile,
  profileCanCreateObject,
  profileCanEditObject,
];

module.exports = {
  auth,
  makeToken,
  decodeToken,
};
