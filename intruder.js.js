const { Board, Led, Button, Motion, Sensor } = require('johnny-five');// it gets needed libraries from johnny-five
const board = new Board();//connection to our maker uno board
//these are the variables that record whether the system is armed, intruder is detected, and also log capturing
let systemArmed = false;
let intrusionDetected = false;
let pirSensitivity = 200; // default sensitivty is 200
const detectionLog = [];// takes/captures logs and store them in arrays
//our first function for when arm button is pressed
function armSystem() {
  systemArmed = true;
  greenLed.on();
  redLed.off();
  intrusionDetected = false;
  stopBuzzerAndRedLed();
  console.log('System Armed');
  detectionLog.push('System armed');// capture log
}
//when u press diarm button
function disarmSystem() {
  systemArmed = false;
  greenLed.off();
  console.log('System Disarmed');
  if (intrusionDetected) {
    stopBuzzerAndRedLed();
  }
  detectionLog.push('System disarmed');
}
// if youwant to increase sensitivity of pir motion sensor
function adjustSensitivity() {
  pirSensitivity = potentiometer.value;
  console.log(`PIR Sensitivity adjusted to: ${pirSensitivity}`);
}
//incase intruder is ddetected, what happens i.e buzzer sound and red LED blinking
function startBuzzerAndRedLed() {
  buzzer.strobe(1000); // Buzzer produces a loud sound
  redLed.blink(500); // Red LED blinks when an intruder is detected
}
//functionfor when disarm button is pressed
function stopBuzzerAndRedLed() {
  buzzer.stop(); // Stop the buzzer
  redLed.stop(); // Stop the red LED blinking
  redLed.off(); // Turn off the red LED
}
// initialisation of arduino compnents we used
board.on('ready', () => {
  const buzzer = new Led(3);
  const redLed = new Led(4); // Red LED
  const greenLed = new Led(5); // Green LED
  const armButton = new Button(6);
  const disarmButton = new Button(7);
  const pir = new Motion(2);
  const potentiometer = new Sensor('A0');

  armButton.on('down', armSystem);//system switched on when arm button is pressed
  disarmButton.on('down', disarmSystem);//system shut down when disarmbutton is pressed
  potentiometer.on('change', adjustSensitivity);

  pir.on('calibrated', () => {
    console.log('Motion sensor calibrated');
  });
//steps undertaken once intruder is detected i.e buzzer sound, then keep logs
  pir.on('motionstart', () => {
    if (systemArmed && !intrusionDetected) {
      console.log('Intruder detected!');
      intrusionDetected = true;
      startBuzzerAndRedLed();
      detectionLog.push('Intruder detected');
    }
  });
//kill the alarm when the intruder is nolonger detected
  pir.on('motionend', () => {
    if (systemArmed && intrusionDetected) {
      stopBuzzerAndRedLed();
    }
  });
});
//end of code