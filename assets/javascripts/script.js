window.onload = function () {
  var width = 800 //window.innerWidth // 320
  var height = 600 //window.innerHeight // 480
  var game = new Phaser.Game(width, height, Phaser.AUTO, 'game');

  game.state.add('play', require('./states/play'))

  game.state.start('play');
}
