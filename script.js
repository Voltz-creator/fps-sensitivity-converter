const GAMES = {

    valorant: {
        name: "VALORANT",
        yaw: 0.07,
        confidence: "high",
        path: "Settings → General → Mouse → Sensitivity",
        note: ""
    },

    cs2: {
        name: "Counter-Strike 2",
        yaw: 0.022,
        confidence: "high",
        path: "Settings → Keyboard / Mouse → Mouse Sensitivity",
        note: ""
    },

    apex: {
        name: "Apex Legends",
        yaw: 0.022,
        confidence: "high",
        path: "Settings → Mouse/Keyboard → Mouse Sensitivity",
        note: ""
    },

    overwatch: {
        name: "Overwatch 2",
        yaw: 0.0066,
        confidence: "high",
        path: "Settings → Controls → Mouse → Sensitivity",
        note: ""
    },

    fortnite: {
        name: "Fortnite",
        yaw: 0.0055555556,
        confidence: "medium",
        path: "Settings → Mouse and Keyboard → X/Y Sensitivity",
        note:
            "Fortnite uses a percentage-based sensitivity scale. " +
            "Verify the result physically in-game."
    },

    siege: {
        name: "Rainbow Six Siege",
        yaw: 0.00223,
        confidence: "medium",
        path: "Options → Controls → Mouse Sensitivity",
        note:
            "Rainbow Six Siege has separate ADS and scope multipliers. " +
            "This converter only matches general horizontal hipfire."
    },

    cod: {
        name: "Call of Duty / Warzone",
        yaw: 0.0066,
        confidence: "medium",
        path: "Settings → Mouse → Sensitivity",
        note:
            "Call of Duty contains additional aiming and FOV settings. " +
            "This result targets general hipfire."
    },

    finals: {
        name: "THE FINALS",
        yaw: 0.0066,
        confidence: "medium",
        path: "Settings → Controls → Mouse Sensitivity",
        note:
            "Game-specific aiming settings may affect the final feel."
    },

    destiny: {
        name: "Destiny 2",
        yaw: 0.0066,
        confidence: "medium",
        path: "Settings → Mouse and Keyboard → Look Sensitivity",
        note:
            "FOV and aiming settings can change how the sensitivity feels."
    },

    deadlock: {
        name: "Deadlock",
        yaw: 0.022,
        confidence: "medium",
        path: "Settings → Mouse → Sensitivity",
        note:
            "Game-specific settings may affect the final result."
    },

    marvel: {
        name: "Marvel Rivals",
        yaw: 0.0066,
        confidence: "medium",
        path: "Settings → Controls → Mouse Sensitivity",
        note:
            "Marvel Rivals contains additional aiming and zoom settings."
    }

};


const sourceGame = document.getElementById("sourceGame");
const targetGame = document.getElementById("targetGame");
const cmGame = document.getElementById("cmGame");

const sourceSens = document.getElementById("sourceSens");
const sourceDpi = document.getElementById("sourceDpi");
const targetDpi = document.getElementById("targetDpi");

const convertButton = document.getElementById("convertButton");
const swapButton = document.getElementById("swapButton");

const resultSection = document.getElementById("resultSection");
const errorMessage = document.getElementById("errorMessage");

const resultGame = document.getElementById("resultGame");
const resultSens = document.getElementById("resultSens");
const resultDpi = document.getElementById("resultDpi");

const sourceCm = document.getElementById("sourceCm");
const targetCm = document.getElementById("targetCm");

const sourceEdpi = document.getElementById("sourceEdpi");
const targetEdpi = document.getElementById("targetEdpi");

const confidence = document.getElementById("confidence");
const gameNote = document.getElementById("gameNote");

const instructionText = document.getElementById("instructionText");

const copyButton = document.getElementById("copyButton");

const cmSens = document.getElementById("cmSens");
const cmDpi = document.getElementById("cmDpi");
const cmButton = document.getElementById("cmButton");

const cmResult = document.getElementById("cmResult");
const cmValue = document.getElementById("cmValue");


function populateGames(select) {

    select.innerHTML = "";

    Object.keys(GAMES).forEach(key => {

        const option = document.createElement("option");

        option.value = key;
        option.textContent = GAMES[key].name;

        select.appendChild(option);

    });

}


populateGames(sourceGame);
populateGames(targetGame);
populateGames(cmGame);


sourceGame.value = "valorant";
targetGame.value = "cs2";
cmGame.value = "valorant";


function calculateCm360(sensitivity, dpi, yaw) {

    return (360 * 2.54) /
        (dpi * sensitivity * yaw);

}


function calculateTargetSensitivity(
    sourceSensitivity,
    sourceDpiValue,
    targetDpiValue,
    sourceYaw,
    targetYaw
) {

    const sourceCm = calculateCm360(
        sourceSensitivity,
        sourceDpiValue,
        sourceYaw
    );

    return (360 * 2.54) /
        (targetDpiValue * sourceCm * targetYaw);

}


function showError(message) {

    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");

}


function clearError() {

    errorMessage.classList.add("hidden");
    errorMessage.textContent = "";

}


function formatNumber(value, decimals = 4) {

    return Number(value)
        .toFixed(decimals)
        .replace(/\.?0+$/, "");

}


function convert() {

    clearError();

    const source = GAMES[sourceGame.value];
    const target = GAMES[targetGame.value];

    const sens = Number(sourceSens.value);
    const dpi = Number(sourceDpi.value);
    const targetDpiValue = Number(targetDpi.value);


    if (!Number.isFinite(sens) || sens <= 0) {

        showError(
            "Enter a valid source sensitivity greater than 0."
        );

        return;
    }


    if (!Number.isFinite(dpi) || dpi <= 0) {

        showError(
            "Enter a valid source DPI greater than 0."
        );

        return;
    }


    if (
        !Number.isFinite(targetDpiValue) ||
        targetDpiValue <= 0
    ) {

        showError(
            "Enter a valid target DPI greater than 0."
        );

        return;
    }


    const cm = calculateCm360(
        sens,
        dpi,
        source.yaw
    );


    const converted = calculateTargetSensitivity(
        sens,
        dpi,
        targetDpiValue,
        source.yaw,
        target.yaw
    );


    resultGame.textContent = target.name;

    resultSens.textContent = formatNumber(
        converted,
        4
    );

    resultDpi.textContent =
        `${formatNumber(targetDpiValue, 0)} DPI`;


    sourceCm.textContent =
        `${cm.toFixed(2)} cm`;

    targetCm.textContent =
        `${cm.toFixed(2)} cm`;


    sourceEdpi.textContent =
        `${(sens * dpi).toFixed(2)}`;

    targetEdpi.textContent =
        `${(converted * targetDpiValue).toFixed(2)}`;


    if (target.confidence === "high") {

        confidence.textContent =
            "🟢 High confidence — established sensitivity conversion.";

        confidence.className =
            "confidence high";

    } else {

        confidence.textContent =
            "🟡 Medium confidence — game-specific settings may affect the result.";

        confidence.className =
            "confidence medium";

    }


    if (target.note) {

        gameNote.textContent =
            "⚠️ Game-specific note: " + target.note;

        gameNote.classList.remove("hidden");

    } else {

        gameNote.classList.add("hidden");

    }


    instructionText.textContent =
        `In ${target.name}, set your sensitivity to ` +
        `${formatNumber(converted, 4)} and keep your mouse DPI at ` +
        `${formatNumber(targetDpiValue, 0)} DPI. ` +
        `Your calculated physical sensitivity is approximately ` +
        `${cm.toFixed(2)} cm/360°. ` +
        `The relevant setting is usually located at ` +
        `${target.path}.`;


    resultSection.classList.remove("hidden");


    updateUrl();


    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


convertButton.addEventListener(
    "click",
    convert
);


sourceSens.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            convert();
        }

    }
);


sourceDpi.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            convert();
        }

    }
);


targetDpi.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            convert();
        }

    }
);


swapButton.addEventListener(
    "click",
    () => {

        const oldSource =
            sourceGame.value;

        const oldTarget =
            targetGame.value;

        sourceGame.value =
            oldTarget;

        targetGame.value =
            oldSource;

        const oldSourceDpi =
            sourceDpi.value;

        sourceDpi.value =
            targetDpi.value;

        targetDpi.value =
            oldSourceDpi;

        convert();

    }
);


document.querySelectorAll(
    "[data-dpi]"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            sourceDpi.value =
                button.dataset.dpi;

        }
    );

});


document.querySelectorAll(
    "[data-target-dpi]"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            targetDpi.value =
                button.dataset.targetDpi;

        }
    );

});


cmButton.addEventListener(
    "click",
    () => {

        const game =
            GAMES[cmGame.value];

        const sens =
            Number(cmSens.value);

        const dpi =
            Number(cmDpi.value);


        if (!Number.isFinite(sens) || sens <= 0) {

            cmResult.classList.add("hidden");

            return;

        }


        if (!Number.isFinite(dpi) || dpi <= 0) {

            cmResult.classList.add("hidden");

            return;

        }


        const result =
            calculateCm360(
                sens,
                dpi,
                game.yaw
            );


        cmValue.textContent =
            `${result.toFixed(2)} cm`;


        cmResult.classList.remove(
            "hidden"
        );

    }
);


copyButton.addEventListener(
    "click",
    async () => {

        const text =
`FPS Sens Converter

Game: ${resultGame.textContent}
Sensitivity: ${resultSens.textContent}
DPI: ${resultDpi.textContent}
CM/360°: ${targetCm.textContent}

Verify game-specific ADS, FOV and scope settings in-game.`;

        try {

            await navigator.clipboard.writeText(text);

            copyButton.textContent =
                "✅ Copied!";

            setTimeout(
                () => {
                    copyButton.textContent =
                        "📋 Copy settings";
                },
                1500
            );

        } catch {

            copyButton.textContent =
                "Copy failed";

        }

    }
);


function updateUrl() {

    const params = new URLSearchParams();

    params.set(
        "source",
        sourceGame.value
    );

    params.set(
        "target",
        targetGame.value
    );

    if (sourceSens.value) {

        params.set(
            "sens",
            sourceSens.value
        );

    }

    params.set(
        "dpi",
        sourceDpi.value
    );

    params.set(
        "targetDpi",
        targetDpi.value
    );


    const newUrl =
        `${window.location.pathname}?${params.toString()}`;

    window.history.replaceState(
        {},
        "",
        newUrl
    );

}


function loadFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const source =
        params.get("source");

    const target =
        params.get("target");

    const sens =
        params.get("sens");

    const dpi =
        params.get("dpi");

    const targetDpiValue =
        params.get("targetDpi");


    if (
        source &&
        GAMES[source]
    ) {

        sourceGame.value =
            source;

    }


    if (
        target &&
        GAMES[target]
    ) {

        targetGame.value =
            target;

    }


    if (sens) {

        sourceSens.value =
            sens;

    }


    if (dpi) {

        sourceDpi.value =
            dpi;

    }


    if (targetDpiValue) {

        targetDpi.value =
            targetDpiValue;

    }


    if (
        sens &&
        dpi
    ) {

        convert();

    }

}


loadFromUrl();
