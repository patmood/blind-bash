var express = require('express');
var router = express.Router();

var mongoose = require('mongoose')
  , uriUtil = require('mongodb-uri')
  , options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } }

var mongodbUri = process.env['MONGOLAB_URI']
  , mongooseUri = uriUtil.formatMongoose(mongodbUri)

mongoose.connect(mongooseUri, options);

var findOrCreate = require('mongoose-findorcreate')
  , Schema = mongoose.Schema
var UserSchema = new Schema({
  id: String,
  username: String,
  displayName: String,
  provider: String
})
UserSchema.plugin(findOrCreate)

var User = mongoose.model('User', UserSchema)

var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy

passport.use(new TwitterStrategy({
    consumerKey: process.env['TWITTER_KEY'],
    consumerSecret: process.env['TWITTER_SECRET'],
    callbackURL: "http://localhost:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    console.log(profile)
    User.findOrCreate(profile, function(err, user) {
      if (err) { return done(err); }
      console.log(user)
      done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// ACTUAL ROUTES:

router.get('/', function(req, res) {
  console.log('USER:', req.user)
  res.render('index', { title: 'Express' });
});

module.exports = router;
