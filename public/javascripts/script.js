(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var game, gWidth, hHeight

window.onload = function () {
  gWidth = window.innerWidth // 800
  gHeight = window.innerHeight // 600
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
    var halfWidth = this.game.width / 2
    var quarterHeight = this.game.height / 4

    // Add Players
    this.player = new Player(this.game, halfWidth, quarterHeight * 2)
    this.enemy = new Player(this.game, halfWidth, quarterHeight * 2, true)
    this.player.x = halfWidth - this.player.width * 0.2
    this.enemy.x = halfWidth - this.enemy.width * 0.2
    this.game.add.existing(this.player)
    this.game.add.existing(this.enemy)
    this.player.visible = false
    this.enemy.visible = false

    // Add buttons
    this.resetButton = this.game.add.button(0, gHeight - quarterHeight , 'green', function() {
      this.game.state.start('play', true, false)
    }, this)
    this.resetButton.visible = false
    this.resetButton.width = halfWidth * 2
    this.resetButton.height = quarterHeight * 2

    // Add impact graphics
    this.impact = this.game.add.sprite(halfWidth, quarterHeight, 'impact')
    this.impact.visible = false
    this.impact.anchor.setTo(0.5, 0.5)

    this.setStage()
  }
, update: function() {
    // this.game.debug.text(this.player.score, 300, 100)
    // this.game.debug.text(this.enemy.score, 450, 100)
  }
, setStage: function() {
    this.line1 = this.game.add.bitmapText(10
                , 10
                , 'regFont'
                , 'Let\'s see how you went...'
                , 36)
    this.line1.x = this.game.width * 0.5 - this.line1.textWidth * 0.5

    // Play bash
    this.game.input.onDown.addOnce(function(){
      this.line1.text = ''
      this.player.visible = true
      this.enemy.visible = true
      this.playBash(this.playerSeq, this.enemySeq)
    }, this)
  }
, playBash: function(playerSeq, enemySeq) {
    var _this = this
    this.enemy.visible = true

    function makeMove(i) {
      _this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function() {
        if (i >= enemySeq.length ) return _this.endGame();
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
    // console.log(playerMove, 'vs', enemyMove)
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
, endGame: function() {
    var diff = this.player.score - this.enemy.score
    var text
    if (diff > 0) { text = 'You won!' }
    if (diff < 0) { text = 'You lost!' }
    if (diff == 0) { text = 'Draw!' }

    this.line1.text = text
    this.line1.x = this.game.width * 0.5 - this.line1.textWidth * 0.5
    this.resetButton.visible = true
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
    this.load.bitmapFont('regFont', 'images/font.png', 'images/font.fnt')
    this.game.load.spritesheet('dude', 'images/tank_guy.png', 130, 160)
    this.game.load.spritesheet('impact', 'images/pow_wham_bam.png', 200, 156)
    this.game.load.image('button', 'images/button_green.png')
    this.game.load.image('question', 'images/question_mark.png')
    this.game.load.image('green', 'images/green.png')
    this.game.load.image('red', 'images/red.png')
    this.game.load.image('yellow', 'images/yellow.png')
    this.game.load.image('blue', 'images/blue.png')
    this.playerSeq = []
  }
, onLoadComplete: function() {
    this.ready = true
  }
, create: function() {
    var _this = this
    var halfWidth = this.game.width * 0.5
    var quarterHeight = this.game.height * 0.24
    this.game.stage.backgroundColor = '#182d3b'

    // Add Players
    this.player = new Player(this.game, halfWidth, quarterHeight * 2)
    this.enemy = new Player(this.game, 420, 200, true)
    this.game.add.existing(this.player)
    this.game.add.existing(this.enemy)

    // Add question mark
    this.question = this.game.add.sprite(halfWidth + this.player.width * 0.5
                                       , quarterHeight
                                       , 'question')
    this.question.anchor.setTo(0.5, 0.5)

    // Get Enemy
    $.getJSON('/get_moves', function(enemyData) {
      _this.enemyData = enemyData
      _this.enemySeq = enemyData.moves.moves
      var line1 = _this.game.add.bitmapText(10
                  , 10
                  , 'regFont'
                  , 'Fighting @' + _this.enemyData.user.screen_name
                  , 36)
      line1.x = _this.game.width * 0.5 - line1.textWidth * 0.5

      var line2 = _this.game.add.bitmapText(10
                  , 50
                  , 'regFont'
                  , 'From ' + _this.enemyData.user.location
                  , 24)
      line2.x = _this.game.width * 0.5 - line2.textWidth * 0.5
      console.log(enemyData)
    })

    // Add buttons
    var punchButton = this.game.add.button(halfWidth, quarterHeight * 2, 'red', this.move, this)
    punchButton.moveName = 'punch'
    punchButton.width = halfWidth
    punchButton.height = quarterHeight

    var kickButton = this.game.add.button(halfWidth, quarterHeight * 3, 'green', this.move, this)
    kickButton.moveName = 'kick'
    kickButton.width = halfWidth
    kickButton.height = quarterHeight

    var jumpButton = this.game.add.button(0, quarterHeight * 2, 'blue', this.move, this)
    jumpButton.moveName = 'jump'
    jumpButton.width = halfWidth
    jumpButton.height = quarterHeight

    var duckButton = this.game.add.button(0, quarterHeight * 3, 'yellow', this.move, this)
    duckButton.moveName = 'duck'
    duckButton.width = halfWidth
    duckButton.height = quarterHeight

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