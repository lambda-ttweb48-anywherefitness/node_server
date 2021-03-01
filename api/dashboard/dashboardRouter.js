var express = require('express');
var router = express.Router();
var DB = require('../../data/dbInterface');
var { auth } = require('../middleware/auth');

router.get('/reservations', auth, function (req, res) {
  DB.findReservationsById(res.locals.user.id)
    .then((results) => {
      res.status(200).json(results.rows);
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
