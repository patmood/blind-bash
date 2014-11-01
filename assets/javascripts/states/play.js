  // var DEBUG = false
  //   , Rocket = require('../prefabs/rocket')
  //   , Asteroid = require('../prefabs/asteroid')
  //   , Scoreboard = require('../prefabs/scoreboard')
  //   , Shield = require('../prefabs/shield')

function Play() {}
Play.prototype = {
  preload: function() {
    this.game.load.spritesheet('dude', 'images/tank_guy.png', 130, 160)
    this.game.load.image('button', 'images/button_green.png')
    this.sequence = []
  }
, create: function() {
    this.game.stage.backgroundColor = '#182d3b'
    this.dude = this.game.add.sprite(300, 200, 'dude')
    var punchButton = this.game.add.button(200, 400, 'button', this.move, this)
    punchButton.name = 'punch'
    punchButton.frameNum = 1

    var kickButton = this.game.add.button(450, 400, 'button', this.move, this)
    kickButton.name = 'kick'
    kickButton.frameNum = 2
  }
, update: function() {

  }
, checkEnd: function() {
    if (this.sequence.length >= 5) {
      console.log('game over, man game over')
      console.log(this.sequence)
    }
  }
, move: function(item) {
    var _this = this
    this.dude.frame = item.frameNum
    this.sequence.push(item.name)
    this.checkEnd()
    setTimeout(function() {
      _this.dude.frame = 0
    }
    , 200)
  }
}

module.exports = Play
