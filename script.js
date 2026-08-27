/* =========================================================
   FPS SENSITIVITY CONVERTER
   VERSION 9
   ========================================================= */


/* =========================
   GAME DATABASE
   ========================= */

const games = {

    valorant: {
        name: "VALORANT",
        yaw: 0.07,
        confidence: "high",
        settings: "Settings → General → Mouse → Sensitivity",
        note: ""
    },

    cs2: {
        name: "Counter-Strike 2",
        yaw: 0.022,
        confidence: "high",
        settings: "Settings → Keyboard / Mouse → Mouse Sensitivity",
        note: ""
    },

    apex: {
        name: "Apex Legends",
        yaw: 0.022,
        confidence: "high",
        settings: "Settings → Mouse / Keyboard → Mouse Sensitivity",
        note: ""
    },

    overwatch: {
        name: "Overwatch 2",
        yaw: 0.0066,
        confidence: "high",
        settings: "Options → Controls → Mouse → Sensitivity",
        note: ""
    },

    fortnite: {
        name: "Fortnite",
        yaw: 0.0055555556,
        confidence: "medium",
        settings: "Settings → Mouse and Keyboard → X/Y Sensitivity",
        note:
            "Fortnite uses a percentage-based sensitivity scale. " +
            "Verify the physical result in-game."
    },

    siege: {
        name: "Rainbow Six Siege",
        yaw: 0.00223,
        confidence: "medium",
        settings: "Options → Controls → Mouse Sensitivity",
        note:
            "Rainbow Six Siege has separate ADS and scope multipliers. " +
            "This converter matches general horizontal hipfire sensitivity."
    },

    cod: {
        name: "Call of Duty / Warzone",
        yaw: 0.0066,
        confidence: "medium",
        settings: "Settings → Mouse → Sensitivity",
        note:
            "Call of Duty contains additional aiming and FOV settings. " +
            "This result targets general hipfire."
    },

    finals: {
        name: "THE FINALS",
        yaw: 0.0066,
        confidence: "medium",
        settings: "Settings → Controls → Mouse Sensitivity",
        note:
            "Game-specific aiming settings may affect the final feel."
    },

    destiny: {
        name: "Destiny 2",
        yaw: 0.0066,
        confidence: "medium",
        settings: "Settings → Mouse and Keyboard → Look Sensitivity",
        note:
            "FOV and aiming settings can affect the perceived feel."
    },

    deadlock: {
        name: "Deadlock",
        yaw: 0.022,
        confidence: "medium",
        settings: "Settings → Mouse → Sensitivity",
        note:
            "This conversion targets general horizontal hipfire."
    },

    marvel: {
        name: "Marvel Rivals",
        yaw: 0.0066,
        confidence: "medium",
        settings: "Settings → Keyboard → Mouse Sensitivity",
        note:
            "Hero-specific aiming and zoom settings can change the feel."
    }

};


/* =========================
   ELEMENTS
   ========================= */

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

const convertBtn =
    document.getElementById("convertBtn");

const invertBtn =
    document.getElementById("invertBtn");

const convertedPreview =
    document.getElementById("convertedPreview");

const resultCard =
    document.getElementById("resultCard");

const resultGame =
    document.getElementById("resultGame");

const resultSens =
    document.getElementById("resultSens");

const resultDpi =
    document.getElementById("resultDpi");

const sourceCm =
    document.getElementById("sourceCm");

const targetCm =
    document.getElementById("targetCm");

const sourceEdpi =
    document.getElementById("sourceEdpi");

const targetEdpi =
    document.getElementById("targetEdpi");

const confidence =
    document.getElementById("confidence");

const gameNote =
    document.getElementById("gameNote");

const settingsLocation =
    document.getElementById("settingsLocation");

const instruction =
    document.getElementById("instruction");

const toast =
    document.getElementById("toast");

const copyBtn =
    document.getElementById("copyBtn");

const sourceFavorite =
    document.getElementById("sourceFavorite");

const targetFavorite =
    document.getElementById("targetFavorite");


/* CM calculator */

const cmGame =
    document.getElementById("cmGame");

const cmSens =
    document.getElementById("cmSens");

const cmDpi =
    document.getElementById("cmDpi");

const cmBtn =
    document.getElementById("cmBtn");

const cmResult =
    document.getElementById("cmResult");

const cmValue =
    document.getElementById("cmValue");


/* =========================
   INITIALIZATION
   ========================= */

function populateGames(select) {

    select.innerHTML = "";

    Object.entries(games).forEach(([id, game]) => {

        const option =
            document.createElement("option");

        option.value = id;
        option.textContent = game.name;

        select.appendChild(option);

    });

}


populateGames(sourceGame);
populateGames(targetGame);
populateGames(cmGame);


/* =========================
   DEFAULT VALUES
   ========================= */

sourceGame.value = "valorant";
targetGame.value = "cs2";

sourceSens.value = "0.35";

sourceDpi.value = "800";
targetDpi.value = "800";

cmGame.value = "valorant";
cmSens.value = "0.35";
cmDpi.value = "800";


/* =========================
   FORMATTING
   ========================= */

function formatNumber(number) {

    if (!Number.isFinite(number)) {
        return "—";
    }

    return Number(number)
        .toFixed(4)
        .replace(/\.?0+$/, "");

}


function formatCm(number) {

    if (!Number.isFinite(number)) {
        return "—";
    }

    return number.toFixed(2) + " cm";

}


function formatEdpi(number) {

    if (!Number.isFinite(number)) {
        return "—";
    }

    return number.toFixed(2);

}


/* =========================
   CM / 360
   =========================

   cm/360 =
   360 × 2.54
   -------------------------
   DPI × sensitivity × yaw
*/

function calculateCm360(
    sensitivity,
    dpi,
    yaw
) {

    if (
        sensitivity <= 0 ||
        dpi <= 0 ||
        yaw <= 0
    ) {
        return NaN;
    }

    return (
        360 * 2.54
    ) / (
        dpi *
        sensitivity *
        yaw
    );

}


/* =========================
   CONVERT SENSITIVITY
   ========================= */

function calculateConversion() {

    const source =
        games[sourceGame.value];

    const target =
        games[targetGame.value];

    const sens =
        Number(sourceSens.value);

    const dpi =
        Number(sourceDpi.value);

    const targetDpiValue =
        Number(targetDpi.value);


    if (!source || !target) {

        showToast("Select both games.");

        return null;
    }


    if (
        !Number.isFinite(sens) ||
        sens <= 0
    ) {

        showToast("Enter a valid sensitivity.");

        sourceSens.focus();

        return null;
    }


    if (
        !Number.isFinite(dpi) ||
        dpi <= 0
    ) {

        showToast("Enter a valid source DPI.");

        sourceDpi.focus();

        return null;
    }


    if (
        !Number.isFinite(targetDpiValue) ||
        targetDpiValue <= 0
    ) {

        showToast("Enter a valid target DPI.");

        targetDpi.focus();

        return null;
    }


    const cm =
        calculateCm360(
            sens,
            dpi,
            source.yaw
        );


    /*
        Same physical movement:

        target sensitivity =
        source sensitivity
        × source yaw
        × source DPI
        --------------------------------
        target yaw × target DPI
    */

    const converted =
        (
            sens *
            source.yaw *
            dpi
        ) / (
            target.yaw *
            targetDpiValue
        );


    const targetCm =
        calculateCm360(
            converted,
            targetDpiValue,
            target.yaw
        );


    return {
        source,
        target,
        sens,
        dpi,
        targetDpi: targetDpiValue,
        cm,
        converted,
        targetCm
    };

}


/* =========================
   DISPLAY RESULT
   ========================= */

function convert() {

    const data =
        calculateConversion();

    if (!data) {
        return;
    }


    const {
        source,
        target,
        sens,
        dpi,
        targetDpi: newDpi,
        cm,
        converted,
        targetCm: newCm
    } = data;


    convertedPreview.textContent =
        formatNumber(converted);


    resultGame.textContent =
        target.name;

    resultSens.textContent =
        formatNumber(converted);

    resultDpi.textContent =
        newDpi + " DPI";


    sourceCm.textContent =
        formatCm(cm);

    targetCm.textContent =
        formatCm(newCm);


    sourceEdpi.textContent =
        formatEdpi(
            sens * dpi
        );

    targetEdpi.textContent =
        formatEdpi(
            converted * newDpi
        );


    settingsLocation.textContent =
        target.settings;


    instruction.textContent =
        `In ${target.name}, set your sensitivity to ` +
        `${formatNumber(converted)} and keep your ` +
        `mouse DPI at ${newDpi} DPI. Your calculated ` +
        `physical sensitivity is approximately ` +
        `${formatCm(newCm)}.`;


    updateConfidence(
        target.confidence
    );


    if (target.note) {

        gameNote.classList.remove("hidden");

        gameNote.textContent =
            "⚠️ Game-specific note: " +
            target.note;

    } else {

        gameNote.classList.add("hidden");

    }


    resultCard.classList.remove("hidden");


    saveSettings();


    resultCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================
   CONFIDENCE
   ========================= */

function updateConfidence(level) {

    confidence.className =
        "confidence " + level;


    if (level === "high") {

        confidence.textContent =
            "🟢 High confidence — " +
            "established sensitivity conversion.";

    }

    else if (level === "medium") {

        confidence.textContent =
            "🟡 Medium confidence — " +
            "game-specific settings may affect the result.";

    }

    else {

        confidence.textContent =
            "🔴 Low confidence — " +
            "verify the physical result in-game.";

    }

}


/* =========================
   INVERT
   ========================= */

invertBtn.addEventListener(
    "click",
    () => {

        const oldSource =
            sourceGame.value;

        const oldSourceSens =
            sourceSens.value;

        const oldSourceDpi =
            sourceDpi.value;


        sourceGame.value =
            targetGame.value;

        targetGame.value =
            oldSource;


        sourceSens.value =
            oldSourceSens || "";


        targetDpi.value =
            oldSourceDpi || "800";


        saveSettings();

        showToast("Games swapped.");

    }
);


/* =========================
   CONVERT BUTTON
   ========================= */

convertBtn.addEventListener(
    "click",
    convert
);


/* ENTER = CONVERT */

[
    sourceSens,
    sourceDpi,
    targetDpi
].forEach(input => {

    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                convert();
            }

        }
    );

});


/* =========================
   QUICK DPI
   ========================= */

document
    .querySelectorAll("[data-dpi-source]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                sourceDpi.value =
                    button.dataset.dpiSource;

            }
        );

    });


document
    .querySelectorAll("[data-dpi-target]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                targetDpi.value =
                    button.dataset.dpiTarget;

            }
        );

    });


/* =========================
   CM CALCULATOR
   ========================= */

cmBtn.addEventListener(
    "click",
    () => {

        const game =
            games[cmGame.value];

        const sens =
            Number(cmSens.value);

        const dpi =
            Number(cmDpi.value);


        if (
            !game ||
            !Number.isFinite(sens) ||
            sens <= 0 ||
            !Number.isFinite(dpi) ||
            dpi <= 0
        ) {

            showToast(
                "Enter valid sensitivity and DPI."
            );

            return;
        }


        const cm =
            calculateCm360(
                sens,
                dpi,
                game.yaw
            );


        cmValue.textContent =
            formatCm(cm);


        cmResult.classList.remove(
            "hidden"
        );

    }
);


/* =========================
   COPY SETTINGS
   ========================= */

copyBtn.addEventListener(
    "click",
    async () => {

        const game =
            resultGame.textContent;

        const sens =
            resultSens.textContent;

        const dpi =
            resultDpi.textContent;


        const text =
`FPS Sensitivity Converter

Game: ${game}
Sensitivity: ${sens}
DPI: ${dpi}

CM/360°: ${targetCm.textContent}

Converted with FPS Sensitivity Converter.`;


        try {

            await navigator.clipboard.writeText(
                text
            );

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


/* =========================
   FAVORITES
   ========================= */

function getFavorites() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "fpsFavorites"
            )
        ) || [];

    } catch {

        return [];

    }

}


function saveFavorites(favorites) {

    localStorage.setItem(
        "fpsFavorites",
        JSON.stringify(favorites)
    );

}


function toggleFavorite(
    select,
    button
) {

    const favorites =
        getFavorites();

    const id =
        select.value;

    const index =
        favorites.indexOf(id);


    if (index === -1) {

        favorites.push(id);

        button.classList.add("active");
        button.textContent = "★";

        showToast("Added to favorites.");

    } else {

        favorites.splice(index, 1);

        button.classList.remove("active");
        button.textContent = "☆";

        showToast("Removed from favorites.");

    }


    saveFavorites(favorites);

}


function updateFavoriteButton(
    select,
    button
) {

    const favorites =
        getFavorites();

    const active =
        favorites.includes(
            select.value
        );


    button.classList.toggle(
        "active",
        active
    );

    button.textContent =
        active ? "★" : "☆";

}


sourceFavorite.addEventListener(
    "click",
    () => {

        toggleFavorite(
            sourceGame,
            sourceFavorite
        );

    }
);


targetFavorite.addEventListener(
    "click",
    () => {

        toggleFavorite(
            targetGame,
            targetFavorite
        );

    }
);


sourceGame.addEventListener(
    "change",
    () => {

        updateFavoriteButton(
            sourceGame,
            sourceFavorite
        );

        saveSettings();

    }
);


targetGame.addEventListener(
    "change",
    () => {

        updateFavoriteButton(
            targetGame,
            targetFavorite
        );

        saveSettings();

    }
);


/* =========================
   LOCAL STORAGE
   ========================= */

function saveSettings() {

    const settings = {

        sourceGame:
            sourceGame.value,

        targetGame:
            targetGame.value,

        sourceSens:
            sourceSens.value,

        sourceDpi:
            sourceDpi.value,

        targetDpi:
            targetDpi.value,

        cmGame:
            cmGame.value,

        cmSens:
            cmSens.value,

        cmDpi:
            cmDpi.value

    };


    localStorage.setItem(
        "fpsConverterSettings",
        JSON.stringify(settings)
    );

}


function loadSettings() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "fpsConverterSettings"
                )
            );


        if (!saved) {
            return;
        }


        if (games[saved.sourceGame]) {
            sourceGame.value =
                saved.sourceGame;
        }

        if (games[saved.targetGame]) {
            targetGame.value =
                saved.targetGame;
        }

        if (saved.sourceSens) {
            sourceSens.value =
                saved.sourceSens;
        }

        if (saved.sourceDpi) {
            sourceDpi.value =
                saved.sourceDpi;
        }

        if (saved.targetDpi) {
            targetDpi.value =
                saved.targetDpi;
        }

        if (games[saved.cmGame]) {
            cmGame.value =
                saved.cmGame;
        }

        if (saved.cmSens) {
            cmSens.value =
                saved.cmSens;
        }

        if (saved.cmDpi) {
            cmDpi.value =
                saved.cmDpi;
        }

    } catch {

        console.log(
            "No saved settings."
        );

    }

}


loadSettings();


/* =========================
   TOAST
   ========================= */

let toastTimer;

function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            1800
        );

}


/* =========================
   INITIAL UI
   ========================= */

updateFavoriteButton(
    sourceGame,
    sourceFavorite
);

updateFavoriteButton(
    targetGame,
    targetFavorite
);


/* =========================
   LIVE PREVIEW
   ========================= */

[
    sourceSens,
    sourceDpi,
    targetDpi
].forEach(input => {

    input.addEventListener(
        "input",
        () => {

            const data =
                calculateConversion();

            if (data) {

                convertedPreview.textContent =
                    formatNumber(
                        data.converted
                    );

            }

        }
    );

});


/* =========================================================
   END V9
   ========================================================= */
