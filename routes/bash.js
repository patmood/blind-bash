var express = require('express')
  , router = express.Router()
  , User = require('../models/user.js')
  , Move = require('../models/move.js')

router.get('/', function(req, res) {
  res.render('bash');
});

router.get('/moves', function(req, res) {
  Move.findOneRandom(function(err, move) {
    if (err) console.error(err)
    User.findById(move.user_id, function(err, user) {
      if (err) console.error(err)
      return res.json({ enemy: user, moves: move, user: req.user });
    })
  })
});

module.exports = router;
