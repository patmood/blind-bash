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
    this.game.stage.backgroundColor = '#182d3b'

    // Add Players
    this.player = new Player(this.game, 350, 200)
    this.enemy = new Player(this.game, 420, 200, true)
    this.game.add.existing(this.player)
    this.game.add.existing(this.enemy)

    // Add impact graphics
    this.impact = this.game.add.sprite(270, 20, 'impact')
    this.impact.visible = false
    this.impact = this.game.add.sprite(450, 150, 'question')

    // Get Enemy
    $.getJSON('/get_moves', function(enemyData) {
      _this.enemyData = enemyData
      _this.enemySeq = enemyData.moves.moves
      _this.game.add.text(400
                       , 50
                       , 'Fighting @' + _this.enemyData.user.screen_name
                       , { font: "24px Arial", fill: "#fff", align: "center" })
      _this.game.add.text(400
                       , 90
                       , 'From ' + _this.enemyData.user.location
                       , { font: "18px Arial", fill: "#fff", align: "center" })
      console.log(enemyData)
    })

    // Add buttons
    var halfWidth = this.game.width / 2
    var quarterHeight = this.game.height / 4
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
