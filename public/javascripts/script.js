(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var game, gWidth, hHeight

window.onload = function () {
  gWidth = 800 //window.innerWidth // 320
  gHeight = 600 //window.innerHeight // 480
  var game = new Phaser.Game(gWidth, gHeight, Phaser.AUTO, 'game');

  game.state.add('play', require('./states/play'))

  game.state.start('play');
}

},{"./states/play":3}],2:[function(require,module,exports){
var moveFrames = {
  'punch': 1
, 'kick': 2
, 'jump': 3
, 'duck': 4
}

var Player = function(game, x, y, enemy) {
  Phaser.Sprite.call(this, game, x, y, 'dude', 0);

  // Set the pivot point for this sprite to the center
  this.anchor.setTo(0.5, 0.5)
  if (enemy) {
    this.scale.x = -2
    this.scale.y = 2
  } else {
    this.scale.x = 2
    this.scale.y = 2
  }

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

module.exports = Player

},{}],3:[function(require,module,exports){
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

    this.playBash()

  }
, update: function() {

  }
, move: function(item) {
    this.player.move(item.moveName)
    this.sequence.push(item.moveName)
    this.checkEnd()
  }
, checkEnd: function() {
    if (this.sequence.length >= 5) {
      console.log('game over, man game over')
      console.log(this.sequence)
      this.sequence = []
    }
  }
, playBash: function(playerSeq, enemySeq) {
    var playerSeq = ['kick']
      , enemySeq = ['punch', 'punch', 'jump', 'duck']

    var _this = this
    enemySeq.forEach(function(moveName) {
      _this.enemy.move(moveName)
    })
  }
}

module.exports = Play

},{"../prefabs/player":2}]},{},[1])