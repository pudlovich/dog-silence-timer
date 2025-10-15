// // //
// // FUNCTIONS FOR LAUNCHING THE TIMER AT THE TOP LEVEL
document.getElementById("startMeal").addEventListener("click", launchMealTimer);
function launchMealTimer() {
  setIntervalsArray([40,40,50,50,60,60,75,75,90,90,105,105,120])
  startTimer(getCurrentInterval(), onTimerEnd);
}

document.getElementById("startSilence").addEventListener("click", launchSilenceTimer);
function launchSilenceTimer() {
  setIntervalsArray([10,10,10,15,15,20,20,25,25,30,30,40,40,50,50,60])
  startTimer(getCurrentInterval(), onTimerEnd);
}

// // //
// // FUNCTIONS FOR MANAGING THE STATE OF INTERVALS ARRAY
var intervalsArray;
var currentIntervalIndex;
function setIntervalsArray(array) {
  intervalsArray = array;
  currentIntervalIndex = 0;
}

function getCurrentInterval() {
  return intervalsArray[currentIntervalIndex];
}

function nextInterval() {
  if(currentIntervalIndex < intervalsArray.length - 1) {
    currentIntervalIndex++;
  }
}

function previousInterval() {
  if(currentIntervalIndex > 0) {
    currentIntervalIndex--;
  }
}

function goToInterval(index) {
  currentIntervalindex = index;
}


// // //
// // FUNCTIONS FOR TIMER FUNCTIONALITY AND "END TIMER" HOOK
// code note – is this really the cleanest option?
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// todo dirty hack for interval variable being accessible; consider cleaning it up into something more object oriented
var timerInterval;
function startTimer(duration, onEnd) {
  clearInterval(timerInterval); // stop any existing timer

  remaining = duration;
  const timerEl = document.getElementById("timer");
  timerEl.textContent = formatTime(remaining);

  timerInterval = setInterval(() => {
    remaining--;
    timerEl.textContent = formatTime(remaining);

    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerEl.textContent = "0:00";
      if (typeof onEnd === "function") onEnd();
    }
  }, 1000);
}

function onTimerEnd() {
  console.log("finished");
  playBeep()
  nextInterval();
  startTimer(getCurrentInterval(), onTimerEnd);
}

// // //
// // FUNCTIONS for end of timer beep
function playBeep() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sawtooth";
  osc.frequency.value = 200; // Hz
  gain.gain.value = 0.04; // volume (0–1)

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.4); // 4200ms

  // Optional cleanup to avoid memory leaks
  osc.onended = () => audioCtx.close();
}

// // //
// // FUNCTIONS FOR HIJACKING THE TIMER FLOW – EARLY SNACKIE, GOOD DOGGO
document.getElementById("early-snackie").addEventListener("click", earlySnackie);
function earlySnackie() {
  console.log("early snackie");
  startTimer(getCurrentInterval(), onTimerEnd);
}

document.getElementById("barking-doggo").addEventListener("click", barkingDoggo);
function barkingDoggo() {
  console.log("barking doggo");
  startTimer(getCurrentInterval(), onTimerEnd);
}