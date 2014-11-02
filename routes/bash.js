var express = require('express')
  , router = express.Router()
  , User = require('../models/user.js')
  , Move = require('../models/move.js')

router.get('/', function(req, res) {
  res.render('bash');
});

module.exports = router;
