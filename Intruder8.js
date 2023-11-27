const { Board, Motion, Led, Piezo, Sensor } = require("johnny-five");
const board = new Board();

const logArray = []; 
let systemArmed = true; 
let sensitivity = 50; 

board.on("ready", () => {
  const pir = new Motion(2);
  const led = new Led(7);
  const buzzer = new Piezo(9); 
  const potentiometer = new Sensor("A0"); 
  
  potentiometer.on("change", () => {
    
    sensitivity = Math.round((potentiometer.scaleTo(0, 100)));
    console.log("Sensitivity adjusted:", sensitivity);
  });

  pir.on("calibrated", () => {
    console.log("Motion sensor calibrated");
  });

  pir.on("motionstart", () => {
    
    if (systemArmed) {
      const logMessage = "Intruder detected!";
      console.log(logMessage);
      logArray.push(logMessage);

      led.on();
      buzzer.play({ song: "C4", beats: 1 / 4, tempo: 100 });
    }
  });

  pir.on("motionend", () => {
    const logMessage = "Motion ended";
    console.log(logMessage);
    logArray.push(logMessage);

    led.off();
    buzzer.off();
  });
});

setTimeout(() => {
  console.log("Stored logs:", logArray);
}, 3000); 
