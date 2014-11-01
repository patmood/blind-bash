var game, gWidth, hHeight

window.onload = function () {
  gWidth = 800 //window.innerWidth // 320
  gHeight = 600 //window.innerHeight // 480
  var game = new Phaser.Game(gWidth, gHeight, Phaser.AUTO, 'game');

  game.state.add('play', require('./states/play'))

  game.state.start('play');
}
