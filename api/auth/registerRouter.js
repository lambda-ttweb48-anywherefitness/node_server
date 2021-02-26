const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const DB = require('../../data/dbInterface');
const Auth = require('../middleware/auth');
const { validatePayload } = require('../middleware/validate');
const router = express.Router();

router.post('/', validatePayload, async (req, res) => {
  const profile = req.body;
  DB.findBy('profiles', { email: profile.email })
    .then((rows) => {
      // we will create a new profile only if no rows returned
      if (rows.length < 1) {
        const uuid = uuidv4();
        const hash = bcrypt.hashSync(profile.password);

        DB.create('profiles', { ...profile, id: uuid, password: hash })
          .then((profile) => {
            const token = Auth.makeToken(profile);
            //eslint-disable-next-line
            const { password, ...profResp } = profile[0];
            res.status(201).json({ profile: profResp, token: token });
          })
          .catch((error) => {
            res.status(500).json({
              error: 'Could not add new user',
              details: error.message,
            });
          });
      } else {
        res
          .status(401)
          .json({ error: 'An account with this email address already exists' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
