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
