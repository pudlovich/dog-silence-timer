// // //
// // FUNCTIONS FOR DOM INTERACTION
document.getElementById("start").addEventListener("click", launchTimer);
function launchTimer() {
  const minInt = intervalSelector.getMin();
  const maxInt = intervalSelector.getMax();
  // TODO error if max is lower than min
  const intervalsArray = buildIntervalList(minInt, maxInt);
  setIntervalsArray(intervalsArray);
  console.log(intervalsArray);
  // TODO show intervals Array in UI
  startTimer(getCurrentInterval(), onTimerEnd);
}

class IntervalSelector {
  minColumnRoot = document.getElementById('min-interval-buttons');
  maxColumnRoot = document.getElementById('max-interval-buttons');
  availableMin = [
    { val: 10, label: "0:10"},
    { val: 15, label: "0:15"},
    { val: 20, label: "0:20"},
    { val: 30, label: "0:30"},
    { val: 40, label: "0:40"},
    { val: 60, label: "1:00"},
  ];
  availableMax = [
    { val: 30, label: "0:30"},
    { val: 40, label: "0:40"},
    { val: 60, label: "1:00"},
    { val: 80, label: "1:20"},
    { val: 100, label: "1:40"},
    { val: 120, label: "2:00"},
  ];
  selectedMin = 20;
  selectedMax = 60;

  constructor() {
    this.setUpButtons();
    this.selectMin(20);
    this.selectMax(60);
  }

  getMin() {
    return this.selectedMin;
  }

  getMax() {
    return this.selectedMax;
  }

  selectMin(val) {
    this.selectedMin = val;
    this.unselectMin();
    this.selectButton(`min${val}`);
  }

  selectMax(val) {
    this.selectedMax = val;
    this.unselectMax();
    this.selectButton(`max${val}`);
  }

  setUpButtons() {
    if(this.minColumnRoot) {
      this.availableMin.forEach((minVal) => {
        const button = document.createElement('button');
        button.textContent = minVal.label;
        button.id = `min${minVal.val}`;
        button.className = 'min-interval-button';
        this.minColumnRoot.appendChild(button);
        button.addEventListener('click', () => this.selectMin(minVal.val));
      });
    }
    if(this.maxColumnRoot) {
      this.availableMax.forEach((maxVal) => {
        const button = document.createElement('button');
        button.textContent = maxVal.label;
        button.id = `max${maxVal.val}`;
        button.className = 'max-interval-button';
        this.maxColumnRoot.appendChild(button);
        button.addEventListener('click', () => this.selectMax(maxVal.val));
      });
    }
  }

  unselectMin() {
    document.querySelectorAll('.min-interval-button').forEach(b => b.classList.remove('active'));
  }
  unselectMax() {
    document.querySelectorAll('.max-interval-button').forEach(b => b.classList.remove('active'));
  }
  selectButton(id) {
    const btn = document.getElementById(id);
    if(btn) {
      btn.classList.add('active');
    }
    console.log(`current min: ${this.getMin()}, current max: ${this.getMax()}`)
  }
}

const intervalSelector = new IntervalSelector();

// // //
// // FUNCTIONS FOR BUILDING THE INTERVALS ARRAY BASED ON SELECTED MIN MAX VALUES
// 15 values total, first going by small steps (each repeated), then by large ones
// // small interval for delta<50 is 10% of delta; for delta<80 it's 5, else it's 10
// // large interval is a third of what remains
function buildIntervalList(minVal, maxVal) {
  const delta = maxVal - minVal;
  const smallStep = calculateSmallStep(delta);
  const largeStep = Math.floor((delta - (4 * smallStep)) / 3);

  return [minVal, minVal,
    minVal + smallStep, minVal + smallStep,
    minVal + 2*smallStep, minVal + 2*smallStep,
    minVal + 3*smallStep, minVal + 3*smallStep,
    minVal + 4*smallStep, minVal + 4*smallStep,
    maxVal - 2*largeStep, maxVal - 2*largeStep,
    maxVal - largeStep, maxVal - largeStep,
    maxVal
  ]
}

function calculateSmallStep(delta) {
  if (delta < 50) {
    return Math.floor(delta * 0.1);
  } else if (delta < 80) {
    return 5;
  } else {
    return 10;
  }
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
  osc.stop(audioCtx.currentTime + 0.4); // 400ms

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