/* =========================================================
   FPS SENSITIVITY CONVERTER
   V11
   ========================================================= */


/* =========================
   GAME DATABASE
   ========================= */

const GAMES = {

  valorant: {
    name: "VALORANT",
    yaw: 0.07,
    confidence: "high",
    path: "Settings → General → Mouse → Sensitivity"
  },

  cs2: {
    name: "Counter-Strike 2",
    yaw: 0.022,
    confidence: "high",
    path: "Settings → Keyboard / Mouse → Mouse Sensitivity"
  },

  apex: {
    name: "Apex Legends",
    yaw: 0.022,
    confidence: "high",
    path: "Settings → Mouse/Keyboard → Mouse Sensitivity"
  },

  ow2: {
    name: "Overwatch 2",
    yaw: 0.0066,
    confidence: "high",
    path: "Options → Controls → Mouse → Sensitivity"
  },

  fortnite: {
    name: "Fortnite",
    yaw: 0.0055555556,
    confidence: "medium",
    path: "Settings → Mouse and Keyboard → X/Y Sensitivity",
    note:
      "Fortnite uses a percentage-based sensitivity scale. Treat this conversion as an estimate and verify it physically using CM/360°."
  },

  siege: {
    name: "Rainbow Six Siege",
    yaw: 0.00223,
    confidence: "medium",
    path: "Options → Controls → Mouse Sensitivity",
    note:
      "Rainbow Six Siege has separate ADS and scope multipliers. This converter only matches general horizontal hipfire sensitivity."
  },

  cod: {
    name: "Call of Duty / Warzone",
    yaw: 0.0066,
    confidence: "medium",
    path: "Settings → Mouse → Sensitivity",
    note:
      "Call of Duty contains additional aiming and FOV settings. This result targets general hipfire."
  },

  finals: {
    name: "THE FINALS",
    yaw: 0.0066,
    confidence: "medium",
    path: "Settings → Controls → Mouse Sensitivity",
    note:
      "Game-specific aiming settings can affect the final feel."
  },

  destiny2: {
    name: "Destiny 2",
    yaw: 0.0066,
    confidence: "medium",
    path: "Settings → Mouse and Keyboard → Look Sensitivity",
    note:
      "FOV and aiming settings can affect perceived sensitivity."
  },

  deadlock: {
    name: "Deadlock",
    yaw: 0.022,
    confidence: "medium",
    path: "Settings → Mouse Sensitivity",
    note:
      "This conversion targets general horizontal hipfire."
  },

  marvel: {
    name: "Marvel Rivals",
    yaw: 0.0066,
    confidence: "medium",
    path: "Settings → Controls → Mouse Sensitivity",
    note:
      "ADS and hero-specific aiming behavior may differ."
  }

};


/* =========================
   DOM
   ========================= */

const sourceGame = document.getElementById("sourceGame");
const targetGame = document.getElementById("targetGame");

const sourceSens = document.getElementById("sourceSens");
const sourceDpi = document.getElementById("sourceDpi");
const targetDpi = document.getElementById("targetDpi");

const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");

const convertedSens = document.getElementById("convertedSens");

const result = document.getElementById("result");
const errorBox = document.getElementById("errorBox");

const resultGame = document.getElementById("resultGame");
const resultSens = document.getElementById("resultSens");
const resultDpi = document.getElementById("resultDpi");

const confidence = document.getElementById("confidence");

const sensitivityPath = document.getElementById("sensitivityPath");
const whatToPut = document.getElementById("whatToPut");

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

const gamesList = document.getElementById("gamesList");


/* =========================
   INITIALIZE SELECTS
   ========================= */

function populateSelect(select, includeAllGames = true) {

  select.innerHTML = "";

  Object.entries(GAMES).forEach(([id, game]) => {

    const option = document.createElement("option");

    option.value = id;
    option.textContent = game.name;

    select.appendChild(option);

  });

}


/* =========================
   GAMES LIST
   ========================= */

function renderGamesList() {

  gamesList.innerHTML = "";

  Object.entries(GAMES).forEach(([id, game]) => {

    const item = document.createElement("div");

    item.className = "game-pill";

    const confidenceText =
      game.confidence === "high"
        ? "High"
        : "Medium";

    item.innerHTML = `
      <strong>${game.name}</strong>
      <span class="${game.confidence}">
        ${confidenceText}
      </span>
    `;

    gamesList.appendChild(item);

  });

}


/* =========================
   URL PARAMETERS
   ========================= */

function readUrlParams() {

  const params = new URLSearchParams(window.location.search);

  const from = params.get("from");
  const to = params.get("to");
  const sens = params.get("sens");
  const dpi = params.get("dpi");
  const target = params.get("targetDpi");

  if (from && GAMES[from]) {
    sourceGame.value = from;
  }

  if (to && GAMES[to]) {
    targetGame.value = to;
  }

  if (sens !== null && sens !== "") {
    sourceSens.value = sens;
  }

  if (dpi !== null && dpi !== "") {
    sourceDpi.value = dpi;
  }

  if (target !== null && target !== "") {
    targetDpi.value = target;
  }

}


/* =========================
   UPDATE URL
   ========================= */

function updateUrl() {

  const params = new URLSearchParams();

  params.set("from", sourceGame.value);
  params.set("to", targetGame.value);

  if (sourceSens.value !== "") {
    params.set("sens", sourceSens.value);
  }

  if (sourceDpi.value !== "") {
    params.set("dpi", sourceDpi.value);
  }

  if (targetDpi.value !== "") {
    params.set("targetDpi", targetDpi.value);
  }

  const newUrl =
    window.location.pathname +
    "?" +
    params.toString();

  window.history.replaceState({}, "", newUrl);

}


/* =========================
   FORMAT
   ========================= */

function formatSens(value) {

  if (!Number.isFinite(value)) {
    return "—";
  }

  return Number(value.toFixed(4)).toString();

}


function formatCm(value) {

  if (!Number.isFinite(value)) {
    return "—";
  }

  return `${value.toFixed(2)} cm`;

}


/* =========================
   CALCULATE CM/360
   ========================= */

/*
   cm/360 =
   (360 × 2.54) /
   (DPI × sensitivity × yaw)
*/

function calculateCm360(gameId, sensitivity, dpi) {

  const game = GAMES[gameId];

  if (!game) {
    return NaN;
  }

  return (
    (360 * 2.54) /
    (dpi * sensitivity * game.yaw)
  );

}


/* =========================
   CONVERT
   ========================= */

function convertSensitivity() {

  hideError();

  const sourceId = sourceGame.value;
  const targetId = targetGame.value;

  const sens = Number(sourceSens.value);
  const dpi = Number(sourceDpi.value);
  const targetDpiValue = Number(targetDpi.value);

  if (!Number.isFinite(sens) || sens <= 0) {
    showError("Enter a valid source sensitivity.");
    return;
  }

  if (!Number.isFinite(dpi) || dpi <= 0) {
    showError("Enter a valid source DPI.");
    return;
  }

  if (!Number.isFinite(targetDpiValue) || targetDpiValue <= 0) {
    showError("Enter a valid target DPI.");
    return;
  }

  const source = GAMES[sourceId];
  const target = GAMES[targetId];

  if (!source || !target) {
    showError("Please select valid games.");
    return;
  }


  /*
    We preserve the physical cm/360°.

    sourceCm =
      360 × 2.54 /
      (sourceDpi × sourceSens × sourceYaw)

    targetSens =
      360 × 2.54 /
      (targetDpi × targetYaw × sourceCm)

    This is equivalent to:

    targetSens =
      sourceSens × sourceDpi × sourceYaw /
      (targetDpi × targetYaw)
  */

  const cm = calculateCm360(
    sourceId,
    sens,
    dpi
  );

  const targetSensitivity =
    (sens * dpi * source.yaw) /
    (targetDpiValue * target.yaw);

  const targetCm = calculateCm360(
    targetId,
    targetSensitivity,
    targetDpiValue
  );


  /* DISPLAY */

  const formattedSens =
    formatSens(targetSensitivity);

  convertedSens.textContent =
    formattedSens;

  resultGame.textContent =
    target.name;

  resultSens.textContent =
    formattedSens;

  resultDpi.textContent =
    `${targetDpiValue} DPI`;

  sourceCm.textContent =
    formatCm(cm);

  targetCm.textContent =
    formatCm(targetCm);

  sourceEdpi.textContent =
    (sens * dpi).toFixed(2);

  targetEdpi.textContent =
    (targetSensitivity * targetDpiValue).toFixed(2);

  sensitivityPath.textContent =
    target.path;

  whatToPut.textContent =
    `In ${target.name}, set your sensitivity to ${formattedSens} and keep your mouse DPI at ${targetDpiValue} DPI. Your calculated physical sensitivity is approximately ${cm.toFixed(2)} cm/360°.`;

  updateConfidence(target);

  updateGameNote(target);

  result.classList.remove("hidden");

  updateUrl();

}


/* =========================
   CONFIDENCE
   ========================= */

function updateConfidence(game) {

  confidence.className =
    `confidence ${game.confidence}`;

  if (game.confidence === "high") {

    confidence.textContent =
      "🟢 High confidence — the conversion uses established yaw values for both games.";

  } else {

    confidence.textContent =
      "🟡 Medium confidence — game-specific settings may affect the result.";

  }

}


/* =========================
   GAME NOTE
   ========================= */

function updateGameNote(game) {

  if (!game.note) {

    gameNote.classList.add("hidden");
    gameNote.textContent = "";

    return;
  }

  gameNote.classList.remove("hidden");

  gameNote.textContent =
    `⚠️ Game-specific note: ${game.note}`;

}


/* =========================
   ERRORS
   ========================= */

function showError(message) {

  errorBox.textContent = message;
  errorBox.classList.remove("hidden");

}


function hideError() {

  errorBox.textContent = "";
  errorBox.classList.add("hidden");

}


/* =========================
   SWAP
   ========================= */

function swapGames() {

  const oldSourceGame =
    sourceGame.value;

  const oldTargetGame =
    targetGame.value;

  const oldSourceDpi =
    sourceDpi.value;

  const oldTargetDpi =
    targetDpi.value;

  sourceGame.value =
    oldTargetGame;

  targetGame.value =
    oldSourceGame;

  sourceDpi.value =
    oldTargetDpi;

  targetDpi.value =
    oldSourceDpi;

  /*
    Important:
    The sensitivity displayed by the source
    must be the sensitivity that belongs to
    the NEW source game.

    Therefore we convert first, then place
    the old result into the source field.
  */

  const oldResult =
    resultSens.textContent;

  if (
    oldResult &&
    oldResult !== "—" &&
    Number.isFinite(Number(oldResult))
  ) {

    sourceSens.value =
      oldResult;

  }

  result.classList.add("hidden");

  convertedSens.textContent = "—";

  updateUrl();

}


/* =========================
   QUICK DPI
   ========================= */

document
  .querySelectorAll("[data-source-dpi]")
  .forEach(button => {

    button.addEventListener("click", () => {

      sourceDpi.value =
        button.dataset.sourceDpi;

      updateUrl();

    });

  });


document
  .querySelectorAll("[data-target-dpi]")
  .forEach(button => {

    button.addEventListener("click", () => {

      targetDpi.value =
        button.dataset.targetDpi;

      updateUrl();

    });

  });


/* =========================
   COPY SETTINGS
   ========================= */

copyBtn.addEventListener("click", async () => {

  const game = GAMES[targetGame.value];

  const text =
`FPS Sensitivity Converter

Game: ${game.name}
Sensitivity: ${resultSens.textContent}
DPI: ${targetDpi.value}
CM/360°: ${targetCm.textContent}

Source game: ${GAMES[sourceGame.value].name}
Source sensitivity: ${sourceSens.value}
Source DPI: ${sourceDpi.value}`;

  try {

    await navigator.clipboard.writeText(text);

    copyBtn.textContent =
      "✅ Copied!";

    setTimeout(() => {

      copyBtn.textContent =
        "📋 Copy settings";

    }, 1600);

  } catch {

    copyBtn.textContent =
      "Copy failed";

    setTimeout(() => {

      copyBtn.textContent =
        "📋 Copy settings";

    }, 1600);

  }

});


/* =========================
   CM/360 CALCULATOR
   ========================= */

function calculateStandaloneCm() {

  const gameId =
    cmGame.value;

  const sens =
    Number(cmSens.value);

  const dpi =
    Number(cmDpi.value);

  if (!Number.isFinite(sens) || sens <= 0) {

    showError("Enter a valid sensitivity for the CM/360° calculator.");
    return;

  }

  if (!Number.isFinite(dpi) || dpi <= 0) {

    showError("Enter a valid DPI for the CM/360° calculator.");
    return;

  }

  const cm =
    calculateCm360(
      gameId,
      sens,
      dpi
    );

  cmValue.textContent =
    formatCm(cm);

  cmResult.classList.remove("hidden");

}


/* =========================
   ENTER KEY
   ========================= */

document.addEventListener("keydown", event => {

  if (event.key !== "Enter") {
    return;
  }

  const active =
    document.activeElement;

  if (
    active &&
    (
      active.tagName === "INPUT" ||
      active.tagName === "SELECT"
    )
  ) {

    /*
      If the user is working in the
      CM calculator, calculate CM/360.
    */

    if (
      active === cmSens ||
      active === cmDpi ||
      active === cmGame
    ) {

      calculateStandaloneCm();

    } else {

      convertSensitivity();

    }

  }

});


/* =========================
   EVENT LISTENERS
   ========================= */

convertBtn.addEventListener(
  "click",
  convertSensitivity
);

swapBtn.addEventListener(
  "click",
  swapGames
);

cmBtn.addEventListener(
  "click",
  calculateStandaloneCm
);

sourceGame.addEventListener(
  "change",
  updateUrl
);

targetGame.addEventListener(
  "change",
  updateUrl
);

sourceSens.addEventListener(
  "input",
  updateUrl
);

sourceDpi.addEventListener(
  "input",
  updateUrl
);

targetDpi.addEventListener(
  "input",
  updateUrl
);


/* =========================
   START
   ========================= */

populateSelect(sourceGame);
populateSelect(targetGame);
populateSelect(cmGame);

sourceGame.value = "valorant";
targetGame.value = "cs2";

cmGame.value = "valorant";

sourceDpi.value = "800";
targetDpi.value = "800";

cmDpi.value = "800";

renderGamesList();

readUrlParams();


/*
  If the URL already contains a complete
  conversion, automatically calculate it.
*/

if (
  sourceSens.value &&
  sourceDpi.value &&
  targetDpi.value
) {

  convertSensitivity();

}
