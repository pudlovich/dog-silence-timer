// // //
// // FUNCTIONS FOR LAUNCHING THE TIMER AT THE TOP LEVEL
document.getElementById("start").addEventListener("click", launchTimer);
function launchTimer() {
  startTimer(5, onTimerEnd);
}

// // //
// // FUNCTIONS FOR MANAGING THE STATE OF INTERVALS ARRAY

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
  startTimer(5, onTimerEnd);
}

// // //
// // FUNCTIONS FOR HIJACKING THE TIMER FLOW – EARLY SNACKIE, GOOD DOGGO
document.getElementById("early-snackie").addEventListener("click", earlySnackie);
function earlySnackie() {
  console.log("early snackie");
  startTimer(5, onTimerEnd);
}

document.getElementById("barking-doggo").addEventListener("click", barkingDoggo);
function barkingDoggo() {
  console.log("barking doggo");
  startTimer(5, onTimerEnd);
}