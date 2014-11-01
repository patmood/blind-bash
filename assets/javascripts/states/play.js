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
    punchButton.moveName = 'punch'
    // punchButton.frameNum = 1

    var kickButton = this.game.add.button(400, gHeight - 200, 'button', this.move, this)
    kickButton.moveName = 'kick'
    // kickButton.frameNum = 2

    var jumpButton = this.game.add.button(200, gHeight - 100, 'button', this.move, this)
    jumpButton.moveName = 'jump'
    // jumpButton.frameNum = 3

    var duckButton = this.game.add.button(200, gHeight - 200, 'button', this.move, this)
    duckButton.moveName = 'duck'
    // duckButton.frameNum = 4

  }
, update: function() {

  }
, move: function(item) {
    this.player.move(item.moveName)
    this.sequence.push(item.moveName)
    this.checkEnd()
  }
, checkEnd: function() {
    if (this.sequence.length >= 6) {
      console.log('game over, man game over')
      this.playBash(this.sequence)
    }
  }
, playBash: function(playerSeq, enemySeq) {
    var enemySeq = ['punch', 'punch', 'jump', 'duck', 'punch', 'kick']
    var _this = this

    function makeMove(i) {
      _this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function() {
        if (i < enemySeq.length ) {
          _this.player.move(playerSeq[i])
          _this.enemy.move(enemySeq[i])
          makeMove(i + 1)
        } else {
          console.log('DONE')
        }
      }, _this)

    }

    makeMove(0)

    this.sequence = []
  }
}

module.exports = Play
