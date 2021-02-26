var express = require('express');
var router = express.Router();
var DB = require('../data/dbInterface');
//var { authRequired } = require('./middleware/auth');
var { validateResource, validatePayload } = require('./middleware/validate');

router.get('/:table/', validateResource, function (req, res) {
  DB.findAll(req.params.table)
    .then((objs) => {
      res.status(200).json(objs);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.get('/:table/:id', validateResource, function (req, res) {
  res.status(200).json(req.resource);
});

router.post('/:table/', validateResource, validatePayload, async (req, res) => {
  const table = req.params.table;
  DB.create(table, req.body)
    .then((obj) =>
      res.status(201).json({
        message: `${DB.schema[table].friendlyName} created`,
        [DB.schema[table].friendlyName]: obj[0],
      })
    )
    .catch((e) => res.status(500).json({ message: e.message }));
});

router.put('/:table/:id', validateResource, (req, res) => {
  const { table, id } = req.params;
  const update = req.body;
  DB.update(table, id, update)
    .then((updated) => {
      res.status(200).json({
        message: `${DB.schema[table].friendlyName} updated`,
        [DB.schema[table].friendlyName]: updated[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: `Could not update ${DB.schema[table].friendlyName} '${id}'`,
        details: err.message,
      });
    });
});

router.delete('/:table/:id', validateResource, (req, res) => {
  const { table, id } = req.params;
  DB.remove(table, id)
    .then(() => {
      res.status(200).json({
        message: `${DB.schema[table].friendlyName} '${id}' was deleted.`,
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
