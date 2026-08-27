const GAMES = {

  valorant: {
    name: "VALORANT",
    yaw: 0.07,
    path: "Settings → General → Mouse → Sensitivity",
    confidence: "high"
  },

  cs2: {
    name: "Counter-Strike 2",
    yaw: 0.022,
    path: "Settings → Keyboard / Mouse → Mouse Sensitivity",
    confidence: "high"
  },

  apex: {
    name: "Apex Legends",
    yaw: 0.022,
    path: "Settings → Mouse/Keyboard → Mouse Sensitivity",
    confidence: "high"
  },

  ow2: {
    name: "Overwatch 2",
    yaw: 0.0066,
    path: "Options → Controls → Mouse → Sensitivity",
    confidence: "high"
  },

  fortnite: {
    name: "Fortnite",
    yaw: 0.0055555556,
    path: "Settings → Mouse and Keyboard → X-Axis / Y-Axis Sensitivity",
    confidence: "medium",
    note:
      "Fortnite uses a percentage-based sensitivity scale. Treat this conversion as an estimate and verify the physical result in-game."
  },

  siege: {
    name: "Rainbow Six Siege",
    yaw: 0.0022,
    path: "Options → Controls → Mouse Sensitivity",
    confidence: "medium",
    note:
      "Rainbow Six Siege has separate ADS and scope multipliers. This converter only matches general horizontal hipfire sensitivity."
  },

  cod: {
    name: "Call of Duty / Warzone",
    yaw: 0.0066,
    path: "Settings → Mouse → Sensitivity",
    confidence: "medium",
    note:
      "Call of Duty contains additional aiming and FOV settings. This result targets general hipfire."
  },

  finals: {
    name: "THE FINALS",
    yaw: 0.0066,
    path: "Settings → Controls → Mouse Sensitivity",
    confidence: "medium"
  },

  destiny: {
    name: "Destiny 2",
    yaw: 0.0066,
    path: "Settings → Mouse and Keyboard → Look Sensitivity",
    confidence: "medium"
  },

  deadlock: {
    name: "Deadlock",
    yaw: 0.022,
    path: "Settings → Mouse → Sensitivity",
    confidence: "medium"
  },

  marvel: {
    name: "Marvel Rivals",
    yaw: 0.0066,
    path: "Settings → Keyboard & Mouse → Mouse Sensitivity",
    confidence: "medium",
    note:
      "Game-specific aim and FOV behavior can affect the perceived match. Verify the physical result in-game."
  }

};


const sourceGame =
  document.getElementById("sourceGame");

const targetGame =
  document.getElementById("targetGame");

const sourceSens =
  document.getElementById("sourceSens");

const sourceDpi =
  document.getElementById("sourceDpi");

const targetDpi =
  document.getElementById("targetDpi");

const convertedSens =
  document.getElementById("convertedSens");

const result =
  document.getElementById("result");

const toast =
  document.getElementById("toast");


/* POPULATE SELECTS */

function populate(select, selected) {

  select.innerHTML = "";

  Object.entries(GAMES).forEach(
    ([id, game]) => {

      const option =
        document.createElement("option");

      option.value = id;

      option.textContent =
        game.name;

      if (id === selected) {
        option.selected = true;
      }

      select.appendChild(option);

    }
  );
}


populate(
  sourceGame,
  "valorant"
);

populate(
  targetGame,
  "cs2"
);


/* NUMBER */

function number(value) {

  const n =
    Number(value);

  return Number.isFinite(n)
    ? n
    : null;
}


/* CM/360 */

function cm360(
  gameId,
  sensitivity,
  dpi
) {

  const game =
    GAMES[gameId];

  return (
    360 * 2.54
  ) /
  (
    dpi *
    sensitivity *
    game.yaw
  );

}


/* FORMAT */

function formatSens(value) {

  return value
    .toFixed(4)
    .replace(/0+$/, "")
    .replace(/\.$/, "");

}


/* CONVERT */

function convert() {

  const sensitivity =
    number(sourceSens.value);

  const sourceDpiValue =
    number(sourceDpi.value);

  const targetDpiValue =
    number(targetDpi.value);

  if (
    !sensitivity ||
    sensitivity <= 0 ||
    !sourceDpiValue ||
    sourceDpiValue <= 0 ||
    !targetDpiValue ||
    targetDpiValue <= 0
  ) {

    showToast(
      "Enter a valid sensitivity and DPI."
    );

    return false;
  }


  const sourceCm =
    cm360(
      sourceGame.value,
      sensitivity,
      sourceDpiValue
    );


  const targetGameData =
    GAMES[targetGame.value];


  const targetSensitivity =
    (
      360 * 2.54
    ) /
    (
      targetDpiValue *
      sourceCm *
      targetGameData.yaw
    );


  renderResult(
    targetSensitivity,
    sourceCm,
    sensitivity,
    sourceDpiValue,
    targetDpiValue
  );


  convertedSens.textContent =
    formatSens(targetSensitivity);


  updateUrl();

  return true;
}


/* RESULT */

function renderResult(
  targetSensitivity,
  sourceCmValue,
  sourceSensitivity,
  sourceDpiValue,
  targetDpiValue
) {

  const source =
    GAMES[sourceGame.value];

  const target =
    GAMES[targetGame.value];


  const targetCm =
    cm360(
      targetGame.value,
      targetSensitivity,
      targetDpiValue
    );


  document.getElementById(
    "resultGame"
  ).textContent =
    target.name;


  document.getElementById(
    "resultSens"
  ).textContent =
    formatSens(targetSensitivity);


  document.getElementById(
    "resultDpi"
  ).textContent =
    `${targetDpiValue} DPI`;


  document.getElementById(
    "sourceCm"
  ).textContent =
    `${sourceCmValue.toFixed(2)} cm`;


  document.getElementById(
    "targetCm"
  ).textContent =
    `${targetCm.toFixed(2)} cm`;


  document.getElementById(
    "sourceEdpi"
  ).textContent =
    (
      sourceSensitivity *
      sourceDpiValue
    ).toFixed(2);


  document.getElementById(
    "targetEdpi"
  ).textContent =
    (
      targetSensitivity *
      targetDpiValue
    ).toFixed(2);


  const confidence =
    document.getElementById(
      "confidence"
    );


  if (
    source.confidence === "high" &&
    target.confidence === "high"
  ) {

    confidence.textContent =
      "🟢 High confidence — the conversion uses established yaw values for both games.";

  } else {

    confidence.textContent =
      "🟡 Medium confidence — game-specific settings may affect the result.";

  }


  document.getElementById(
    "sensitivityPath"
  ).textContent =
    target.path;


  document.getElementById(
    "instruction"
  ).textContent =

    `In ${target.name}, set your sensitivity to ${formatSens(targetSensitivity)} and keep your mouse DPI at ${targetDpiValue} DPI. Your calculated physical sensitivity is approximately ${sourceCmValue.toFixed(2)} cm/360°.`;



  const note =
    document.getElementById(
      "gameNote"
    );


  if (target.note) {

    note.textContent =
      "⚠️ Game-specific note: " +
      target.note;

    note.style.display =
      "block";

  } else {

    note.style.display =
      "none";

  }


  result.classList.remove(
    "hidden"
  );

}


/* IMPORTANT FIX:
   Get the actual calculated target sensitivity.
*/

function getConvertedValue() {

  const text =
    convertedSens.textContent.trim();

  if (
    !text ||
    text === "—"
  ) {

    return null;

  }

  const value =
    Number(text);

  return Number.isFinite(value)
    ? value
    : null;

}


/* SWAP FIX */

function swap() {

  /*
    We first save the complete state.
  */

  const oldSourceGame =
    sourceGame.value;

  const oldTargetGame =
    targetGame.value;

  const oldSourceSens =
    sourceSens.value;

  const oldSourceDpi =
    sourceDpi.value;

  const oldTargetDpi =
    targetDpi.value;


  /*
    The converted sensitivity becomes
    the new source sensitivity.
  */

  const calculatedTargetSens =
    getConvertedValue();


  /*
    Swap games.
  */

  sourceGame.value =
    oldTargetGame;

  targetGame.value =
    oldSourceGame;


  /*
    Swap DPI.
  */

  sourceDpi.value =
    oldTargetDpi;

  targetDpi.value =
    oldSourceDpi;


  /*
    IMPORTANT:
    New source sensitivity =
    old target converted sensitivity.
  */

  if (
    calculatedTargetSens !== null
  ) {

    sourceSens.value =
      formatSens(
        calculatedTargetSens
      );

  } else {

    sourceSens.value =
      oldSourceSens;

  }


  /*
    Recalculate in the opposite direction.
  */

  convert();


  /*
    Update the URL.
  */

  updateUrl();

}


/* URL */

function updateUrl() {

  const params =
    new URLSearchParams({

      from:
        sourceGame.value,

      to:
        targetGame.value,

      sens:
        sourceSens.value,

      dpi:
        sourceDpi.value,

      targetDpi:
        targetDpi.value

    });


  history.replaceState(
    null,
    "",
    `${location.pathname}?${params.toString()}`
  );

}


/* LOAD URL */

function loadFromUrl() {

  const params =
    new URLSearchParams(
      location.search
    );


  const from =
    params.get("from");

  const to =
    params.get("to");

  const sens =
    params.get("sens");

  const dpi =
    params.get("dpi");

  const targetDpiValue =
    params.get("targetDpi");


  if (
    from &&
    GAMES[from]
  ) {

    sourceGame.value =
      from;

  }


  if (
    to &&
    GAMES[to]
  ) {

    targetGame.value =
      to;

  }


  if (
    sens !== null
  ) {

    sourceSens.value =
      sens;

  }


  if (
    dpi !== null
  ) {

    sourceDpi.value =
      dpi;

  }


  if (
    targetDpiValue !== null
  ) {

    targetDpi.value =
      targetDpiValue;

  }


  if (
    number(sourceSens.value) &&
    number(sourceDpi.value) &&
    number(targetDpi.value)
  ) {

    convert();

  }

}


/* CM CALCULATOR */

function calculateCm() {

  const game =
    document.getElementById(
      "calcGame"
    ).value;

  const sensitivity =
    number(
      document.getElementById(
        "calcSens"
      ).value
    );

  const dpi =
    number(
      document.getElementById(
        "calcDpi"
      ).value
    );


  const output =
    document.getElementById(
      "calcResult"
    );


  if (
    !sensitivity ||
    sensitivity <= 0 ||
    !dpi ||
    dpi <= 0
  ) {

    output.textContent =
      "Enter valid values";

    return;

  }


  output.textContent =
    `${cm360(
      game,
      sensitivity,
      dpi
    ).toFixed(2)} cm`;

}


/* TOAST */

function showToast(message) {

  toast.textContent =
    message;

  toast.classList.add(
    "show"
  );


  clearTimeout(
    showToast.timer
  );


  showToast.timer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      1800
    );

}


/* EVENTS */

document
  .getElementById("swapBtn")
  .addEventListener(
    "click",
    swap
  );


document
  .getElementById("convertBtn")
  .addEventListener(
    "click",
    convert
  );


document
  .getElementById("calcBtn")
  .addEventListener(
    "click",
    calculateCm
  );


/* ENTER = CONVERT */

[
  sourceSens,
  sourceDpi,
  targetDpi
].forEach(
  input => {

    input.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter"
        ) {

          convert();

        }

      }
    );

  }
);


/* URL UPDATE */

[
  sourceGame,
  targetGame,
  sourceSens,
  sourceDpi,
  targetDpi
].forEach(
  element => {

    element.addEventListener(
      "change",
      updateUrl
    );

    element.addEventListener(
      "input",
      updateUrl
    );

  }
);


/* QUICK DPI */

document
  .querySelectorAll(
    "[data-dpi-target]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const target =
            document.getElementById(
              button.dataset.dpiTarget
            );


          target.value =
            button.dataset.dpi;


          updateUrl();

        }
      );

    }
  );


/* COPY */

document
  .getElementById("copyBtn")
  .addEventListener(
    "click",
    async () => {

      const text =

`FPS Sens Converter

Game: ${
  GAMES[targetGame.value].name
}

Sensitivity: ${
  document.getElementById(
    "resultSens"
  ).textContent
}

DPI: ${
  document.getElementById(
    "resultDpi"
  ).textContent
}

CM/360°: ${
  document.getElementById(
    "targetCm"
  ).textContent
}`;


      try {

        await navigator
          .clipboard
          .writeText(text);

        showToast(
          "Settings copied!"
        );

      } catch {

        showToast(
          "Copy failed."
        );

      }

    }
  );


/* CALCULATOR GAME */

populate(
  document.getElementById(
    "calcGame"
  ),
  "valorant"
);


/* START */

loadFromUrl();
