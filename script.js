"use strict";

/*
  FPS Sensitivity Converter V8

  Core formula:

  cm/360 =
    (360 * 2.54) /
    (DPI * sensitivity * yaw)

  When DPI changes:

  targetSensitivity =
    sourceSensitivity
    * sourceYaw
    / targetYaw
    * sourceDPI
    / targetDPI
*/


const GAMES = {

  valorant: {
    name: "VALORANT",
    yaw: 0.07,
    confidence: "high",
    confidenceText: "The conversion uses an established VALORANT yaw value.",
    location: "Settings → General → Mouse → Sensitivity"
  },

  cs2: {
    name: "Counter-Strike 2",
    yaw: 0.022,
    confidence: "high",
    confidenceText: "The conversion uses the established CS2 yaw value.",
    location: "Settings → Keyboard / Mouse → Mouse Sensitivity"
  },

  apex: {
    name: "Apex Legends",
    yaw: 0.022,
    confidence: "high",
    confidenceText: "Apex Legends uses the same yaw value as CS2 in this model.",
    location: "Settings → Mouse/Keyboard → Mouse Sensitivity"
  },

  overwatch2: {
    name: "Overwatch 2",
    yaw: 0.0066,
    confidence: "high",
    confidenceText: "The conversion uses the established Overwatch 2 yaw value.",
    location: "Options → Controls → Sensitivity"
  },

  fortnite: {
    name: "Fortnite",
    yaw: 0.0055555556,
    confidence: "medium",
    confidenceText: "Fortnite uses a percentage-based sensitivity scale, so verify the result physically.",
    location: "Settings → Mouse and Keyboard → X-Axis / Y-Axis Sensitivity",
    warning:
      "Fortnite uses a percentage-based sensitivity scale. Hipfire conversion is estimated from the game's sensitivity scale. ADS and targeting sensitivity are separate."
  },

  r6: {
    name: "Rainbow Six Siege",
    yaw: 0.00572958,
    confidence: "medium",
    confidenceText: "The general mouse sensitivity conversion is supported, but Siege has additional ADS/scope settings.",
    location: "Options → Controls → Mouse Sensitivity",
    warning:
      "Rainbow Six Siege has separate ADS and scope multipliers. This converter only matches general horizontal hipfire sensitivity."
  },

  cod: {
    name: "Call of Duty / Warzone",
    yaw: 0.0066,
    confidence: "high",
    confidenceText: "The conversion uses the commonly documented Call of Duty yaw value.",
    location: "Settings → Mouse → Mouse Sensitivity"
  },

  finals: {
    name: "THE FINALS",
    yaw: 0.0066,
    confidence: "medium",
    confidenceText: "The converter uses the 0.0066 yaw model currently documented by several sensitivity databases.",
    location: "Settings → Controls → Mouse Sensitivity",
    warning:
      "Different public databases report different engine constants for THE FINALS. Treat the result as a hipfire approximation and verify it physically."
  },

  destiny2: {
    name: "Destiny 2",
    yaw: 0.0066,
    confidence: "medium",
    confidenceText: "The converter uses the 0.0066 yaw model used by several current sensitivity databases.",
    location: "Settings → Mouse and Keyboard → Look Sensitivity",
    warning:
      "Destiny 2 has separate ADS sensitivity behavior. This tool only matches hipfire."
  },

  deadlock: {
    name: "Deadlock",
    yaw: 0.022,
    confidence: "medium",
    confidenceText: "Deadlock's sensitivity constant varies between public databases. This version uses 0.022.",
    location: "Settings → Mouse → Mouse Sensitivity",
    warning:
      "Deadlock's sensitivity constant is not consistently reported by every public converter. Treat this result as a model-based conversion."
  },

  marvelrivals: {
    name: "Marvel Rivals",
    yaw: 0.022,
    confidence: "medium",
    confidenceText: "This version uses the 0.022 yaw model for Marvel Rivals.",
    location: "Settings → Controls → Mouse Sensitivity",
    warning:
      "Marvel Rivals has separate scoped/hero-specific settings. This converter matches horizontal hipfire only."
  }

};


// -------------------------
// DOM
// -------------------------

const sourceGame = document.getElementById("sourceGame");
const targetGame = document.getElementById("targetGame");

const sourceSens = document.getElementById("sourceSens");
const sourceDpi = document.getElementById("sourceDpi");
const targetDpi = document.getElementById("targetDpi");

const previewSens = document.getElementById("previewSens");

const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");
const copyBtn = document.getElementById("copyBtn");

const resultGame = document.getElementById("resultGame");
const resultSens = document.getElementById("resultSens");
const resultDpi = document.getElementById("resultDpi");

const sourceCm = document.getElementById("sourceCm");
const targetCm = document.getElementById("targetCm");

const sourceEdpi = document.getElementById("sourceEdpi");
const targetEdpi = document.getElementById("targetEdpi");

const confidenceBox = document.getElementById("confidenceBox");
const confidenceTitle = document.getElementById("confidenceTitle");
const confidenceText = document.getElementById("confidenceText");

const sensLocation = document.getElementById("sensLocation");
const setupExplanation = document.getElementById("setupExplanation");

const warningBox = document.getElementById("warningBox");
const warningText = document.getElementById("warningText");

const cmGame = document.getElementById("cmGame");
const cmSens = document.getElementById("cmSens");
const cmDpi = document.getElementById("cmDpi");
const cmBtn = document.getElementById("cmBtn");
const cmResult = document.getElementById("cmResult");


// -------------------------
// Utility
// -------------------------

function getGame(id) {
  return GAMES[id];
}


function validPositiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0;
}


function calculateCm360(sensitivity, dpi, yaw) {

  if (
    !validPositiveNumber(sensitivity) ||
    !validPositiveNumber(dpi) ||
    !validPositiveNumber(yaw)
  ) {
    return null;
  }

  return (360 * 2.54) / (dpi * sensitivity * yaw);
}


function calculateTargetSensitivity(
  sourceSensitivity,
  sourceDpi,
  targetDpi,
  sourceYaw,
  targetYaw
) {

  if (
    !validPositiveNumber(sourceSensitivity) ||
    !validPositiveNumber(sourceDpi) ||
    !validPositiveNumber(targetDpi) ||
    !validPositiveNumber(sourceYaw) ||
    !validPositiveNumber(targetYaw)
  ) {
    return null;
  }

  return (
    sourceSensitivity *
    (sourceYaw / targetYaw) *
    (sourceDpi / targetDpi)
  );
}


function formatSensitivity(value) {

  if (!Number.isFinite(value)) {
    return "—";
  }

  if (Math.abs(value) >= 100) {
    return value.toFixed(2);
  }

  if (Math.abs(value) >= 10) {
    return value.toFixed(3);
  }

  return value.toFixed(4);
}


function formatCm(value) {

  if (!Number.isFinite(value)) {
    return "—";
  }

  return `${value.toFixed(2)} cm`;
}


function formatEdpi(value) {

  if (!Number.isFinite(value)) {
    return "—";
  }

  return value.toFixed(2);
}


// -------------------------
// Main conversion
// -------------------------

function convertSensitivity() {

  const source = getGame(sourceGame.value);
  const target = getGame(targetGame.value);

  const sens = Number(sourceSens.value);
  const sourceDpiValue = Number(sourceDpi.value);
  const targetDpiValue = Number(targetDpi.value);

  if (!source || !target) {
    return;
  }

  if (
    !validPositiveNumber(sens) ||
    !validPositiveNumber(sourceDpiValue) ||
    !validPositiveNumber(targetDpiValue)
  ) {

    alert("Please enter a valid sensitivity and DPI.");

    return;
  }

  const converted = calculateTargetSensitivity(
    sens,
    sourceDpiValue,
    targetDpiValue,
    source.yaw,
    target.yaw
  );

  if (converted === null) {
    return;
  }

  const sourceCmValue = calculateCm360(
    sens,
    sourceDpiValue,
    source.yaw
  );

  const targetCmValue = calculateCm360(
    converted,
    targetDpiValue,
    target.yaw
  );

  const sourceEdpiValue = sens * sourceDpiValue;
  const targetEdpiValue = converted * targetDpiValue;


  previewSens.textContent = formatSensitivity(converted);

  resultGame.textContent = target.name;
  resultSens.textContent = formatSensitivity(converted);
  resultDpi.textContent = `${targetDpiValue} DPI`;

  sourceCm.textContent = formatCm(sourceCmValue);
  targetCm.textContent = formatCm(targetCmValue);

  sourceEdpi.textContent = formatEdpi(sourceEdpiValue);
  targetEdpi.textContent = formatEdpi(targetEdpiValue);

  sensLocation.textContent = target.location;

  setupExplanation.textContent =
    `In ${target.name}, set your sensitivity to ${formatSensitivity(converted)} and keep your mouse DPI at ${targetDpiValue} DPI. Your calculated physical sensitivity is approximately ${formatCm(targetCmValue)}.`;

  updateConfidence(target);

  updateWarning(target);

  document.getElementById("resultSection").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


// -------------------------
// Confidence
// -------------------------

function updateConfidence(game) {

  confidenceBox.className = "confidence";

  if (game.confidence === "high") {

    confidenceBox.classList.add("high");

    confidenceTitle.textContent = "🟢 High confidence";

  } else if (game.confidence === "medium") {

    confidenceBox.classList.add("medium");

    confidenceTitle.textContent = "🟡 Medium confidence";

  } else {

    confidenceBox.classList.add("low");

    confidenceTitle.textContent = "🔴 Low confidence";
  }

  confidenceText.textContent = game.confidenceText;
}


// -------------------------
// Warning
// -------------------------

function updateWarning(game) {

  if (!game.warning) {

    warningBox.classList.add("hidden");
    warningText.textContent = "";

    return;
  }

  warningBox.classList.remove("hidden");
  warningText.textContent = game.warning;
}


// -------------------------
// Live preview
// -------------------------

function updatePreview() {

  const source = getGame(sourceGame.value);
  const target = getGame(targetGame.value);

  const sens = Number(sourceSens.value);
  const sourceDpiValue = Number(sourceDpi.value);
  const targetDpiValue = Number(targetDpi.value);

  if (
    !source ||
    !target ||
    !validPositiveNumber(sens) ||
    !validPositiveNumber(sourceDpiValue) ||
    !validPositiveNumber(targetDpiValue)
  ) {

    previewSens.textContent = "—";

    return;
  }

  const converted = calculateTargetSensitivity(
    sens,
    sourceDpiValue,
    targetDpiValue,
    source.yaw,
    target.yaw
  );

  previewSens.textContent = formatSensitivity(converted);
}


// -------------------------
// Swap
// -------------------------

function swapGames() {

  const oldSourceGame = sourceGame.value;
  const oldTargetGame = targetGame.value;

  const oldSourceDpi = sourceDpi.value;
  const oldTargetDpi = targetDpi.value;

  const oldSensitivity = sourceSens.value;

  sourceGame.value = oldTargetGame;
  targetGame.value = oldSourceGame;

  sourceDpi.value = oldTargetDpi;
  targetDpi.value = oldSourceDpi;

  /*
    Important:
    The sensitivity remains the sensitivity currently being
    converted. This avoids unexpectedly changing the player's
    input when they simply swap the games.
  */

  sourceSens.value = oldSensitivity;

  updatePreview();
}


// -------------------------
// Copy
// -------------------------

async function copySettings() {

  const target = getGame(targetGame.value);

  const converted = calculateTargetSensitivity(
    Number(sourceSens.value),
    Number(sourceDpi.value),
    Number(targetDpi.value),
    getGame(sourceGame.value).yaw,
    target.yaw
  );

  if (!Number.isFinite(converted)) {
    return;
  }

  const text =
`FPS Sensitivity Converter

Game: ${target.name}
Sensitivity: ${formatSensitivity(converted)}
DPI: ${targetDpi.value} DPI

Source CM/360°: ${formatCm(
    calculateCm360(
      Number(sourceSens.value),
      Number(sourceDpi.value),
      getGame(sourceGame.value).yaw
    )
  )}

Target CM/360°: ${formatCm(
    calculateCm360(
      converted,
      Number(targetDpi.value),
      target.yaw
    )
  )}`;

  try {

    await navigator.clipboard.writeText(text);

    const oldText = copyBtn.textContent;

    copyBtn.textContent = "✅ Copied!";

    setTimeout(() => {
      copyBtn.textContent = oldText;
    }, 1500);

  } catch (error) {

    alert("Copy failed. Please copy the settings manually.");
  }
}


// -------------------------
// CM/360 calculator
// -------------------------

function calculateCm() {

  const game = getGame(cmGame.value);

  const sensitivity = Number(cmSens.value);
  const dpi = Number(cmDpi.value);

  if (
    !game ||
    !validPositiveNumber(sensitivity) ||
    !validPositiveNumber(dpi)
  ) {

    cmResult.textContent = "—";

    return;
  }

  const result = calculateCm360(
    sensitivity,
    dpi,
    game.yaw
  );

  cmResult.textContent = formatCm(result);
}


// -------------------------
// Quick DPI buttons
// -------------------------

document.querySelectorAll("[data-source-dpi]").forEach(button => {

  button.addEventListener("click", () => {

    sourceDpi.value = button.dataset.sourceDpi;

    updatePreview();
  });

});


document.querySelectorAll("[data-target-dpi]").forEach(button => {

  button.addEventListener("click", () => {

    targetDpi.value = button.dataset.targetDpi;

    updatePreview();
  });

});


// -------------------------
// Event listeners
// -------------------------

convertBtn.addEventListener("click", convertSensitivity);

swapBtn.addEventListener("click", swapGames);

copyBtn.addEventListener("click", copySettings);

cmBtn.addEventListener("click", calculateCm);

sourceGame.addEventListener("change", updatePreview);

targetGame.addEventListener("change", updatePreview);

sourceSens.addEventListener("input", updatePreview);

sourceDpi.addEventListener("input", updatePreview);

targetDpi.addEventListener("input", updatePreview);


// Enter = convert
[sourceSens, sourceDpi, targetDpi].forEach(input => {

  input.addEventListener("keydown", event => {

    if (event.key === "Enter") {
      event.preventDefault();
      convertSensitivity();
    }

  });

});


[cmSens, cmDpi].forEach(input => {

  input.addEventListener("keydown", event => {

    if (event.key === "Enter") {
      event.preventDefault();
      calculateCm();
    }

  });

});


// -------------------------
// Initial state
// -------------------------

updatePreview();
calculateCm();
