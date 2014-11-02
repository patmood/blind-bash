(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var game, gWidth, hHeight

window.onload = function () {
  gWidth = 800 //window.innerWidth // 320
  gHeight = 600 //window.innerHeight // 480
  var game = new Phaser.Game(gWidth, gHeight, Phaser.AUTO, 'game');

  game.state.add('play', require('./states/play'))
  game.state.add('bash', require('./states/bash'))

  game.state.start('play');
}

},{"./states/bash":3,"./states/play":4}],2:[function(require,module,exports){
var moveFrames = {
  'punch': 1
, 'kick': 2
, 'jump': 3
, 'duck': 4
, 'stunned': 0
}

var Player = function(game, x, y, enemy) {
  Phaser.Sprite.call(this, game, x, y, 'dude', 0);

  // Set the pivot point for this sprite to the center
  this.anchor.setTo(0.5, 0.5)
  if (enemy) {
    this.scale.x = -2
    this.scale.y = 2
    this.visible = false
  } else {
    this.scale.x = 2
    this.scale.y = 2
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

},{}],3:[function(require,module,exports){
var Player = require('../prefabs/player')

function Bash() {}
Bash.prototype = {
  init: function(params) {
    this.playerSeq = params.playerSeq
    this.enemySeq = params.enemySeq
    $.ajax({
      type: 'post'
    , contentType: 'application/json'
    , data: JSON.stringify({ moves: this.playerSeq })
    , url: '/save_moves'
    , success: function(res) {
        console.log(res)
      }
    })

  }
, preload: function() {
  }
, create: function() {
    this.game.stage.backgroundColor = '#F23838'

    // Add Players
    this.player = new Player(this.game, 350, 200)
    this.enemy = new Player(this.game, 420, 200, 'daveo')
    this.game.add.existing(this.player)
    this.game.add.existing(this.enemy)

    // Add buttons
    this.game.add.button(300, gHeight - 130, 'button', function() {
      this.game.state.start('play', true, false)
    }, this)

    // Add impact graphics
    this.impact = this.game.add.sprite(270, 20, 'impact')
    this.impact.visible = false

    // Play bash
    this.playBash(this.playerSeq, this.enemySeq)

  }
, update: function() {
    this.game.debug.text(this.player.score, 300, 100)
    this.game.debug.text(this.enemy.score, 450, 100)
  }
, playBash: function(playerSeq, enemySeq) {
    var _this = this
    this.enemy.visible = true

    function makeMove(i) {
      _this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function() {
        if (i >= enemySeq.length ) return;
        if (_this.player.stunned) playerSeq[i] = 'stunned'
        if (_this.enemy.stunned) enemySeq[i] = 'stunned'
        _this.player.stunned = false
        _this.enemy.stunned = false
        _this.checkDamage(playerSeq[i], enemySeq[i])
        _this.player.move(playerSeq[i])
        _this.enemy.move(enemySeq[i])
        makeMove(i + 1)
      }, this)
    }

    makeMove(0)
  }
, checkDamage: function(playerMove, enemyMove) {
    console.log(playerMove, 'vs', enemyMove)
    var _this = this
      , impactFlag = false

    if ((playerMove == 'kick' && enemyMove != 'jump') ||
        (playerMove == 'punch' && enemyMove != 'duck')) {
      this.player.successMove()
      impactFlag = true
    }

    if ((enemyMove == 'kick' && playerMove != 'jump') ||
        (enemyMove == 'punch' && playerMove != 'duck')) {
      this.enemy.successMove()
      impactFlag = true
    }

    if ((playerMove == 'duck' && enemyMove == 'punch') ||
        (playerMove == 'jump' && enemyMove == 'kick')) {
      console.log('enemy stunned!')
      this.enemy.stunned = true
    }

    if ((enemyMove == 'duck' && playerMove == 'punch') ||
        (enemyMove == 'jump' && playerMove == 'kick')) {
      console.log('you are stunned!')
      this.player.stunned = true
    }

    if (impactFlag) this.showImpact()
  }
, showImpact: function() {
    var _this = this
    this.impact.frame = this.game.rnd.integerInRange(0, 2)
    this.impact.visible = true
    this.game.time.events.add(Phaser.Timer.SECOND * 0.2, function() {
      _this.impact.visible = false
    }, this)
  }
}

module.exports = Bash

},{"../prefabs/player":2}],4:[function(require,module,exports){
var Player = require('../prefabs/player')

function Play() {
  this.ready = false
}
Play.prototype = {
  preload: function() {
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this)
    this.game.load.spritesheet('dude', 'images/tank_guy.png', 130, 160)
    this.game.load.spritesheet('impact', 'images/pow_wham_bam.png', 200, 156)
    this.game.load.image('button', 'images/button_green.png')
    this.playerSeq = []
  }
, onLoadComplete: function() {
    this.ready = true
  }
, create: function() {
    var _this = this
    this.game.stage.backgroundColor = '#182d3b'

    // Add Players
    this.player = new Player(this.game, 350, 200)
    this.enemy = new Player(this.game, 420, 200, true)
    this.game.add.existing(this.player)
    this.game.add.existing(this.enemy)

    // Add impact graphics
    this.impact = this.game.add.sprite(270, 20, 'impact')
    this.impact.visible = false

    // Get Enemy
    $.getJSON('/get_moves', function(enemyData) {
      _this.enemyData = enemyData
      _this.enemySeq = enemyData.moves.moves
      _this.game.add.text(300
                       , 50
                       , 'Fighting @' + _this.enemyData.user.screen_name
                       , { font: "24px Arial", fill: "#fff", align: "center" })
      _this.game.add.text(300
                       , 90
                       , _this.enemyData.user.location
                       , { font: "18px Arial", fill: "#fff", align: "center" })
      console.log(enemyData)
    })

    // Add buttons
    var punchButton = this.game.add.button(400, gHeight - 130, 'button', this.move, this)
    punchButton.moveName = 'punch'

    var kickButton = this.game.add.button(400, gHeight - 200, 'button', this.move, this)
    kickButton.moveName = 'kick'

    var jumpButton = this.game.add.button(200, gHeight - 130, 'button', this.move, this)
    jumpButton.moveName = 'jump'

    var duckButton = this.game.add.button(200, gHeight - 200, 'button', this.move, this)
    duckButton.moveName = 'duck'

  }
, update: function() {
  }
, move: function(item) {
    if (this.playerSeq >= 6) return;
    this.player.move(item.moveName)
    this.playerSeq.push(item.moveName)
    this.checkEnd()
  }
, checkEnd: function() {
    if (this.playerSeq.length >= 6) {
      this.game.state.start('bash', true, false, { playerSeq: this.playerSeq
                                                 , enemySeq: this.enemySeq })
    }
  }
}

module.exports = Play

},{"../prefabs/player":2}]},{},[1])