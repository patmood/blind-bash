(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.onload = function () {
  var width = 800 //window.innerWidth // 320
  var height = 600 //window.innerHeight // 480
  var game = new Phaser.Game(width, height, Phaser.AUTO, 'game');

  game.state.add('play', require('./states/play'))

  game.state.start('play');
}

},{"./states/play":2}],2:[function(require,module,exports){
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
    debugger
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

},{}]},{},[1])