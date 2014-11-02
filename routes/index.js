var express = require('express')
  , router = express.Router()
  , User = require('../models/user.js')
  , Move = require('../models/move.js')

// ACTUAL ROUTES:
router.post('/save_moves', function(req, res) {
  if (!req.user) return res.status(401).send('Please sign in to save moves');
  var move = new Move({ user_id: req.user._id, moves: req.body.moves })
  move.save(function(err, result) {
    if (err) throw err
    return res.json(result.toObject())
  })
})

router.get('/', function(req, res) {
  res.render('index', { title: 'Blind Bash' });
});

module.exports = router;
