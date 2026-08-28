/*
    FPS Sensitivity Converter
    V12

    Formula:

    cm/360 = (360 * 2.54) / (DPI * sensitivity * yaw)

    target sensitivity =
    source sensitivity * source DPI / target DPI * source yaw / target yaw
*/


const games = {

    valorant: {
        name: "VALORANT",
        yaw: 0.07,
        confidence: "high",
        settings: "Settings → General → Mouse → Sensitivity"
    },

    cs2: {
        name: "Counter-Strike 2",
        yaw: 0.022,
        confidence: "high",
        settings: "Settings → Keyboard / Mouse → Mouse Sensitivity"
    },

    apex: {
        name: "Apex Legends",
        yaw: 0.022,
        confidence: "high",
        settings: "Settings → Mouse/Keyboard → Mouse Sensitivity"
    },

    ow2: {
        name: "Overwatch 2",
        yaw: 0.0066,
        confidence: "high",
        settings: "Options → Controls → Mouse Sensitivity"
    },

    /*
        Fortnite uses a percentage-based sensitivity scale.
        This value is treated specially.
    */
    fortnite: {
        name: "Fortnite",
        yaw: 0.0055555556,
        confidence: "medium",
        percentage: true,
        settings: "Settings → Mouse and Keyboard → X/Y Sensitivity"
    },

    r6: {
        name: "Rainbow Six Siege",
        yaw: 0.00223,
        confidence: "medium",
        settings: "Options → Controls → Mouse Sensitivity"
    },

    cod: {
        name: "Call of Duty / Warzone",
        yaw: 0.0066,
        confidence: "medium",
        settings: "Settings → Mouse → Sensitivity"
    },

    finals: {
        name: "THE FINALS",
        yaw: 0.0066,
        confidence: "medium",
        settings: "Settings → Controls → Mouse Sensitivity"
    },

    destiny2: {
        name: "Destiny 2",
        yaw: 0.0066,
        confidence: "medium",
        settings: "Settings → Mouse and Keyboard → Look Sensitivity"
    },

    deadlock: {
        name: "Deadlock",
        yaw: 0.022,
        confidence: "medium",
        settings: "Settings → Mouse → Sensitivity"
    },

    marvelrivals: {
        name: "Marvel Rivals",
        yaw: 0.0066,
        confidence: "medium",
        settings: "Settings → Keyboard → Mouse Sensitivity"
    }

};


const sourceGame = document.getElementById("sourceGame");
const targetGame = document.getElementById("targetGame");

const sourceSens = document.getElementById("sourceSens");
const sourceDpi = document.getElementById("sourceDpi");
const targetDpi = document.getElementById("targetDpi");

const convertedSensitivity =
    document.getElementById("convertedSensitivity");

const convertButton =
    document.getElementById("convertButton");

const swapButton =
    document.getElementById("swapButton");

const resultGame =
    document.getElementById("resultGame");

const resultSensitivity =
    document.getElementById("resultSensitivity");

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

const settingsLocation =
    document.getElementById("settingsLocation");

const instructionText =
    document.getElementById("instructionText");

const gameNote =
    document.getElementById("gameNote");


/* --------------------------------
   CM / 360
-------------------------------- */

function calculateCm360(gameId, sensitivity, dpi) {

    const game = games[gameId];

    if (!game) {
        return null;
    }

    if (
        !Number.isFinite(sensitivity) ||
        !Number.isFinite(dpi) ||
        sensitivity <= 0 ||
        dpi <= 0
    ) {
        return null;
    }

    return (360 * 2.54) /
        (dpi * sensitivity * game.yaw);
}


/* --------------------------------
   CONVERSION
-------------------------------- */

function convertSensitivity() {

    const source = games[sourceGame.value];
    const target = games[targetGame.value];

    const sens = parseFloat(sourceSens.value);
    const dpi = parseFloat(sourceDpi.value);
    const targetDpiValue = parseFloat(targetDpi.value);

    if (!source || !target) {
        return;
    }

    if (
        !Number.isFinite(sens) ||
        !Number.isFinite(dpi) ||
        !Number.isFinite(targetDpiValue) ||
        sens <= 0 ||
        dpi <= 0 ||
        targetDpiValue <= 0
    ) {

        alert("Please enter a valid sensitivity and DPI.");
        return;
    }


    /*
        Calculate physical sensitivity
    */

    const cm360 = calculateCm360(
        sourceGame.value,
        sens,
        dpi
    );


    if (!cm360) {
        return;
    }


    /*
        Calculate target sensitivity.

        We solve the CM/360 formula for sensitivity.
    */

    let targetSensitivity =
        (360 * 2.54) /
        (targetDpiValue * target.yaw * cm360);


    /*
        Numerical cleanup
    */

    targetSensitivity =
        Number(targetSensitivity.toFixed(4));


    /*
        Target CM/360 calculated from
        the resulting target sensitivity.

        IMPORTANT:
        This prevents Target CM/360° from
        staying empty.
    */

    const calculatedTargetCm =
        calculateCm360(
            targetGame.value,
            targetSensitivity,
            targetDpiValue
        );


    /*
        Update converted sensitivity
    */

    convertedSensitivity.textContent =
        targetSensitivity.toFixed(4);


    /*
        Update result
    */

    resultGame.textContent =
        target.name;

    resultSensitivity.textContent =
        targetSensitivity.toFixed(4);

    resultDpi.textContent =
        `${targetDpiValue} DPI`;


    sourceCm.textContent =
        `${cm360.toFixed(2)} cm`;

    targetCm.textContent =
        calculatedTargetCm
            ? `${calculatedTargetCm.toFixed(2)} cm`
            : "—";


    /*
        eDPI
    */

    sourceEdpi.textContent =
        (sens * dpi).toFixed(2);

    targetEdpi.textContent =
        (targetSensitivity * targetDpiValue).toFixed(2);


    /*
        Confidence
    */

    if (
        source.confidence === "high" &&
        target.confidence === "high"
    ) {

        confidence.className =
            "confidence high";

        confidence.textContent =
            "🟢 High confidence — the conversion uses established sensitivity values for both games.";

    } else {

        confidence.className =
            "confidence medium";

        confidence.textContent =
            "🟡 Medium confidence — game-specific settings may affect the result.";
    }


    /*
        Settings location
    */

    settingsLocation.textContent =
        target.settings;


    /*
        Instruction
    */

    instructionText.textContent =
        `In ${target.name}, set your sensitivity to ${targetSensitivity.toFixed(4)} and keep your mouse DPI at ${targetDpiValue} DPI. Your calculated physical sensitivity is approximately ${calculatedTargetCm.toFixed(2)} cm/360°.`;



    /*
        Game-specific warning
    */

    let note = "";

    if (targetGame.value === "fortnite") {

        note =
            "⚠️ Fortnite uses a percentage-based sensitivity scale. Verify the physical result in-game.";

    } else if (targetGame.value === "r6") {

        note =
            "⚠️ Rainbow Six Siege has separate ADS and scope multipliers. This conversion only targets general hipfire.";

    } else if (targetGame.value === "cod") {

        note =
            "⚠️ Call of Duty contains additional aiming and FOV settings. This result targets general hipfire.";

    } else if (
        targetGame.value === "finals" ||
        targetGame.value === "destiny2" ||
        targetGame.value === "deadlock" ||
        targetGame.value === "marvelrivals"
    ) {

        note =
            "⚠️ Game-specific settings can affect the final feel. Use CM/360° as the main physical reference.";

    } else {

        note =
            "This conversion targets horizontal hipfire sensitivity. ADS, scopes and FOV settings can behave differently between games.";
    }


    gameNote.textContent = note;


    /*
        Update URL
    */

    updateUrl(
        sourceGame.value,
        targetGame.value,
        sens,
        dpi,
        targetDpiValue
    );
}


/* --------------------------------
   URL
-------------------------------- */

function updateUrl(from, to, sens, dpi, targetDpiValue) {

    const params = new URLSearchParams();

    params.set("from", from);
    params.set("to", to);
    params.set("sens", sens);
    params.set("dpi", dpi);
    params.set("targetDpi", targetDpiValue);


    const newUrl =
        `${window.location.pathname}?${params.toString()}`;

    window.history.replaceState(
        {},
        "",
        newUrl
    );
}


/* --------------------------------
   LOAD URL
-------------------------------- */

function loadFromUrl() {

    const params =
        new URLSearchParams(window.location.search);

    const from =
        params.get("from");

    const to =
        params.get("to");

    const sens =
        params.get("sens");

    const dpi =
        params.get("dpi");

    const targetDpiParam =
        params.get("targetDpi");


    if (
        from &&
        games[from]
    ) {
        sourceGame.value = from;
    }


    if (
        to &&
        games[to]
    ) {
        targetGame.value = to;
    }


    if (sens) {
        sourceSens.value = sens;
    }


    if (dpi) {
        sourceDpi.value = dpi;
    }


    if (targetDpiParam) {
        targetDpi.value = targetDpiParam;
    }


    convertSensitivity();
}


/* --------------------------------
   SWAP
-------------------------------- */

swapButton.addEventListener(
    "click",
    function () {

        const oldSource =
            sourceGame.value;

        const oldTarget =
            targetGame.value;

        sourceGame.value =
            oldTarget;

        targetGame.value =
            oldSource;


        /*
            The converted target sensitivity
            becomes the new source sensitivity.
        */

        const oldResult =
            parseFloat(resultSensitivity.textContent);

        const oldTargetDpi =
            parseFloat(targetDpi.value);


        if (
            Number.isFinite(oldResult) &&
            oldResult > 0
        ) {

            sourceSens.value =
                oldResult;

            sourceDpi.value =
                oldTargetDpi;
        }


        convertSensitivity();
    }
);


/* --------------------------------
   CONVERT BUTTON
-------------------------------- */

convertButton.addEventListener(
    "click",
    convertSensitivity
);


/* --------------------------------
   ENTER KEY
-------------------------------- */

[
    sourceSens,
    sourceDpi,
    targetDpi
].forEach(
    function (input) {

        input.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    convertSensitivity();
                }
            }
        );
    }
);


/* --------------------------------
   QUICK DPI
-------------------------------- */

document
    .querySelectorAll("[data-source-dpi]")
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    sourceDpi.value =
                        button.dataset.sourceDpi;

                    convertSensitivity();
                }
            );
        }
    );


document
    .querySelectorAll("[data-target-dpi]")
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    targetDpi.value =
                        button.dataset.targetDpi;

                    convertSensitivity();
                }
            );
        }
    );


/* --------------------------------
   CM CALCULATOR
-------------------------------- */

const cmGame =
    document.getElementById("cmGame");

const cmSens =
    document.getElementById("cmSens");

const cmDpi =
    document.getElementById("cmDpi");

const cmButton =
    document.getElementById("cmButton");

const cmResult =
    document.getElementById("cmResult");


cmButton.addEventListener(
    "click",
    function () {

        const sensitivity =
            parseFloat(cmSens.value);

        const dpi =
            parseFloat(cmDpi.value);


        const result =
            calculateCm360(
                cmGame.value,
                sensitivity,
                dpi
            );


        if (!result) {

            alert(
                "Please enter a valid sensitivity and DPI."
            );

            return;
        }


        cmResult.textContent =
            `${result.toFixed(2)} cm`;
    }
);


/* --------------------------------
   COPY
-------------------------------- */

const copyButton =
    document.getElementById("copyButton");


copyButton.addEventListener(
    "click",
    async function () {

        const game =
            resultGame.textContent;

        const sensitivity =
            resultSensitivity.textContent;

        const dpi =
            resultDpi.textContent;


        const text =
`FPS Sensitivity Converter

Game: ${game}
Sensitivity: ${sensitivity}
DPI: ${dpi}

CM/360°: ${targetCm.textContent}`;


        try {

            await navigator.clipboard.writeText(text);

            copyButton.textContent =
                "✓ Copied!";

            setTimeout(
                function () {

                    copyButton.textContent =
                        "📋 Copy settings";

                },
                1500
            );

        } catch (error) {

            alert(
                "Copy is not available in this browser."
            );
        }
    }
);


/* --------------------------------
   AUTO UPDATE PREVIEW
-------------------------------- */

[
    sourceGame,
    targetGame,
    sourceSens,
    sourceDpi,
    targetDpi
].forEach(
    function (element) {

        element.addEventListener(
            "change",
            function () {

                /*
                    We only convert automatically
                    when valid values exist.
                */

                const sens =
                    parseFloat(sourceSens.value);

                const dpi =
                    parseFloat(sourceDpi.value);

                const targetDpiValue =
                    parseFloat(targetDpi.value);


                if (
                    sens > 0 &&
                    dpi > 0 &&
                    targetDpiValue > 0
                ) {

                    convertSensitivity();
                }
            }
        );
    }
);


/* --------------------------------
   START
-------------------------------- */

loadFromUrl();
