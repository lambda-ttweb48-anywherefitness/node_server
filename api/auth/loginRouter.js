const express = require('express');
const bcrypt = require('bcryptjs');
const DB = require('../../data/dbInterface');
const Auth = require('../middleware/auth');
const router = express.Router();

router.post('/', async (req, res) => {
  DB.findBy('profiles', { email: req.body.email })
    .then(async (profiles) => {
      const verifies = bcrypt.compareSync(
        req.body.password,
        profiles[0].password
      );
      if (verifies) {
        //eslint-disable-next-line
        const { password, ...userResp } = profiles[0];
        const token = Auth.makeToken(profiles[0]);
        res.status(200).json({
          user: userResp,
          token: token,
        });
      } else
        res.status(401).json({ message: 'Incorrect username or password' });
    })
    .catch(() => {
      res.status(401).json({ message: 'Email not found' });
    });
});

module.exports = router;
