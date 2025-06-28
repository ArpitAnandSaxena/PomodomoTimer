const timerEl = document.getElementById('timer');
const statusText = document.getElementById('statusText');
const ring = document.getElementById('ring-progress');
const themeSelect = document.getElementById('themeSelect');
const flipClock = document.querySelector('.flip-clock');

let sessionDuration = 0;
let sessionRemaining = 0;
let isRunning = false;
let interval = null;

window.onload = () => {
  const savedFocus = localStorage.getItem("focusTime");
  const savedBreak = localStorage.getItem("breakTime");
  const savedTheme = localStorage.getItem("theme");

  if (savedFocus) document.getElementById('focusInput').value = savedFocus;
  if (savedBreak) document.getElementById('breakInput').value = savedBreak;
  if (savedTheme) {
    themeSelect.value = savedTheme;
    applyTheme(savedTheme);
  }

  // Load timer state
  const savedRemaining = parseInt(localStorage.getItem("sessionRemaining"));
  const savedDuration = parseInt(localStorage.getItem("sessionDuration"));
  const wasRunning = localStorage.getItem("isRunning") === "true";

  if (!isNaN(savedRemaining) && !isNaN(savedDuration)) {
    sessionRemaining = savedRemaining;
    sessionDuration = savedDuration;
    updateUI();
    if (wasRunning) {
      isRunning = false; // User must click start
      statusText.innerText = "Press Start Button";
    }
  }
};

function formatTime(seconds) {
  const min = Math.floor(seconds / 60).toString().padStart(2, '0');
  const sec = (seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

function updateRing(remaining, total) {
  const radius = ring.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (remaining / total) * circumference;
  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = offset;
}

function updateUI() {
  const formattedTime = formatTime(sessionRemaining);
  timerEl.innerText = formattedTime;
  flipClock.innerText = formattedTime;
  updateRing(sessionRemaining, sessionDuration || 1);

  // Save timer state
  localStorage.setItem("sessionRemaining", sessionRemaining);
  localStorage.setItem("sessionDuration", sessionDuration);
  localStorage.setItem("isRunning", isRunning);

  // ✅ Update page title with time
  document.title = `${formattedTime} - ${statusText.innerText}`;
}



function applyCustomTime() {
  const focusVal = parseInt(document.getElementById('focusInput').value) || 25;
  const breakVal = parseInt(document.getElementById('breakInput').value) || 5;
  localStorage.setItem("focusTime", focusVal);
  localStorage.setItem("breakTime", breakVal);
  sessionDuration = focusVal * 60;
  sessionRemaining = sessionDuration;
  isRunning = false;
  clearInterval(interval);
  statusText.innerText = "Custom Time Set";
  updateUI();
}

function startSession(mins) {
  sessionDuration = mins * 60;
  sessionRemaining = sessionDuration;
  isRunning = false;
  clearInterval(interval);
  statusText.innerText = "Work Started";
  updateUI();
}

function startBreak() {
  const breakVal = parseInt(document.getElementById('breakInput').value) || 5;
  sessionDuration = breakVal * 60;
  sessionRemaining = sessionDuration;
  isRunning = false;
  clearInterval(interval);
  statusText.innerText = "Break Time";
  updateUI();
}

function startTimer() {
  if (!isRunning && sessionRemaining > 0) {
    isRunning = true;
    interval = setInterval(() => {
      statusText.innerText = "Resume";
      sessionRemaining--;
      updateUI();
      if (sessionRemaining <= 0) {
        clearInterval(interval);
        isRunning = false;
        statusText.innerText = "Session Complete!";
        updateUI();
      }
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(interval);
  isRunning = false;
  statusText.innerText = "Paused";
  updateUI();
}

function resetTimer() {
  clearInterval(interval);
  isRunning = false;
  sessionRemaining = sessionDuration;
  statusText.innerText = "Reset";
  updateUI();
}

function toggleFullscreen() {
  const container = document.querySelector('.ring-container');
  if (!document.fullscreenElement) {
    container.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

document.addEventListener("fullscreenchange", () => {
  const svg = document.querySelector("#progress-ring");
  const timerText = document.getElementById("timer");
  const fullscreenControls = document.querySelector(".fullscreen-controls");

  if (document.fullscreenElement) {
    svg.style.display = "none";
    flipClock.style.display = "flex";
    timerText.style.display = "none";
    fullscreenControls.style.display = "flex";
  } else {
    svg.style.display = "block";
    flipClock.style.display = "none";
    timerText.style.display = "block";
    fullscreenControls.style.display = "none";
  }
});

themeSelect.addEventListener('change', () => {
  const selectedTheme = themeSelect.value;
  localStorage.setItem("theme", selectedTheme);
  applyTheme(selectedTheme);
});

document.getElementById('clearStorageBtn').addEventListener('click', () => {
  localStorage.clear();
  clearInterval(interval);
  sessionDuration = 0;
  sessionRemaining = 0;
  isRunning = false;
  updateUI();
  themeSelect.value = "light";
  applyTheme("light");
  document.getElementById('focusInput').value = 25;
  document.getElementById('breakInput').value = 5;
  statusText.innerText = "Reset to Default";
  alert("Settings cleared! Timer reset.");
});

// Theme-related helper functions
function applyTheme(theme) {
  const body = document.body;
  const flipClock = document.querySelector(".flip-clock");
  const container = document.querySelector(".ring-container");

  body.style.backgroundImage = "";
  container.style.backgroundImage = "";
  flipClock.style.backgroundImage = "";
  body.style.backgroundColor = "";
  body.style.color = "";

  switch (theme) {
    case "light":
      body.style.backgroundColor = "#f7f7f7";
      applyTextColor("#000");
      break;
    case "dark":
      body.style.backgroundColor = "#171616";
      applyTextColor("#e4e1e1");
      break;
   
    case "green":
      body.style.backgroundColor = "#1B2B2B";
      applyTextColor("#DFFFE0");
      break;
   ;
    case "image":
      bgSetImage("Minimal Modern You Are Enough Quote Desktop Wallpaper/1.png");
      fullScreenImageSet("Minimal Modern You Are Enough Quote Desktop Wallpaper/7.png");
      break;
    case "image1":
      bgSetImage("Minimal Modern You Are Enough Quote Desktop Wallpaper/1 (2).png");
      fullScreenImageSet("Minimal Modern You Are Enough Quote Desktop Wallpaper/1 (2).png");
      break;
    case "image2":
      bgSetImage("Minimal Modern You Are Enough Quote Desktop Wallpaper/12.png");
      fullScreenImageSet("Minimal Modern You Are Enough Quote Desktop Wallpaper/12.png");
      break;
   
    
    default:
      body.style.backgroundColor = "#f7f7f7";
      applyTextColor("#000");
  }
}

function bgSetImage(bgUrl) {
  const body = document.body;
  body.style.backgroundImage = `url('${bgUrl}')`;
  body.style.backgroundSize = "cover";
  body.style.backgroundPosition = "center";
  body.style.backgroundRepeat = "no-repeat";
  applyTextColor("#fff");
}

function fullScreenImageSet(bgUrl) {
  const flipClock = document.querySelector(".flip-clock");
  flipClock.style.backgroundImage = `url('${bgUrl}')`;
  flipClock.style.backgroundSize = "cover";
  flipClock.style.backgroundPosition = "center";
}

function applyTextColor(color) {
  document.body.style.color = color;
  document.querySelectorAll("h1, label, #statusText").forEach(el => {
    el.style.color = color;
  });
  document.querySelectorAll("input").forEach(el => {
    el.style.color = color;
    el.style.borderColor = color;
    el.style.backgroundColor = "rgba(0,0,0,0.2)";
  });
}