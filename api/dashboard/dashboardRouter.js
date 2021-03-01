var express = require('express');
var router = express.Router();
var DB = require('../../data/dbInterface');
var { auth } = require('../middleware/auth');

router.get('/reservations', auth, function (req, res) {
  DB.findClassesBy({ ['reservations.owner_id']: res.locals.user.id })
    .then((classes) => {
      res.status(200).json(classes);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.get('/classes', auth, function (req, res) {
  DB.findClassesBy({ ['classes.owner_id']: res.locals.user.id })
    .then((objs) => {
      res.status(200).json(objs);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

module.exports = router;
