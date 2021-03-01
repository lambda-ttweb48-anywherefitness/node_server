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

const auth = async (req, res, next) => {
  try {
    // make sure they sent a token
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error('Missing Authorization Token');

    // make sure that the profile from token still exists
    res.locals.user = decodeToken(authHeader);
    const verify = await DB.findById('profiles', res.locals.user.id);
    if (verify.id != res.locals.user.id)
      throw new Error('User token does not exist');

    // only instructors can create new classes
    if (req.params.table === 'classes' && res.locals.user.operator === false)
      throw new Error('User must be an instructor');

    // ensure that only an object's owner can edit or delete it
    if (!req.params.id) {
      next();
    } else {
      const { table, id } = req.params;
      const resource = await DB.findById(table, id);
      if (resource.owner_id != res.locals.user.id)
        throw new Error('User must be resource owner');
      next();
    }
  } catch (err) {
    next(createError(401, err));
  }
};

module.exports = {
  auth,
  makeToken,
  decodeToken,
};
