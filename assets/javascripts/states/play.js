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
