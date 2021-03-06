const DB = require('../../data/dbInterface');

const validateResource = async (req, res, next) => {
  const { table, id } = req.params;

  // check to make sure table exists, exclude profiles
  if (!DB.schema[table] || table === 'profiles') {
    res.status(404).json({ error: `Resource ${table} does not exist` });
  } else if (id === undefined) {
    // if no resource id can move forward
    next();
  } else {
    // else look for that object and pass it through in locals
    try {
      const resource = await DB.findById(table, id);

      if (resource[0]) {
        req.resource = resource[0];
        next();
      } else {
        res.status(404).json({
          error: `${DB.schema[table].friendlyName} ${id} not found.`,
        });
      }
    } catch {
      res.status(500).json({
        error: 'Unable to perform that request',
      });
    }
  }
};

const createClientPassPayload = async (pass_id) => {
  let payload;
  try {
    const cp = await DB.findBy('class_passes', { 'class_passes.id': pass_id });
    payload = {
      instructor_id: cp[0].owner_id,
      total_classes: cp[0].total_classes,
      price_paid: cp[0].price,
    };
    return payload;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const validatePayload = async (req, res, next) => {
  const table = req.params.table ? req.params.table : 'profiles';
  const payload = req.body;

  // check to make sure all required fields are present
  DB.schema[table].requiredFields.forEach((field) => {
    if (!req.body[field]) {
      res.status(400).json({ message: 'Please provide required info' });
    }
  });

  // construct client pass fields out of class_pass
  res.locals.payload =
    table === 'client_passes'
      ? await createClientPassPayload(payload.class_pass_id)
      : payload;

  // add owner_id from token
  res.locals.payload = res.locals.user
    ? { ...res.locals.payload, owner_id: res.locals.user.id }
    : payload;

  next();
};

const validateQuery = async (req, res, next) => {
  const paramKeys = Object.keys(req.query);

  // if no keys set filter to blank object and move on
  if (paramKeys.length === 0) {
    res.locals.query = {};
    next();
  } else {
    // test all keys against valid search fields and push to errors if any
    var errors = [];
    for (var i = 0; i < paramKeys.length; i++) {
      var key = paramKeys[i];
      if (DB.schema[req.params.table].searchFields.indexOf(key) == -1) {
        errors.push(key);
      }
    }

    // return errors if there are any
    if (errors.length > 0) {
      res.status(400).json({
        message: 'Please provide valid query params',
        invalidFields: errors,
      });
    } else {
      // add table names to keys and return res locals
      paramKeys.forEach((key) => {
        res.locals.query = {
          ...res.locals.query,
          [`${req.params.table}.${key}`]: req.query[key],
        };
      });
      next();
    }
  }
};

module.exports = {
  validateResource,
  validatePayload,
  validateQuery,
};
