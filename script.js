/*
    FPS Sensitivity Converter V6

    Formula:

    cm/360 = (360 * 2.54) / (DPI * sensitivity * yaw)

    target sensitivity =
    (360 * 2.54) / (target DPI * source cm/360 * target yaw)
*/

const GAMES = {

    valorant: {
        name: "VALORANT",
        yaw: 0.07,
        confidence: "high",
        path: "Settings → General → Mouse → Sensitivity",
        zoom: "1.0"
    },

    cs2: {
        name: "Counter-Strike 2",
        yaw: 0.022,
        confidence: "high",
        path: "Settings → Keyboard / Mouse → Mouse Sensitivity",
        zoom: "1.0"
    },

    apex: {
        name: "Apex Legends",
        yaw: 0.022,
        confidence: "high",
        path: "Settings → Mouse/Keyboard → Mouse Sensitivity",
        zoom: "1.0"
    },

    overwatch: {
        name: "Overwatch 2",
        yaw: 0.0066,
        confidence: "high",
        path: "Options → Controls → Mouse → Sensitivity",
        zoom: "1.0"
    },

    fortnite: {
        name: "Fortnite",
        yaw: 0.0055555556,
        confidence: "experimental",
        path: "Settings → Mouse and Keyboard → X-Axis / Y-Axis Sensitivity",
        zoom: "1.0"
    }
};


// ==============================
// DOM ELEMENTS
// ==============================

const sourceGame = document.getElementById("sourceGame");
const sourceSens = document.getElementById("sourceSens");
const sourceDpi = document.getElementById("sourceDpi");

const targetGame = document.getElementById("targetGame");
const targetDpi = document.getElementById("targetDpi");

const convertButton = document.getElementById("convertButton");
const swapButton = document.getElementById("swapButton");

const previewSens = document.getElementById("previewSens");
const errorMessage = document.getElementById("errorMessage");

const resultSection = document.getElementById("resultSection");

const resultGame = document.getElementById("resultGame");
const resultSens = document.getElementById("resultSens");
const resultDpi = document.getElementById("resultDpi");
const resultZoom = document.getElementById("resultZoom");

const sourceCm = document.getElementById("sourceCm");
const targetCm = document.getElementById("targetCm");

const sourceEdpi = document.getElementById("sourceEdpi");
const targetEdpi = document.getElementById("targetEdpi");

const instructionText = document.getElementById("instructionText");

const confidenceBox = document.getElementById("confidenceBox");
const confidenceText = document.getElementById("confidenceText");

const experimentalWarning =
    document.getElementById("experimentalWarning");


// ==============================
// UTILITY FUNCTIONS
// ==============================

function roundNumber(value, decimals = 4) {

    if (!Number.isFinite(value)) {
        return 0;
    }

    return Number(value.toFixed(decimals));
}


function formatNumber(value, decimals = 4) {

    if (!Number.isFinite(value)) {
        return "—";
    }

    return Number(value.toFixed(decimals)).toString();
}


function getGame(id) {
    return GAMES[id];
}


// ==============================
// CM/360 CALCULATION
// ==============================

function calculateCm360(gameId, sensitivity, dpi) {

    const game = getGame(gameId);

    if (!game) {
        throw new Error("Game not found.");
    }

    if (sensitivity <= 0 || dpi <= 0) {
        throw new Error("Sensitivity and DPI must be greater than 0.");
    }

    return (360 * 2.54) /
        (dpi * sensitivity * game.yaw);
}


// ==============================
// SENSITIVITY CONVERSION
// ==============================

function convertSensitivity(
    sourceGameId,
    sourceSensitivity,
    sourceDpiValue,
    targetGameId,
    targetDpiValue
) {

    const source = getGame(sourceGameId);
    const target = getGame(targetGameId);

    if (!source || !target) {
        throw new Error("Invalid game.");
    }

    const cm360 = calculateCm360(
        sourceGameId,
        sourceSensitivity,
        sourceDpiValue
    );

    const targetSensitivity =
        (360 * 2.54) /
        (targetDpiValue * cm360 * target.yaw);

    return {
        sensitivity: targetSensitivity,
        cm360: cm360
    };
}


// ==============================
// VALIDATION
// ==============================

function validateInputs() {

    errorMessage.textContent = "";

    const sens = Number(sourceSens.value);
    const sourceDpiValue = Number(sourceDpi.value);
    const targetDpiValue = Number(targetDpi.value);

    if (!Number.isFinite(sens) || sens <= 0) {
        errorMessage.textContent =
            "Please enter a valid source sensitivity.";
        return false;
    }

    if (!Number.isFinite(sourceDpiValue) || sourceDpiValue <= 0) {
        errorMessage.textContent =
            "Please enter a valid source DPI.";
        return false;
    }

    if (!Number.isFinite(targetDpiValue) || targetDpiValue <= 0) {
        errorMessage.textContent =
            "Please enter a valid target DPI.";
        return false;
    }

    return true;
}


// ==============================
// MAIN CONVERSION
// ==============================

function performConversion(showResult = true) {

    if (!validateInputs()) {
        previewSens.textContent = "—";
        return null;
    }

    try {

        const sourceId = sourceGame.value;
        const targetId = targetGame.value;

        const sens = Number(sourceSens.value);
        const sourceDpiValue = Number(sourceDpi.value);
        const targetDpiValue = Number(targetDpi.value);

        const result = convertSensitivity(
            sourceId,
            sens,
            sourceDpiValue,
            targetId,
            targetDpiValue
        );

        previewSens.textContent =
            formatNumber(result.sensitivity, 4);

        if (showResult) {
            displayResult(
                sourceId,
                targetId,
                sens,
                sourceDpiValue,
                targetDpiValue,
                result
            );
        }

        return result;

    } catch (error) {

        errorMessage.textContent = error.message;
        return null;
    }
}


// ==============================
// DISPLAY RESULT
// ==============================

function displayResult(
    sourceId,
    targetId,
    sourceSensitivity,
    sourceDpiValue,
    targetDpiValue,
    result
) {

    const source = getGame(sourceId);
    const target = getGame(targetId);

    resultSection.classList.remove("hidden");

    resultGame.textContent = target.name;

    resultSens.textContent =
        formatNumber(result.sensitivity, 4);

    resultDpi.textContent =
        `${formatNumber(targetDpiValue, 0)} DPI`;

    resultZoom.textContent = target.zoom;

    sourceCm.textContent =
        `${formatNumber(result.cm360, 2)} cm`;

    targetCm.textContent =
        `${formatNumber(result.cm360, 2)} cm`;

    sourceEdpi.textContent =
        formatNumber(sourceSensitivity * sourceDpiValue, 2);

    targetEdpi.textContent =
        formatNumber(result.sensitivity * targetDpiValue, 2);

    document.getElementById("sensPath").textContent =
        target.path;

    instructionText.textContent =
        `In ${target.name}, set your sensitivity to ${formatNumber(result.sensitivity, 4)} and keep your mouse DPI at ${formatNumber(targetDpiValue, 0)} DPI. Your calculated physical sensitivity is approximately ${formatNumber(result.cm360, 2)} cm/360°.`;

    // Confidence

    if (source.confidence === "experimental" ||
        target.confidence === "experimental") {

        confidenceBox.className =
            "confidence experimental";

        confidenceBox.innerHTML =
            `🟡 <strong>Experimental</strong>
             <span id="confidenceText">
             At least one game uses a sensitivity model that should be physically verified.
             </span>`;

    } else {

        confidenceBox.className =
            "confidence high";

        confidenceBox.innerHTML =
            `🟢 <strong>High confidence</strong>
             <span id="confidenceText">
             The conversion uses established sensitivity values.
             </span>`;
    }

    // Fortnite warning

    if (sourceId === "fortnite" || targetId === "fortnite") {

        experimentalWarning.classList.remove("hidden");

        experimentalWarning.textContent =
            "⚠️ Fortnite uses a different sensitivity scale. Treat this conversion as an estimate and verify the physical result in-game.";

    } else {

        experimentalWarning.classList.add("hidden");
        experimentalWarning.textContent = "";
    }

    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ==============================
// LIVE PREVIEW
// ==============================

function updatePreview() {

    if (
        sourceSens.value === "" ||
        sourceDpi.value === "" ||
        targetDpi.value === ""
    ) {
        previewSens.textContent = "—";
        return;
    }

    const result = performConversion(false);

    if (result) {

        previewSens.textContent =
            formatNumber(result.sensitivity, 4);

    } else {

        previewSens.textContent = "—";
    }
}


// ==============================
// SWAP SOURCE / TARGET
// ==============================

function swapGames() {

    const oldSourceGame = sourceGame.value;
    const oldTargetGame = targetGame.value;

    sourceGame.value = oldTargetGame;
    targetGame.value = oldSourceGame;

    const oldSourceDpi = sourceDpi.value;
    sourceDpi.value = targetDpi.value;
    targetDpi.value = oldSourceDpi;

    /*
        The target sensitivity becomes the source sensitivity.
        This makes the swap useful after a conversion.
    */

    const previousResult =
        resultSens.textContent;

    if (
        previousResult !== "—" &&
        previousResult !== ""
    ) {

        const numericResult =
            Number(previousResult.replace(",", "."));

        if (Number.isFinite(numericResult)) {
            sourceSens.value = numericResult;
        }
    }

    updatePreview();
}


// ==============================
// QUICK DPI BUTTONS
// ==============================

document.querySelectorAll("[data-dpi-source]")
    .forEach(button => {

        button.addEventListener("click", () => {

            sourceDpi.value =
                button.dataset.dpiSource;

            updatePreview();
        });

    });


document.querySelectorAll("[data-dpi-target]")
    .forEach(button => {

        button.addEventListener("click", () => {

            targetDpi.value =
                button.dataset.dpiTarget;

            updatePreview();
        });

    });


// ==============================
// COPY SETTINGS
// ==============================

document.getElementById("copyButton")
    .addEventListener("click", async () => {

        const game = resultGame.textContent;
        const sensitivity = resultSens.textContent;
        const dpi = resultDpi.textContent;
        const cm = targetCm.textContent;
        const zoom = resultZoom.textContent;

        const text =
`FPS Sensitivity Converter

Game: ${game}
Sensitivity: ${sensitivity}
DPI: ${dpi}
Zoom/ADS: ${zoom}
CM/360°: ${cm}

Use these settings in ${game}.`;

        try {

            await navigator.clipboard.writeText(text);

            const button =
                document.getElementById("copyButton");

            const oldText = button.textContent;

            button.textContent = "✅ Copied!";

            setTimeout(() => {
                button.textContent = oldText;
            }, 1500);

        } catch {

            alert("Could not copy the settings.");
        }

    });


// ==============================
// BUTTONS
// ==============================

convertButton.addEventListener(
    "click",
    () => performConversion(true)
);

swapButton.addEventListener(
    "click",
    swapGames
);


// ==============================
// ENTER KEY
// ==============================

document.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        const active =
            document.activeElement;

        if (
            active.tagName === "INPUT" ||
            active.tagName === "SELECT"
        ) {
            performConversion(true);
        }
    }

});


// ==============================
// AUTO UPDATE
// ==============================

[
    sourceGame,
    sourceSens,
    sourceDpi,
    targetGame,
    targetDpi
].forEach(element => {

    element.addEventListener(
        "input",
        updatePreview
    );

    element.addEventListener(
        "change",
        updatePreview
    );

});


// ==============================
// CM/360 CALCULATOR
// ==============================

document.getElementById("calculateCmButton")
    .addEventListener("click", () => {

        const gameId =
            document.getElementById("cmGame").value;

        const sensitivity =
            Number(document.getElementById("cmSens").value);

        const dpi =
            Number(document.getElementById("cmDpi").value);

        const resultBox =
            document.getElementById("cmResult");

        const resultValue =
            document.getElementById("cmValue");

        if (
            !Number.isFinite(sensitivity) ||
            sensitivity <= 0
        ) {

            resultBox.classList.add("hidden");
            return;
        }

        if (
            !Number.isFinite(dpi) ||
            dpi <= 0
        ) {

            resultBox.classList.add("hidden");
            return;
        }

        try {

            const cm =
                calculateCm360(
                    gameId,
                    sensitivity,
                    dpi
                );

            resultValue.textContent =
                `${formatNumber(cm, 2)} cm`;

            resultBox.classList.remove("hidden");

        } catch {

            resultBox.classList.add("hidden");
        }

    });


// ==============================
// INITIAL PREVIEW
// ==============================

updatePreview();
