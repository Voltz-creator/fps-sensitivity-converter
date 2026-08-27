```javascript
const GAMES = {
  valorant: {
    name: "VALORANT",
    yaw: 0.07,
    confidence: "🟢 High confidence — the conversion uses an established yaw value.",
    path: "Settings → General → Mouse → Sensitivity"
  },

  cs2: {
    name: "Counter-Strike 2",
    yaw: 0.022,
    confidence: "🟢 High confidence — the conversion uses an established yaw value.",
    path: "Settings → Keyboard / Mouse → Mouse Sensitivity"
  },

  apex: {
    name: "Apex Legends",
    yaw: 0.022,
    confidence: "🟢 High confidence — the conversion uses an established yaw value.",
    path: "Settings → Mouse/Keyboard → Mouse Sensitivity"
  },

  ow2: {
    name: "Overwatch 2",
    yaw: 0.0066,
    confidence: "🟢 High confidence — the conversion uses an established yaw value.",
    path: "Options → Controls → Mouse → Sensitivity"
  },

  /*
    Fortnite uses a percentage-style sensitivity scale.
    The value entered by the user is treated as the displayed
    sensitivity number.
  */
  fortnite: {
    name: "Fortnite",
    yaw: 0.0055555556,
    confidence: "🟡 Medium confidence — Fortnite uses a different sensitivity scale.",
    path: "Settings → Mouse and Keyboard → Sensitivity"
  },

  siege: {
    name: "Rainbow Six Siege",
    yaw: 0.00223,
    confidence: "🟡 Medium confidence — game-specific settings may affect the result.",
    path: "Options → Controls → Mouse Sensitivity"
  },

  cod: {
    name: "Call of Duty / Warzone",
    yaw: 0.0066,
    confidence: "🟡 Medium confidence — game-specific settings may affect the result.",
    path: "Settings → Mouse → Sensitivity"
  },

  finals: {
    name: "THE FINALS",
    yaw: 0.0066,
    confidence: "🟡 Medium confidence — game-specific settings may affect the result.",
    path: "Settings → Controls → Mouse Sensitivity"
  },

  destiny2: {
    name: "Destiny 2",
    yaw: 0.0066,
    confidence: "🟡 Medium confidence — game-specific settings may affect the result.",
    path: "Settings → Mouse and Keyboard → Look Sensitivity"
  },

  deadlock: {
    name: "Deadlock",
    yaw: 0.022,
    confidence: "🟡 Medium confidence — game-specific settings may affect the result.",
    path: "Settings → Mouse → Sensitivity"
  },

  marvelrivals: {
    name: "Marvel Rivals",
    yaw: 0.0066,
    confidence: "🟡 Medium confidence — game-specific settings may affect the result.",
    path: "Settings → Controls → Mouse Sensitivity"
  }
};


/* =========================
   ELEMENTS
========================= */

const sourceGame = document.getElementById("sourceGame");
const sourceSens = document.getElementById("sourceSens");
const sourceDpi = document.getElementById("sourceDpi");

const targetGame = document.getElementById("targetGame");
const targetDpi = document.getElementById("targetDpi");

const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");

const convertedSens = document.getElementById("convertedSens");
const errorMessage = document.getElementById("errorMessage");

const resultSection = document.getElementById("resultSection");
const resultGame = document.getElementById("resultGame");
const resultSens = document.getElementById("resultSens");
const resultDpi = document.getElementById("resultDpi");

const confidence = document.getElementById("confidence");
const instructionsText = document.getElementById("instructionsText");

const sourceCm = document.getElementById("sourceCm");
const targetCm = document.getElementById("targetCm");

const sourceEdpi = document.getElementById("sourceEdpi");
const targetEdpi = document.getElementById("targetEdpi");

const gameNote = document.getElementById("gameNote");

const copyBtn = document.getElementById("copyBtn");

const cmGame = document.getElementById("cmGame");
const cmSens = document.getElementById("cmSens");
const cmDpi = document.getElementById("cmDpi");
const cmBtn = document.getElementById("cmBtn");
const cmResult = document.getElementById("cmResult");
const cmValue = document.getElementById("cmValue");


/* =========================
   HELPERS
========================= */

function getGame(id) {
  return GAMES[id];
}

function formatNumber(number, decimals = 4) {
  if (!Number.isFinite(number)) {
    return "—";
  }

  return Number(number.toFixed(decimals)).toString();
}

function formatCm(number) {
  if (!Number.isFinite(number)) {
    return "—";
  }

  return `${number.toFixed(2)} cm`;
}


/*
  Standard cm/360 formula:

  cm/360 = 360 * 2.54 / (DPI × sensitivity × yaw)

  360 × 2.54 = 914.4
*/
function calculateCm(sensitivity, dpi, yaw) {
  if (
    !Number.isFinite(sensitivity) ||
    !Number.isFinite(dpi) ||
    !Number.isFinite(yaw) ||
    sensitivity <= 0 ||
    dpi <= 0 ||
    yaw <= 0
  ) {
    return NaN;
  }

  return 914.4 / (dpi * sensitivity * yaw);
}


/*
  Convert while keeping the same physical cm/360.

  cmSource = 914.4 / (sourceDpi × sourceSens × sourceYaw)

  targetSens = 914.4 / (targetDpi × cmSource × targetYaw)

  This is equivalent to:

  targetSens =
  sourceSens × sourceDpi × sourceYaw
  ----------------------------------
  targetDpi × targetYaw
*/
function convertSensitivity(sourceId, targetId, sens, dpi, targetDpiValue) {

  const source = getGame(sourceId);
  const target = getGame(targetId);

  const sourceCmValue = calculateCm(
    sens,
    dpi,
    source.yaw
  );

  const targetSensitivity =
    914.4 /
    (
      targetDpiValue *
      sourceCmValue *
      target.yaw
    );

  return {
    targetSensitivity,
    sourceCm: sourceCmValue,
    targetCm: calculateCm(
      targetSensitivity,
      targetDpiValue,
      target.yaw
    )
  };
}


/* =========================
   URL STATE
========================= */

function updateURL() {
  const params = new URLSearchParams();

  params.set("from", sourceGame.value);
  params.set("to", targetGame.value);
  params.set("sens", sourceSens.value);
  params.set("dpi", sourceDpi.value);
  params.set("targetDpi", targetDpi.value);

  history.replaceState(
    null,
    "",
    `${window.location.pathname}?${params.toString()}`
  );
}

function loadFromURL() {

  const params = new URLSearchParams(window.location.search);

  const from = params.get("from");
  const to = params.get("to");
  const sens = params.get("sens");
  const dpi = params.get("dpi");
  const targetDpiValue = params.get("targetDpi");

  if (from && GAMES[from]) {
    sourceGame.value = from;
  }

  if (to && GAMES[to]) {
    targetGame.value = to;
  }

  if (sens !== null) {
    sourceSens.value = sens;
  }

  if (dpi !== null) {
    sourceDpi.value = dpi;
  }

  if (targetDpiValue !== null) {
    targetDpi.value = targetDpiValue;
  }

  if (sens && dpi && targetDpiValue) {
    convert();
  }
}


/* =========================
   CONVERTER
========================= */

function convert() {

  errorMessage.textContent = "";

  const sourceId = sourceGame.value;
  const targetId = targetGame.value;

  const sens = parseFloat(sourceSens.value);
  const dpi = parseFloat(sourceDpi.value);
  const targetDpiValue = parseFloat(targetDpi.value);

  if (!Number.isFinite(sens) || sens <= 0) {
    errorMessage.textContent = "Enter a valid sensitivity.";
    resultSection.classList.add("hidden");
    convertedSens.textContent = "—";
    return;
  }

  if (!Number.isFinite(dpi) || dpi <= 0) {
    errorMessage.textContent = "Enter a valid source DPI.";
    resultSection.classList.add("hidden");
    convertedSens.textContent = "—";
    return;
  }

  if (!Number.isFinite(targetDpiValue) || targetDpiValue <= 0) {
    errorMessage.textContent = "Enter a valid target DPI.";
    resultSection.classList.add("hidden");
    convertedSens.textContent = "—";
    return;
  }

  const source = getGame(sourceId);
  const target = getGame(targetId);

  const result = convertSensitivity(
    sourceId,
    targetId,
    sens,
    dpi,
    targetDpiValue
  );

  const targetSensitivity = result.targetSensitivity;

  convertedSens.textContent =
    formatNumber(targetSensitivity, 4);

  resultGame.textContent = target.name;

  resultSens.textContent =
    formatNumber(targetSensitivity, 4);

  resultDpi.textContent =
    `${formatNumber(targetDpiValue, 0)} DPI`;

  confidence.textContent =
    target.confidence;

  instructionsText.textContent =
    `In ${target.name}, set your sensitivity to ${formatNumber(targetSensitivity, 4)} and keep your mouse DPI at ${formatNumber(targetDpiValue, 0)} DPI. Your calculated physical sensitivity is approximately ${result.sourceCm.toFixed(2)} cm/360°.`;

  sourceCm.textContent =
    formatCm(result.sourceCm);

  /*
    IMPORTANT FIX:
    Target CM/360° is now calculated from the
    ACTUAL target sensitivity we just generated.

    Because the displayed sensitivity is rounded,
    it can differ by a tiny amount from the source.
  */
  targetCm.textContent =
    formatCm(result.targetCm);

  sourceEdpi.textContent =
    formatNumber(sens * dpi, 2);

  targetEdpi.textContent =
    formatNumber(targetSensitivity * targetDpiValue, 2);

  updateGameNote(targetId);

  resultSection.classList.remove("hidden");

  updateURL();
}


/* =========================
   GAME NOTES
========================= */

function updateGameNote(gameId) {

  const notes = {
    fortnite:
      "⚠️ Fortnite uses a different sensitivity scale. Verify the physical result in-game.",

    siege:
      "⚠️ Rainbow Six Siege has separate ADS and scope multipliers. This converter only matches general horizontal hipfire sensitivity.",

    cod:
      "⚠️ Call of Duty contains additional aiming and FOV settings. This result targets general hipfire.",

    finals:
      "⚠️ THE FINALS contains additional aiming settings. This result targets general hipfire.",

    destiny2:
      "⚠️ Destiny 2 has additional aiming and FOV settings. This result targets general hipfire.",

    deadlock:
      "⚠️ Deadlock has game-specific aiming behavior. This result targets general hipfire.",

    marvelrivals:
      "⚠️ Marvel Rivals has game-specific aiming and FOV settings. Verify the physical result in-game."
  };

  if (notes[gameId]) {
    gameNote.textContent = notes[gameId];
    gameNote.classList.remove("hidden");
  } else {
    gameNote.textContent = "";
    gameNote.classList.add("hidden");
  }
}


/* =========================
   SWAP
========================= */

swapBtn.addEventListener("click", () => {

  const oldSourceGame = sourceGame.value;
  const oldTargetGame = targetGame.value;

  const oldSourceDpi = sourceDpi.value;
  const oldTargetDpi = targetDpi.value;

  /*
    After swapping games, the old target becomes
    the new source.

    We also move the old target DPI into source DPI.
  */
  sourceGame.value = oldTargetGame;
  targetGame.value = oldSourceGame;

  sourceDpi.value = oldTargetDpi;
  targetDpi.value = oldSourceDpi;

  /*
    The old calculated target sensitivity becomes
    the new source sensitivity.
  */
  const currentResult = parseFloat(resultSens.textContent);

  if (Number.isFinite(currentResult)) {
    sourceSens.value = currentResult;
  }

  if (sourceSens.value) {
    convert();
  }
});


/* =========================
   QUICK DPI BUTTONS
========================= */

document.querySelectorAll("[data-dpi-source]").forEach(button => {

  button.addEventListener("click", () => {
    sourceDpi.value = button.dataset.dpiSource;

    if (sourceSens.value) {
      convert();
    }
  });

});

document.querySelectorAll("[data-dpi-target]").forEach(button => {

  button.addEventListener("click", () => {
    targetDpi.value = button.dataset.dpiTarget;

    if (sourceSens.value) {
      convert();
    }
  });

});


/* =========================
   ENTER KEY
========================= */

[sourceSens, sourceDpi, targetDpi].forEach(input => {

  input.addEventListener("keydown", event => {

    if (event.key === "Enter") {
      event.preventDefault();
      convert();
    }

  });

});


/* =========================
   CONVERT BUTTON
========================= */

convertBtn.addEventListener("click", convert);


/* =========================
   COPY SETTINGS
========================= */

copyBtn.addEventListener("click", async () => {

  const text =
`FPS Sensitivity Converter

Game: ${resultGame.textContent}
Sensitivity: ${resultSens.textContent}
DPI: ${resultDpi.textContent}

Source CM/360°: ${sourceCm.textContent}
Target CM/360°: ${targetCm.textContent}`;

  try {

    await navigator.clipboard.writeText(text);

    const oldText = copyBtn.textContent;

    copyBtn.textContent = "✅ Copied!";

    setTimeout(() => {
      copyBtn.textContent = oldText;
    }, 1500);

  } catch {

    copyBtn.textContent = "Copy failed";

    setTimeout(() => {
      copyBtn.textContent = "📋 Copy settings";
    }, 1500);

  }

});


/* =========================
   CM/360 CALCULATOR
========================= */

cmBtn.addEventListener("click", () => {

  const game = getGame(cmGame.value);

  const sens = parseFloat(cmSens.value);
  const dpi = parseFloat(cmDpi.value);

  if (!Number.isFinite(sens) || sens <= 0) {
    cmValue.textContent = "Invalid sensitivity";
    cmResult.classList.remove("hidden");
    return;
  }

  if (!Number.isFinite(dpi) || dpi <= 0) {
    cmValue.textContent = "Invalid DPI";
    cmResult.classList.remove("hidden");
    return;
  }

  const cm = calculateCm(
    sens,
    dpi,
    game.yaw
  );

  cmValue.textContent =
    formatCm(cm);

  cmResult.classList.remove("hidden");
});


[cmSens, cmDpi].forEach(input => {

  input.addEventListener("keydown", event => {

    if (event.key === "Enter") {
      event.preventDefault();
      cmBtn.click();
    }

  });

});


/* =========================
   INITIAL LOAD
========================= */

loadFromURL();
```
