var express = require('express');
var router = express.Router();
var DB = require('../data/dbInterface');
var { auth } = require('./middleware/auth');
var {
  validateResource,
  validatePayload,
  validateQuery,
} = require('./middleware/validate');

router.get('/:table/', validateResource, validateQuery, function (req, res) {
  DB.findBy(req.params.table, res.locals.query)
    .then((objs) => {
      res.status(200).json(objs);
    })
    .catch((err) => {
      res.status(500).json({
        message: `Could not find ${DB.schema[req.params.table].friendlyName}s`,
        error: err.message,
      });
    });
});

router.get('/:table/:id', validateResource, function (req, res) {
  res.status(200).json(req.resource);
});

router.post(
  '/:table/',
  auth,
  validateResource,
  validatePayload,
  async (req, res) => {
    const table = req.params.table;
    DB.create(table, res.locals.payload)
      .then((obj) =>
        res.status(201).json({
          message: `${DB.schema[table].friendlyName} created`,
          [DB.schema[table].friendlyName]: obj[0],
        })
      )
      .catch((err) =>
        res.status(500).json({
          message: `Could not create ${DB.schema[table].friendlyName}.`,
          error: err.message,
        })
      );
  }
);

router.put('/:table/:id', validateResource, auth, (req, res) => {
  const { table, id } = req.params;
  DB.update(table, id, req.body)
    .then((updated) => {
      res.status(200).json({
        message: `${DB.schema[table].friendlyName} updated`,
        [DB.schema[table].friendlyName]: updated[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: `Could not update ${DB.schema[table].friendlyName} '${id}'`,
        error: err.message,
      });
    });
});

router.delete('/:table/:id', validateResource, auth, (req, res) => {
  const { table, id } = req.params;
  DB.remove(table, id)
    .then(() => {
      res.status(200).json({
        message: `${DB.schema[table].friendlyName} '${id}' deleted.`,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: `Could not delete ${DB.schema[table].friendlyName} with ID: ${id}`,
        error: err.message,
      });
    });
});

module.exports = router;
