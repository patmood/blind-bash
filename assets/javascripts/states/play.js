  // var DEBUG = false
  //   , Rocket = require('../prefabs/rocket')
  //   , Asteroid = require('../prefabs/asteroid')
  //   , Scoreboard = require('../prefabs/scoreboard')
  //   , Shield = require('../prefabs/shield')

var Player = require('../prefabs/player')

function Play() {}
Play.prototype = {
  preload: function() {
    this.game.load.spritesheet('dude', 'images/tank_guy.png', 130, 160)
    this.game.load.image('button', 'images/button_green.png')
    this.sequence = []
  }
, create: function() {
    this.game.stage.backgroundColor = '#182d3b'
    this.player = new Player(this.game, 350, 200)
    this.enemy = new Player(this.game, 420, 200, 'daveo')
    this.game.add.existing(this.player)
    this.game.add.existing(this.enemy)

    var punchButton = this.game.add.button(400, gHeight - 100, 'button', this.move, this)
    punchButton.name = 'punch'
    punchButton.frameNum = 1

    var kickButton = this.game.add.button(400, gHeight - 200, 'button', this.move, this)
    kickButton.name = 'kick'
    kickButton.frameNum = 2

    var jumpButton = this.game.add.button(200, gHeight - 100, 'button', this.move, this)
    jumpButton.name = 'jump'
    jumpButton.frameNum = 3

    var duckButton = this.game.add.button(200, gHeight - 200, 'button', this.move, this)
    duckButton.name = 'duck'
    duckButton.frameNum = 4

  }
, update: function() {

  }
, move: function(item) {
    this.player.move(item.frameNum, item.name)
    this.sequence.push(item.name)
    this.checkEnd()
  }
, checkEnd: function() {
    if (this.sequence.length >= 5) {
      console.log('game over, man game over')
      console.log(this.sequence)
      this.sequence = []
    }
  }
}

module.exports = Play
