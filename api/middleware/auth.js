const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const db = require('../../data/dbInterface');
require('dotenv').config();

const makeToken = (profile) => {
  const payload = {
    subject: profile.id,
    email: profile.email,
    operator: profile.operator,
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

const authCreate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error('Missing Authorization');
    const user = decodeToken(authHeader);
    res.locals.user = await db.findById('profiles', user.subject);
    if (!res.locals.user) throw new Error('Incorrect Authorization');

    if (req.params.table === 'classes' && res.locals.user.operator === false)
      throw new Error('Incorrect Authorization');
    next();
  } catch (err) {
    next(createError(401, err.message));
  }
};

const authEdit = async (req, res, next) => {
  const { table, id } = req.params;
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error('Missing Authorization');
    const user = decodeToken(authHeader);
    res.locals.user = await db.findById('profiles', user.subject);
    if (!res.locals.user) throw new Error('Incorrect Authorization');

    const resource = await db.findById(table, id);
    if (resource.owner_id != res.locals.user.id)
      throw new Error('Incorrect Authorization');
    next();
  } catch (err) {
    next(createError(401, err.message));
  }
};


module.exports = {
  authCreate,
  makeToken,
  authEdit,
};
