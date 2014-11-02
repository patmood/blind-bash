exports.setup = function() {
  var mongoose = require('mongoose')
    , fs = require('fs')
    , uriUtil = require('mongodb-uri')
    , options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } }

  var mongodbUri = process.env['MONGOLAB_URI']
    , mongooseUri = uriUtil.formatMongoose(mongodbUri)

  mongoose.connect(mongooseUri, options);

  // Load models
  fs.readdirSync(__dirname + '/models').forEach(function (file) {
    if (~file.indexOf('.js')) require(__dirname + '/models/' + file);
  });
}

exports.seed = function() {
  var User = require('./models/user.js')
    , Move = require('./models/move.js')

  var aMove = new Move({
    user_id: Math.floor(Math.random()*1000000).toString()
  , moves: ['punch', 'kick', 'duck', 'jump', 'kick', 'kick']
  })

  aMove.save(function(err, result) {
    if (err) throw err;
    console.log(result)
  })
}
