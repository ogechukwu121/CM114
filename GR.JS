const { Board, Led } = require('johnny-five');
const board = new Board();
let greenLed;
let redLed;
board.on('ready', () => {
  greenLed = new Led(5); 
  redLed = new Led(4);
  greenLed.blink(500);
  redLed.blink(1000);
});
