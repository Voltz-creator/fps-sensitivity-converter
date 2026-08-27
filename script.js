/* ==================================================
   FPS SENSITIVITY CONVERTER
   VERSION 5
================================================== */


/* ==================================================
   GAME DATABASE
================================================== */

const games = {

    valorant: {
        name: "VALORANT",
        yaw: 0.07,
        confidence: "high",

        settings: [
            {
                name: "Sensitivity",
                valueType: "converted",
                location: "Settings → General → Mouse → Sensitivity",
                status: "Use calculated value"
            },
            {
                name: "Mouse DPI",
                valueType: "dpi",
                location: "Your mouse software",
                status: "Keep your target DPI"
            },
            {
                name: "ADS Sensitivity",
                value: "1.0",
                location: "Settings → General → Mouse",
                status: "Separate setting"
            }
        ]
    },


    cs2: {
        name: "Counter-Strike 2",
        yaw: 0.022,
        confidence: "high",

        settings: [
            {
                name: "Sensitivity",
                valueType: "converted",
                location: "Settings → Keyboard / Mouse → Mouse Sensitivity",
                status: "Use calculated value"
            },
            {
                name: "Mouse DPI",
                valueType: "dpi",
                location: "Your mouse software",
                status: "Keep your target DPI"
            },
            {
                name: "Zoom Sensitivity",
                value: "1.0",
                location: "Settings → Keyboard / Mouse",
                status: "Separate setting"
            }
        ]
    },


    apex: {
        name: "Apex Legends",
        yaw: 0.022,
        confidence: "high",

        settings: [
            {
                name: "Mouse Sensitivity",
                valueType: "converted",
                location: "Settings → Mouse/Keyboard → Mouse Sensitivity",
                status: "Use calculated value"
            },
            {
                name: "Mouse DPI",
                valueType: "dpi",
                location: "Your mouse software",
                status: "Keep your target DPI"
            },
            {
                name: "ADS Mouse Sensitivity Multiplier",
                value: "1.0",
                location: "Settings → Mouse/Keyboard",
                status: "Separate setting"
            }
        ]
    },


    overwatch: {
        name: "Overwatch 2",
        yaw: 0.0066,
        confidence: "high",

        settings: [
            {
                name: "Horizontal Sensitivity",
                valueType: "converted",
                location: "Options → Controls → Mouse",
                status: "Use calculated value"
            },
            {
                name: "Vertical Sensitivity",
                valueType: "converted",
                location: "Options → Controls → Mouse",
                status: "Use the same value"
            },
            {
                name: "Mouse DPI",
                valueType: "dpi",
                location: "Your mouse software",
                status: "Keep your target DPI"
            },
            {
                name: "Relative Aim Sensitivity While Zoomed",
                value: "100%",
                location: "Options → Controls → Mouse",
                status: "Separate setting"
            }
        ]
    },


    fortnite: {
        name: "Fortnite",
        yaw: 0.0055555556,
        confidence: "experimental",

        settings: [
            {
                name: "X-Axis Sensitivity",
                valueType: "convertedPercent",
                location: "Settings → Mouse and Keyboard → X-Axis Sensitivity",
                status: "Experimental"
            },
            {
                name: "Y-Axis Sensitivity",
                valueType: "convertedPercent",
                location: "Settings → Mouse and Keyboard → Y-Axis Sensitivity",
                status: "Use same value as X"
            },
            {
                name: "Targeting Sensitivity",
                value: "100%",
                location: "Settings → Mouse and Keyboard",
                status: "Separate setting"
            },
            {
                name: "Scope Sensitivity",
                value: "100%",
                location: "Settings → Mouse and Keyboard",
                status: "Separate setting"
            },
            {
                name: "Mouse DPI",
                valueType: "dpi",
                location: "Your mouse software",
                status: "Keep your target DPI"
            }
        ]
    }

};


/* ==================================================
   ELEMENTS
================================================== */

const sourceGame =
    document.getElementById("sourceGame");

const targetGame =
    document.getElementById("targetGame");

const sourceSensitivity =
    document.getElementById("sourceSensitivity");

const sourceDpi =
    document.getElementById("sourceDpi");

const targetDpi =
    document.getElementById("targetDpi");

const convertedSensitivity =
    document.getElementById("convertedSensitivity");

const convertButton =
    document.getElementById("convertButton");

const swapButton =
    document.getElementById("swapButton");

const results =
    document.getElementById("results");

const resultGame =
    document.getElementById("resultGame");

const mainSensitivity =
    document.getElementById("mainSensitivity");

const resultDpi =
    document.getElementById("resultDpi");

const settingsList =
    document.getElementById("settingsList");

const sourceCm360 =
    document.getElementById("sourceCm360");

const targetCm360 =
    document.getElementById("targetCm360");

const sourceEdpi =
    document.getElementById("sourceEdpi");

const targetEdpi =
    document.getElementById("targetEdpi");

const copyButton =
    document.getElementById("copyButton");

const copyMessage =
    document.getElementById("copyMessage");

const fortniteNotice =
    document.getElementById("fortniteNotice");

const confidence =
    document.getElementById("confidence");

const confidenceIcon =
    document.getElementById("confidenceIcon");

const confidenceTitle =
    document.getElementById("confidenceTitle");

const confidenceText =
    document.getElementById("confidenceText");


/* CM */

const cmGame =
    document.getElementById("cmGame");

const cmSensitivity =
    document.getElementById("cmSensitivity");

const cmDpi =
    document.getElementById("cmDpi");

const cmButton =
    document.getElementById("cmButton");

const cmResult =
    document.getElementById("cmResult");

const cmFortniteNotice =
    document.getElementById("cmFortniteNotice");


/* ==================================================
   HELPERS
================================================== */

function getGame(id) {

    return games[id];

}


function formatSensitivity(value) {

    if (!Number.isFinite(value)) {
        return "—";
    }

    return Number(
        value.toFixed(4)
    ).toString();

}


function calculateCm360(
    sensitivity,
    dpi,
    yaw
) {

    return (
        (360 * 2.54) /
        (
            dpi *
            sensitivity *
            yaw
        )
    );

}


/* ==================================================
   CONVERTED SENSITIVITY
================================================== */

function calculateTargetSensitivity() {

    const source =
        getGame(sourceGame.value);

    const target =
        getGame(targetGame.value);

    const sensitivity =
        Number(sourceSensitivity.value);

    const sourceDpiValue =
        Number(sourceDpi.value);

    const targetDpiValue =
        Number(targetDpi.value);


    if (
        !Number.isFinite(sensitivity) ||
        sensitivity <= 0 ||
        !Number.isFinite(sourceDpiValue) ||
        sourceDpiValue <= 0 ||
        !Number.isFinite(targetDpiValue) ||
        targetDpiValue <= 0
    ) {

        convertedSensitivity.textContent = "—";

        return null;

    }


    const sourceCm =
        calculateCm360(
            sensitivity,
            sourceDpiValue,
            source.yaw
        );


    const targetSensitivity =
        (
            360 * 2.54
        ) /
        (
            targetDpiValue *
            target.yaw *
            sourceCm
        );


    convertedSensitivity.textContent =
        formatSensitivity(
            targetSensitivity
        );


    return {
        source,
        target,
        sensitivity,
        sourceDpiValue,
        targetDpiValue,
        sourceCm,
        targetSensitivity
    };

}


/* ==================================================
   RENDER SETTINGS
================================================== */

function renderSettings(
    target,
    targetSensitivity,
    targetDpiValue
) {

    settingsList.innerHTML = "";


    target.settings.forEach(
        function(setting) {

            let value;


            if (
                setting.valueType ===
                "converted"
            ) {

                value =
                    formatSensitivity(
                        targetSensitivity
                    );

            }

            else if (
                setting.valueType ===
                "convertedPercent"
            ) {

                value =
                    formatSensitivity(
                        targetSensitivity
                    ) + "%";

            }

            else if (
                setting.valueType ===
                "dpi"
            ) {

                value =
                    targetDpiValue +
                    " DPI";

            }

            else {

                value =
                    setting.value;

            }


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "setting-item";


            item.innerHTML = `

                <div class="setting-top">

                    <span class="setting-name">
                        ${setting.name}
                    </span>

                    <strong class="setting-value">
                        ${value}
                    </strong>

                </div>

                <div class="setting-location">
                    📍 ${setting.location}
                </div>

                <span class="setting-status">
                    ${setting.status}
                </span>

            `;


            settingsList.appendChild(
                item
            );

        }
    );

}


/* ==================================================
   CONFIDENCE
================================================== */

function updateConfidence(
    source,
    target
) {

    if (
        source.confidence === "experimental" ||
        target.confidence === "experimental"
    ) {

        confidenceIcon.textContent =
            "⚠️";

        confidenceTitle.textContent =
            "Experimental";

        confidenceText.textContent =
            "At least one game uses a sensitivity model that should be physically verified.";

        return;

    }


    confidenceIcon.textContent =
        "🟢";

    confidenceTitle.textContent =
        "High confidence";

    confidenceText.textContent =
        "The conversion uses established yaw values for both games.";

}


/* ==================================================
   MAIN CONVERSION
================================================== */

function convertSensitivity() {

    const data =
        calculateTargetSensitivity();


    if (!data) {

        alert(
            "Please enter a valid sensitivity and DPI."
        );

        return;

    }


    const {
        source,
        target,
        sensitivity,
        sourceDpiValue,
        targetDpiValue,
        sourceCm,
        targetSensitivity
    } = data;


    const targetCm =
        calculateCm360(
            targetSensitivity,
            targetDpiValue,
            target.yaw
        );


    const sourceEDPI =
        sensitivity *
        sourceDpiValue;


    const targetEDPI =
        targetSensitivity *
        targetDpiValue;


    resultGame.textContent =
        target.name;


    mainSensitivity.textContent =
        formatSensitivity(
            targetSensitivity
        );


    resultDpi.textContent =
        targetDpiValue +
        " DPI";


    sourceCm360.textContent =
        sourceCm.toFixed(2) +
        " cm";


    targetCm360.textContent =
        targetCm.toFixed(2) +
        " cm";


    sourceEdpi.textContent =
        sourceEDPI.toFixed(2);


    targetEdpi.textContent =
        targetEDPI.toFixed(2);


    renderSettings(
        target,
        targetSensitivity,
        targetDpiValue
    );


    updateConfidence(
        source,
        target
    );


    if (
        source.confidence === "experimental" ||
        target.confidence === "experimental"
    ) {

        fortniteNotice.classList.remove(
            "hidden"
        );

    } else {

        fortniteNotice.classList.add(
            "hidden"
        );

    }


    results.classList.remove(
        "hidden"
    );


    setTimeout(
        function() {

            results.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        },
        50
    );

}


/* ==================================================
   LIVE CALCULATION
================================================== */

function liveUpdate() {

    calculateTargetSensitivity();

}


sourceSensitivity.addEventListener(
    "input",
    liveUpdate
);

sourceDpi.addEventListener(
    "input",
    liveUpdate
);

targetDpi.addEventListener(
    "input",
    liveUpdate
);

sourceGame.addEventListener(
    "change",
    liveUpdate
);

targetGame.addEventListener(
    "change",
    liveUpdate
);


/* ==================================================
   CONVERT BUTTON
================================================== */

convertButton.addEventListener(
    "click",
    function() {

        convertSensitivity();

    }
);


/* ==================================================
   SWAP
================================================== */

swapButton.addEventListener(
    "click",
    function() {

        const oldSource =
            sourceGame.value;

        const oldTarget =
            targetGame.value;


        sourceGame.value =
            oldTarget;

        targetGame.value =
            oldSource;


        const oldDpi =
            sourceDpi.value;

        sourceDpi.value =
            targetDpi.value;

        targetDpi.value =
            oldDpi;


        liveUpdate();


        if (
            sourceSensitivity.value.trim()
            !== ""
        ) {

            convertSensitivity();

        }

    }
);


/* ==================================================
   DPI PRESETS
================================================== */

document
    .querySelectorAll(
        "[data-source-dpi]"
    )
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    sourceDpi.value =
                        button.dataset.sourceDpi;

                    liveUpdate();

                }
            );

        }
    );


document
    .querySelectorAll(
        "[data-target-dpi]"
    )
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    targetDpi.value =
                        button.dataset.targetDpi;

                    liveUpdate();

                }
            );

        }
    );


/* ==================================================
   COPY
================================================== */

copyButton.addEventListener(
    "click",
    async function() {

        const text =
`FPS Sensitivity Converter

Game: ${resultGame.textContent}
Sensitivity: ${mainSensitivity.textContent}
DPI: ${resultDpi.textContent}
CM/360°: ${targetCm360.textContent}`;


        try {

            await navigator.clipboard.writeText(
                text
            );


            copyMessage.classList.remove(
                "hidden"
            );


            setTimeout(
                function() {

                    copyMessage.classList.add(
                        "hidden"
                    );

                },
                2000
            );


        } catch (error) {

            alert(
                "Copy failed. Please copy the settings manually."
            );

        }

    }
);


/* ==================================================
   CM/360 CALCULATOR
================================================== */

cmButton.addEventListener(
    "click",
    function() {

        const game =
            getGame(
                cmGame.value
            );


        const sensitivity =
            Number(
                cmSensitivity.value
            );


        const dpi =
            Number(
                cmDpi.value
            );


        if (
            !Number.isFinite(sensitivity) ||
            sensitivity <= 0 ||
            !Number.isFinite(dpi) ||
            dpi <= 0
        ) {

            alert(
                "Please enter a valid sensitivity and DPI."
            );

            return;

        }


        const result =
            calculateCm360(
                sensitivity,
                dpi,
                game.yaw
            );


        cmResult.textContent =
            result.toFixed(2) +
            " cm";


        if (
            game.confidence ===
            "experimental"
        ) {

            cmFortniteNotice.classList.remove(
                "hidden"
            );

        } else {

            cmFortniteNotice.classList.add(
                "hidden"
            );

        }

    }
);


/* ==================================================
   ENTER KEY
================================================== */

[
    sourceSensitivity,
    sourceDpi,
    targetDpi
].forEach(
    function(input) {

        input.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    convertSensitivity();

                }

            }
        );

    }
);


[
    cmSensitivity,
    cmDpi
].forEach(
    function(input) {

        input.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    cmButton.click();

                }

            }
        );

    }
);


/* ==================================================
   INITIALIZE
================================================== */

liveUpdate();
