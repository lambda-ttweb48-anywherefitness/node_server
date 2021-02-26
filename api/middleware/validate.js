const DB = require('../../data/dbInterface');

const validateResource = async (req, res, next) => {
  const { table, id } = req.params;
  console.log(table);
  if (!DB.schema[table]) {
    res.status(404).json({ error: `Resource ${table} does not exist` });
  } else if (id === undefined) {
    next();
  } else {
    try {
      const resource = await DB.findById(table, id);
      if (resource) {
        req.resource = resource;
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

  DB.schema[table].requiredFields.forEach((field) => {
    if (!req.body[field]) {
      res.status(400).json({ message: 'Please provide required info' });
    }
  });
  next();
};

module.exports = {
  validateResource,
  validatePayload,
};
