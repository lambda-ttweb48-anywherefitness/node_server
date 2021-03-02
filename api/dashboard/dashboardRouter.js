var express = require('express');
var router = express.Router();
var DB = require('../../data/dbInterface');
var { auth } = require('../middleware/auth');
var { validateQuery } = require('../middleware/validate');

router.get('/:table', validateQuery, auth, function (req, res) {
  DB.findBy(req.params.table, {
    ...res.locals.query,
    [`${req.params.table}.owner_id`]: res.locals.user.id,
  })
    .then((objs) => {
      res.status(200).json(objs);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

module.exports = router;
