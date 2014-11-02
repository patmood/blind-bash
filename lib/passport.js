var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , User = require('../models/user.js')

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// This could probably be done better than in one export
module.exports = function(app) {
  // This sets up the 'authorize function'
  passport.use(new TwitterStrategy({
      consumerKey: process.env['TWITTER_KEY'],
      consumerSecret: process.env['TWITTER_SECRET'],
      callbackURL: process.env['DOMAIN'] + "/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
      User.findOrCreate(profile._json, function(err, user) {
        if (err) { return done(err); }
        done(null, user);
      });
    }
  ));
}


