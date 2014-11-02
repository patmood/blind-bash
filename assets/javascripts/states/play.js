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
    this.game.load.image('ring', 'images/boxingring.jpg')
    this.load.audio('hit', 'sound/hit.wav')
    this.load.audio('jump', 'sound/jump.wav')
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
    var _this = this
    $.getJSON('/bash/moves/', function(data) {
      window.moveData = data
      _this.enemyData = {
        user: data.enemy
      , moves: data.moves
      }

      _this.userData = { user: data.user }

      console.log(data)
      _this.enemySeq = _this.enemyData.moves.moves
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

    // Button Text
    var punchText = this.game.add.bitmapText(0
                , punchButton.y + punchButton.height * 0.5
                , 'regFont'
                , 'Punch'
                , 36)
    punchText.x = punchButton.x + punchButton.width * 0.5 - punchText.textWidth * 0.5

    var kickText = this.game.add.bitmapText(0
                , this.game.height - kickButton.height * 0.5
                , 'regFont'
                , 'Kick'
                , 36)
    kickText.x = kickButton.x + kickButton.width * 0.5 - kickText.textWidth * 0.5

    var jumpText = this.game.add.bitmapText(0
                , jumpButton.y + jumpButton.height * 0.5
                , 'regFont'
                , 'Jump'
                , 36)
    jumpText.x = jumpButton.x + jumpButton.width * 0.5 - jumpText.textWidth * 0.5

    var duckText = this.game.add.bitmapText(0
                , this.game.height - duckButton.height * 0.5
                , 'regFont'
                , 'Duck'
                , 36)
    duckText.x = duckButton.x + duckButton.width * 0.5 - duckText.textWidth * 0.5

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
    if (this.playerSeq.length >= 15) {
      this.game.state.start('bash', true, false, { playerSeq: this.playerSeq
                                                 , enemySeq: this.enemySeq })
    }
  }
}

module.exports = Play
