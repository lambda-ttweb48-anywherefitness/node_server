const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const DB = require('../../data/dbInterface');
require('dotenv').config();

// JWOT TOKEN HELPERS
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

// AUTH MIDDLEWARE COMPONENTS

// ensure requests have a token
const reqHasToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      throw new Error('Missing Authorization Token');
    next();
  } catch (err) {
    next(createError(401, err.message));
  }
};

// ensure token references valid user profile
const tokenHasValidProfile = async (req, res, next) => {
  try {
    res.locals.user = decodeToken(req.headers.authorization);
    const verify = await DB.findBy('profiles', { id: res.locals.user.id });
    if (verify[0].id != res.locals.user.id)
      throw new Error('User profile does not exist');
    next();
  } catch (err) {
    next(createError(401, err.message));
  }
};

// Restrict class and class_pass creation to registered instructors
const profileCanCreateObject = async (req, res, next) => {
  try {
    if (
      ['classes', 'class_passes'].includes(req.params.table) &&
      res.locals.user.instructor === false
    )
      throw new Error('User must be an instructor');
    next();
  } catch (err) {
    next(createError(401, err.message));
  }
};

// Restrict put/delete actions to objects where user (via token) is the owner of the object.
const profileCanEditObject = async (req, res, next) => {
  try {
    if (!req.params.id) {
      // can ignore for all routes that don't reference a specific item
      next();
    } else {
      const resource = await DB.findById(req.params.table, req.params.id);
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
