var express = require('express')
  , router = express.Router()
  , User = require('../models/user.js')
  , Move = require('../models/move.js')

router.get('/', function(req, res) {
  Move.findOneRandom(function(err, move) {
    if (err) throw err
    User.findById(move.user_id, function(err, user) {
      if (err) throw err
      return res.render('bash', { enemy: user, moves: move, user: req.user });
    })
  })
});

module.exports = router;
