var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , random = require('mongoose-simple-random')

var MoveSchema = new Schema({
  user_id: String,
  moves: Array
})
MoveSchema.plugin(random)


module.exports = mongoose.model('Move', MoveSchema)
