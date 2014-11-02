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
    , allMoves = ['punch', 'kick', 'duck', 'jump']
    , faker = require('faker')
    , _ = require('lodash')

  User.remove({}, function(err) { console.log('Users removed') })
  Move.remove({}, function(err) { console.log('Moves removed') })

  for (var u = 0; u < 20; u ++) {
    var aUser = new User({
      name: faker.name.findName(),
      screen_name: faker.internet.userName(),
      location: faker.address.city(),
      profile_image_url: 'http://placekitten.com/g/64/64'
    })

    aUser.save(function(err, result) {
      if (err) throw err

      var randMoves = []
      for (var i = 0; i < 10; i++) { randMoves.push(_.sample(allMoves)) }

      var aMove = new Move({
        user_id: result._id
      , moves: randMoves
      })

      aMove.save(function(err, result) {
        if (err) throw err;
      })
    })
  }

}

exports.seedProd = function() {
  var User = require('./models/user.js')
    , Move = require('./models/move.js')
    , allMoves = ['punch', 'kick', 'duck', 'jump']
    , faker = require('faker')
    , _ = require('lodash')
    , randMoves = []

  User.findOrCreate(patmood, function(err, user) {
    if (err) { console.log(err); }
    for (var i = 0; i < 10; i++) { randMoves.push(_.sample(allMoves)) }
    var aMove = new Move({
      user_id: user._id
    , moves: randMoves
    })

    aMove.save(function(err, result) {
      if (err) throw err;
    })
  });


}
