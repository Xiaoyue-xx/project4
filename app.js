"use strict";

const app = document.querySelector("#app");
const startScreen = document.querySelector("#start-screen");
const enterButton = document.querySelector("#enter-button");
const pauseButton = document.querySelector("#pause-button");
const pauseScreen = document.querySelector("#pause-screen");
const status = document.querySelector("#status");
const clue = document.querySelector("#clue");
const progress = document.querySelector("#progress");
const progressDots = [...document.querySelectorAll(".progress-dot")];
const progressLabel = document.querySelector(".progress-label");
const storyCard = document.querySelector("#story-card");
const storyLine = document.querySelector("#story-line");
const motionNote = document.querySelector("#motion-note");
const targets = [...document.querySelectorAll(".hotspot")];
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

const sequence = ["lantern", "owl", "gate"];
const hints = [
  "Somewhere, three small night-watchers keep the old promise.",
  "A warm little light keeps watch where the brambles curl.",
  "The treetops have a pair of round, moon-bright eyes.",
  "At the path's end, an old gate keeps the last piece of the story."
];
const storyBeats = [
  [0, "A tiny keeper wakes beneath the observatory's sleeping eye…"],
  [1900, "It gathers three lost moonbeams, one for each watcher."],
  [4200, "The hollow glows, and a little owl remembers its way home."],
  [6500, "“Thank you,” it hoots. Then the stars tuck the secret away."]
];
const storyDuration = 8500;
let found = 0;
let entered = false;
let paused = false;
let storyStartedAt = 0;
let storyElapsed = 0;
let storyFrame = 0;
let audioContext;
let ambientGain;
let audioError = false;

function updateMotionPreference() {
  app.classList.toggle("reduced-motion", motionPreference.matches);
  motionNote.textContent = motionPreference.matches
    ? "Reduced-motion preference detected: ambient movement is minimized."
    : "Gentle ambient movement · use your device setting to reduce motion.";
}

function updateProgress() {
  progressDots.forEach((dot, index) => dot.classList.toggle("found", index < found));
  progressLabel.textContent = `${found} of 3 clues`;
}

function playTone(frequency, duration, type = "sine", volume = 0.08) {
  if (!audioContext || audioContext.state !== "running") return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + duration);
}

function startAudio() {
  if (audioError || audioContext) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error("Web Audio is not supported by this browser.");
    audioContext = new AudioContextClass();
    ambientGain = audioContext.createGain();
    ambientGain.gain.value = 0.035;
    ambientGain.connect(audioContext.destination);

    const drone = audioContext.createOscillator();
    const droneGain = audioContext.createGain();
    drone.type = "sine";
    drone.frequency.value = 98;
    droneGain.gain.value = 0.32;
    drone.connect(droneGain);
    droneGain.connect(ambientGain);
    drone.start();

    const overtone = audioContext.createOscillator();
    const overtoneGain = audioContext.createGain();
    overtone.type = "sine";
    overtone.frequency.value = 146.83;
    overtoneGain.gain.value = 0.12;
    overtone.connect(overtoneGain);
    overtoneGain.connect(ambientGain);
    overtone.start();

    const bufferLength = audioContext.sampleRate * 3;
    const buffer = audioContext.createBuffer(1, bufferLength, audioContext.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < bufferLength; i++) samples[i] = (Math.random() * 2 - 1) * 0.25;
    const noise = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const noiseGain = audioContext.createGain();
    noise.buffer = buffer;
    noise.loop = true;
    filter.type = "lowpass";
    filter.frequency.value = 380;
    noiseGain.gain.value = 0.22;
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ambientGain);
    noise.start();
  } catch (error) {
    audioError = true;
    document.querySelector("#sound-note").textContent = `Sound unavailable: ${error.message}`;
  }
}

function setHint() {
  clue.textContent = hints[Math.min(found, hints.length - 1)];
}

function triggerStory() {
  app.classList.add("story-playing");
  storyCard.hidden = false;
  clue.hidden = true;
  storyElapsed = 0;
  storyStartedAt = performance.now();
  storyLine.textContent = storyBeats[0][1];
  playTone(523.25, 0.7, "sine", 0.1);
  playTone(659.25, 1.1, "sine", 0.06);
  storyFrame = requestAnimationFrame(updateStory);
}

function updateStory(now) {
  if (!entered || paused) return;
  storyElapsed = now - storyStartedAt;
  const beat = [...storyBeats].reverse().find(([time]) => storyElapsed >= time);
  if (beat && storyLine.textContent !== beat[1]) {
    storyLine.textContent = beat[1];
    if (storyElapsed > 0) playTone(storyElapsed > 4000 ? 784 : 659.25, 0.5, "sine", 0.045);
  }
  if (storyElapsed >= storyDuration) {
    finishStory();
    return;
  }
  storyFrame = requestAnimationFrame(updateStory);
}

function finishStory() {
  cancelAnimationFrame(storyFrame);
  app.classList.remove("story-playing");
  storyCard.hidden = true;
  clue.hidden = false;
  status.textContent = "The hollow settles. The little tale is yours to replay.";
  setHint();
  storyElapsed = 0;
}

function handleTarget(target) {
  if (!entered || paused || storyCard.hidden === false) return;
  const name = target.dataset.target;
  const expected = sequence[found];
  target.classList.remove("feedback");
  void target.getBoundingClientRect();
  target.classList.add("feedback");

  if (name === expected) {
    found++;
    target.classList.add("found");
    updateProgress();
    status.textContent = found === sequence.length
      ? "All three night-watchers are together!"
      : `A night-watcher answers. ${found} of 3 clues found.`;
    playTone([440, 554.37, 659.25][found - 1], 0.55, "triangle", 0.08);
    if (found === sequence.length) {
      triggerStory();
    } else {
      setHint();
    }
    return;
  }

  status.textContent = name === sequence[Math.min(found, sequence.length - 1)]
    ? "A little glow answers your touch."
    : "A soft rustle… perhaps another watcher is listening.";
  playTone(name === "owl" ? 392 : name === "gate" ? 330 : 466, 0.28, "sine", 0.045);
}

function enterScene() {
  if (entered) return;
  entered = true;
  startScreen.hidden = true;
  pauseButton.disabled = false;
  status.textContent = motionPreference.matches
    ? "A stiller kind of magic. Find the hollow's three watchers."
    : "The moon is up. The hollow is listening.";
  startAudio();
}

function setPaused(nextPaused) {
  if (!entered || paused === nextPaused) return;
  paused = nextPaused;
  app.classList.toggle("paused", paused);
  pauseScreen.hidden = !paused;
  pauseButton.setAttribute("aria-label", paused ? "Resume the scene" : "Pause the scene");
  pauseButton.title = paused ? "Resume scene" : "Pause scene";
  pauseButton.querySelector(".pause-label").textContent = paused ? "Resume" : "Pause";
  pauseButton.querySelector(".pause-icon").textContent = paused ? "▶" : "Ⅱ";
  if (paused) {
    if (!storyCard.hidden) cancelAnimationFrame(storyFrame);
    if (audioContext?.state === "running") audioContext.suspend();
  } else {
    if (!storyCard.hidden) {
      storyStartedAt = performance.now() - storyElapsed;
      storyFrame = requestAnimationFrame(updateStory);
    }
    if (audioContext?.state === "suspended") audioContext.resume();
  }
}

enterButton.addEventListener("click", enterScene);
pauseButton.addEventListener("click", () => setPaused(!paused));
targets.forEach((target) => {
  target.addEventListener("click", () => handleTarget(target));
  target.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleTarget(target);
    }
  });
});
motionPreference.addEventListener?.("change", updateMotionPreference);
updateMotionPreference();
updateProgress();
