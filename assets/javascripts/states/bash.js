var Player = require('../prefabs/player')

function Bash() {}
Play.prototype = {
  preload: function() {
    this.game.load.spritesheet('dude', 'images/tank_guy.png', 130, 160)
    this.game.load.spritesheet('impact', 'images/pow_wham_bam.png', 200, 156)
    this.game.load.image('button', 'images/button_green.png')
    this.sequence = []
  }
, create: function() {
    this.game.stage.backgroundColor = '#182d3b'

    // Add Players
    this.player = new Player(this.game, 350, 200)
    this.enemy = new Player(this.game, 420, 200, 'daveo')
    this.game.add.existing(this.player)
    this.game.add.existing(this.enemy)

    this.impact = this.game.add.sprite(270, 20, 'impact')
    this.impact.visible = false

    // Add impact graphics

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
    this.game.debug.text(this.player.score, 300, 100)
    this.game.debug.text(this.enemy.score, 450, 100)

  }
, move: function(item) {
    if (this.sequence >= 6) return;
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

    this.sequence = []
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

module.exports = Play
