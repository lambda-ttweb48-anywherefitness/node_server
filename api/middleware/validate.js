const DB = require('../../data/dbInterface');

const validateResource = async (req, res, next) => {
  const { table, id } = req.params;

  if (!DB.schema[table] || table === 'profiles') {
    res.status(404).json({ error: `Resource ${table} does not exist` });
  } else if (id === undefined) {
    next();
  } else {
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

const validatePayload = async (req, res, next) => {
  const table = req.params.table ? req.params.table : 'profiles';
  const payload = req.body;

  DB.schema[table].requiredFields.forEach((field) => {
    if (!req.body[field]) {
      res.status(400).json({ message: 'Please provide required info' });
    }
  });

  if (table === 'class_cards') {
    res.locals.payload = res.locals.user
      ? { ...payload, issued_by: res.locals.user.id }
      : payload;
    next();
  } else {
    res.locals.payload = res.locals.user
      ? { ...payload, owner_id: res.locals.user.id }
      : payload;
    next();
  }
};

module.exports = {
  validateResource,
  validatePayload,
};
