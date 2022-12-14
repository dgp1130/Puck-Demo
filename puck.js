function displayTemp() {
  const id = setInterval(() => {
    const temp = Puck.getTemperature();
    print(`Current temp: ${temp}`);

    if (temp < 20) {
      displayBlue();
    } else if (temp > 25) {
      displayRed();
    } else {
      displayYellow();
    }
  }, 1000);

  return () => { clearInterval(id); };
}

function displayAcceleration() {
  let lastAcc;
  const id = setInterval(() => {
    const accel = Puck.accel();
    const acc = accel.acc;

    if (!lastAcc) {
      lastAcc = acc;
      return;
    }

    const distance = dist(acc, lastAcc);
    print(`Distance moved: ${distance}`);

    if (distance < 500) {
      displayRed();
    } else {
      displayGreen();
    }

    lastAcc = acc;
  }, 10);

  return () => { clearInterval(id); };
}

function clear() {
  digitalWrite(LED1, 0);
  digitalWrite(LED2, 0);
  digitalWrite(LED3, 0);
}

function displayRed() {
  digitalWrite(LED1, 1);
  digitalWrite(LED2, 0);
  digitalWrite(LED3, 0);
}

function displayGreen() {
  digitalWrite(LED1, 0);
  digitalWrite(LED2, 1);
  digitalWrite(LED3, 0);
}

function displayBlue() {
  digitalWrite(LED1, 0);
  digitalWrite(LED2, 0);
  digitalWrite(LED3, 1);
}

function displayYellow() {
  digitalWrite(LED1, 1);
  digitalWrite(LED2, 1);
  digitalWrite(LED3, 0);
}

function dist(vec1, vec2) {
  const xDiff = vec1.x - vec2.x;
  const yDiff = vec1.y - vec2.y;
  const zDiff = vec1.z - vec2.z;

  return Math.sqrt((xDiff * xDiff) + (yDiff * yDiff) + (zDiff * zDiff));
}

function onClick(cb) {
  let pendingClickId;
  const id = setWatch((info) => {
    if (info.time - info.lastTime < 0.2) {
      if (pendingClickId) {
        clearInterval(pendingClickId);
        pendingClickId = undefined;
      }

      cb('double');
    } else {
      pendingClickId = setTimeout(() => {
        pendingClickId = undefined;

        cb('single');
      }, 200);
    }
  }, BTN, { repeat: true });

  return () => { clearWatch(id); };
}

function printStatus() {
  const battery = Puck.getBatteryPercentage();

  print(`Waiting for button press to start. Currently at ${battery}% charge.`);
  print("* Single press => Display temperature");
  print("* Double press => Display acceleration");
  print("");
}

function run(handlers) {
  let stop;

  const stopListening = onClick((type) => {
    if (stop) {
      stop();
      stop = undefined;
      clear();

      print("Stopped current application.");
      print("");
      printStatus();

      return;
    }

    if (type === 'single') {
      stop = handlers.onSingleClick.call();
    } else if (type === 'double') {
      stop = handlers.onDoubleClick.call();
    } else {
      throw new Error(`Unknown click type "${type}".`);
    }
  });

  printStatus();

  return () => { stopListening(); };
}

run({
  onSingleClick: () => {
    print("Displaying temperature...");
    return displayTemp();
  },

  onDoubleClick: () => {
    print("Displaying acceleration...");
    return displayAcceleration();
  },
});
