var game, gWidth, hHeight

window.onload = function () {
  gWidth = Math.min(window.innerWidth, 800)
  gHeight = window.innerHeight // 600
  var game = new Phaser.Game(gWidth, gHeight, Phaser.AUTO, 'game');

  game.state.add('play', require('./states/play'))
  game.state.add('bash', require('./states/bash'))

  game.state.start('play');
}
