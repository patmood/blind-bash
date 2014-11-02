var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , findOrCreate = require('mongoose-findorcreate')

var UserSchema = new Schema({
  name: String,
  screen_name: String,
  location: String,
  profile_image_url: String
})
UserSchema.plugin(findOrCreate)

module.exports = mongoose.model('User', UserSchema)
