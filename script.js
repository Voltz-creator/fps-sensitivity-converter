/*
==================================================
FPS SENSITIVITY CONVERTER
V1

Supported:
- VALORANT
- Counter-Strike 2
- Apex Legends
- Overwatch 2

The converter matches horizontal hipfire
sensitivity using cm/360°.

Formula:

cm/360 =
(360 × 2.54) /
(DPI × sensitivity × yaw)

Target sensitivity =
(360 × 2.54) /
(target DPI × yaw × source cm/360)

Equivalent simplified formula:

target sensitivity =
source sensitivity ×
(source yaw / target yaw) ×
(source DPI / target DPI)
==================================================
*/


/*
==================================================
GAME DATABASE
==================================================
*/

const games = {

    valorant: {
        name: "VALORANT",
        yaw: 0.07,
        type: "decimal"
    },

    cs2: {
        name: "Counter-Strike 2",
        yaw: 0.022,
        type: "decimal"
    },

    apex: {
        name: "Apex Legends",
        yaw: 0.022,
        type: "decimal"
    },

    overwatch: {
        name: "Overwatch 2",
        yaw: 0.0066,
        type: "decimal"
    }

};


/*
==================================================
GET HTML ELEMENTS
==================================================
*/

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


/*
==================================================
CALCULATE CM/360
==================================================

This tells us how many centimeters the
mouse must travel to make a 360° turn.
*/

function calculateCm360(
    sensitivity,
    dpi,
    yaw
) {

    const cm360 =
        (360 * 2.54) /
        (dpi * sensitivity * yaw);

    return cm360;
}


/*
==================================================
CONVERT SENSITIVITY
==================================================
*/

function convertSensitivity() {

    /*
    Get selected games
    */

    const source =
        games[sourceGame.value];

    const target =
        games[targetGame.value];


    /*
    Get user values
    */

    const sens =
        Number(sourceSensitivity.value);

    const sourceDpiValue =
        Number(sourceDpi.value);

    const targetDpiValue =
        Number(targetDpi.value);


    /*
    Check values
    */

    if (
        !Number.isFinite(sens) ||
        sens <= 0
    ) {

        alert(
            "Please enter a valid sensitivity."
        );

        return;
    }


    if (
        !Number.isFinite(sourceDpiValue) ||
        sourceDpiValue <= 0
    ) {

        alert(
            "Please enter a valid source DPI."
        );

        return;
    }


    if (
        !Number.isFinite(targetDpiValue) ||
        targetDpiValue <= 0
    ) {

        alert(
            "Please enter a valid target DPI."
        );

        return;
    }


    /*
    ==============================================
    STEP 1
    ==============================================

    Calculate source cm/360.
    */

    const sourceCm =
        calculateCm360(
            sens,
            sourceDpiValue,
            source.yaw
        );


    /*
    ==============================================
    STEP 2
    ==============================================

    Find the target sensitivity that produces
    the exact same cm/360.
    */

    const targetSens =
        (360 * 2.54) /
        (
            targetDpiValue *
            target.yaw *
            sourceCm
        );


    /*
    ==============================================
    STEP 3
    ==============================================

    Calculate target cm/360 again.

    This gives us a verification that our
    result actually matches the source.
    */

    const targetCm =
        calculateCm360(
            targetSens,
            targetDpiValue,
            target.yaw
        );


    /*
    ==============================================
    STEP 4

    Calculate eDPI.
    ==============================================
    */

    const sourceEdpiValue =
        sens * sourceDpiValue;

    const targetEdpiValue =
        targetSens * targetDpiValue;


    /*
    ==============================================
    DISPLAY RESULT
    ==============================================
    */

    const formattedTarget =
        formatSensitivity(targetSens);


    convertedSensitivity.textContent =
        formattedTarget;


    mainSensitivity.textContent =
        formattedTarget;


    resultGame.textContent =
        target.name;


    sourceCm360.textContent =
        sourceCm.toFixed(2) + " cm";


    targetCm360.textContent =
        targetCm.toFixed(2) + " cm";


    sourceEdpi.textContent =
        sourceEdpiValue.toFixed(2);


    targetEdpi.textContent =
        targetEdpiValue.toFixed(2);


    /*
    Show results
    */

    results.classList.remove("hidden");

}


/*
==================================================
FORMAT SENSITIVITY
==================================================

We don't want:
1.2727272727272727

We want:
1.2727
==================================================
*/

function formatSensitivity(value) {

    return Number(
        value.toFixed(4)
    ).toString();

}


/*
==================================================
SWAP GAMES
==================================================
*/

swapButton.addEventListener(
    "click",
    () => {

        const oldSource =
            sourceGame.value;

        sourceGame.value =
            targetGame.value;

        targetGame.value =
            oldSource;


        /*
        If a result already exists,
        recalculate it.
        */

        if (
            sourceSensitivity.value !== ""
        ) {

            convertSensitivity();

        }

    }
);


/*
==================================================
CONVERT BUTTON
==================================================
*/

convertButton.addEventListener(
    "click",
    convertSensitivity
);


/*
==================================================
ENTER KEY
==================================================
*/

sourceSensitivity.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            convertSensitivity();

        }

    }
);


sourceDpi.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            convertSensitivity();

        }

    }
);


targetDpi.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            convertSensitivity();

        }

    }
);


/*
==================================================
COPY RESULT
==================================================
*/

copyButton.addEventListener(
    "click",
    async () => {

        const text =
            mainSensitivity.textContent;

        if (
            text === "—"
        ) {

            return;

        }


        try {

            await navigator.clipboard.writeText(
                text
            );

            copyButton.textContent =
                "Copied!";


            setTimeout(
                () => {

                    copyButton.textContent =
                        "Copy";

                },
                1500
            );

        } catch (error) {

            alert(
                "Could not copy the result."
            );

        }

    }
);
