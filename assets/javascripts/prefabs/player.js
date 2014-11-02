var moveFrames = {
  'punch': 1
, 'kick': 2
, 'jump': 3
, 'duck': 4
, 'stunned': 0
}

var Player = function(game, x, y, enemy) {
  Phaser.Sprite.call(this, game, x, y, 'dude', 0);

  var scaleFactor = (this.game.height / 2) / 160

  // Set the pivot point for this sprite to the center
  this.anchor.setTo(0.5, 1)
  if (enemy) {
    this.scale.x = scaleFactor * -1
    this.scale.y = scaleFactor
    this.visible = false
  } else {
    this.scale.x = scaleFactor
    this.scale.y = scaleFactor
  }

  this.score = 0
  this.stunned = false

}

Player.prototype = Object.create(Phaser.Sprite.prototype)
Player.prototype.constructor = Player

Player.prototype.move = function(moveName) {
  var _this = this
  this.frame = moveFrames[moveName]
  this.game.time.events.add(Phaser.Timer.SECOND * 0.3, function() {
    this.frame = 0
  }, this)
}

Player.prototype.successMove = function() {
  this.score += 1
}

module.exports = Player
