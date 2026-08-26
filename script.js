/*
==================================================
FPS SENSITIVITY CONVERTER
V2

Games:
- VALORANT
- CS2
- Apex Legends
- Overwatch 2
- Fortnite

Tools:
- Sensitivity converter
- CM/360 calculator
- Sensitivity comparison

Everything runs locally in the browser.
No API.
No server.
No database.
==================================================
*/


/*
==================================================
GAME DATABASE
==================================================

yaw = horizontal rotation value.

Fortnite is marked as special because its
sensitivity is represented as a percentage
rather than the usual decimal sensitivity.
*/

const games = {

    valorant: {
        name: "VALORANT",
        yaw: 0.07,
        scale: "decimal",
        reliable: true
    },

    cs2: {
        name: "Counter-Strike 2",
        yaw: 0.022,
        scale: "decimal",
        reliable: true
    },

    apex: {
        name: "Apex Legends",
        yaw: 0.022,
        scale: "decimal",
        reliable: true
    },

    overwatch: {
        name: "Overwatch 2",
        yaw: 0.0066,
        scale: "decimal",
        reliable: true
    },

    fortnite: {
        name: "Fortnite",
        yaw: 0.0055555556,
        scale: "percentage",
        reliable: false
    }

};


/*
==================================================
DOM ELEMENTS
==================================================
*/


// Converter

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
    document.getElementById(
        "convertedSensitivity"
    );

const convertButton =
    document.getElementById(
        "convertButton"
    );

const swapButton =
    document.getElementById(
        "swapButton"
    );

const results =
    document.getElementById(
        "results"
    );

const resultGame =
    document.getElementById(
        "resultGame"
    );

const mainSensitivity =
    document.getElementById(
        "mainSensitivity"
    );

const sourceCm360 =
    document.getElementById(
        "sourceCm360"
    );

const targetCm360 =
    document.getElementById(
        "targetCm360"
    );

const sourceEdpi =
    document.getElementById(
        "sourceEdpi"
    );

const targetEdpi =
    document.getElementById(
        "targetEdpi"
    );

const copyButton =
    document.getElementById(
        "copyButton"
    );

const fortniteNotice =
    document.getElementById(
        "fortniteNotice"
    );


// CM/360

const cmGame =
    document.getElementById(
        "cmGame"
    );

const cmSensitivity =
    document.getElementById(
        "cmSensitivity"
    );

const cmDpi =
    document.getElementById(
        "cmDpi"
    );

const cmButton =
    document.getElementById(
        "cmButton"
    );

const cmResult =
    document.getElementById(
        "cmResult"
    );

const cmFortniteNotice =
    document.getElementById(
        "cmFortniteNotice"
    );


// Compare

const compareGameA =
    document.getElementById(
        "compareGameA"
    );

const compareSensA =
    document.getElementById(
        "compareSensA"
    );

const compareDpiA =
    document.getElementById(
        "compareDpiA"
    );

const compareGameB =
    document.getElementById(
        "compareGameB"
    );

const compareSensB =
    document.getElementById(
        "compareSensB"
    );

const compareDpiB =
    document.getElementById(
        "compareDpiB"
    );

const compareButton =
    document.getElementById(
        "compareButton"
    );

const compareResult =
    document.getElementById(
        "compareResult"
    );

const compareStatus =
    document.getElementById(
        "compareStatus"
    );

const compareCmA =
    document.getElementById(
        "compareCmA"
    );

const compareCmB =
    document.getElementById(
        "compareCmB"
    );


/*
==================================================
HELPER
==================================================
*/

function getGame(
    selectElement
) {

    return games[
        selectElement.value
    ];

}


/*
==================================================
CALCULATE CM/360
==================================================

Formula:

cm/360 =
(360 × 2.54) /
(DPI × sensitivity × yaw)
*/

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


/*
==================================================
CONVERT SENSITIVITY
==================================================
*/

function convertSensitivity() {

    const source =
        getGame(sourceGame);

    const target =
        getGame(targetGame);


    const sens =
        Number(
            sourceSensitivity.value
        );

    const sourceDpiValue =
        Number(
            sourceDpi.value
        );

    const targetDpiValue =
        Number(
            targetDpi.value
        );


    /*
    Validate
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
        !Number.isFinite(
            sourceDpiValue
        ) ||
        sourceDpiValue <= 0
    ) {

        alert(
            "Please enter a valid source DPI."
        );

        return;

    }


    if (
        !Number.isFinite(
            targetDpiValue
        ) ||
        targetDpiValue <= 0
    ) {

        alert(
            "Please enter a valid target DPI."
        );

        return;

    }


    /*
    ==============================================
    SOURCE CM/360
    ==============================================
    */

    const sourceCm =
        calculateCm360(
            sens,
            sourceDpiValue,
            source.yaw
        );


    /*
    ==============================================
    TARGET SENSITIVITY
    ==============================================
    */

    const targetSens =
        (
            360 * 2.54
        ) /
        (
            targetDpiValue *
            target.yaw *
            sourceCm
        );


    /*
    ==============================================
    TARGET CM/360
    ==============================================
    */

    const targetCm =
        calculateCm360(
            targetSens,
            targetDpiValue,
            target.yaw
        );


    /*
    ==============================================
    EDPI
    ==============================================
    */

    const sourceEdpiValue =
        sens *
        sourceDpiValue;


    const targetEdpiValue =
        targetSens *
        targetDpiValue;


    /*
    ==============================================
    DISPLAY
    ==============================================
    */

    const formattedTarget =
        formatSensitivity(
            targetSens
        );


    convertedSensitivity.textContent =
        formattedTarget;


    mainSensitivity.textContent =
        formattedTarget;


    resultGame.textContent =
        target.name;


    sourceCm360.textContent =
        sourceCm.toFixed(2) +
        " cm";


    targetCm360.textContent =
        targetCm.toFixed(2) +
        " cm";


    sourceEdpi.textContent =
        sourceEdpiValue.toFixed(2);


    targetEdpi.textContent =
        targetEdpiValue.toFixed(2);


    /*
    Show Fortnite warning
    */

    if (
        source.scale === "percentage" ||
        target.scale === "percentage"
    ) {

        fortniteNotice.classList.remove(
            "hidden"
        );

    } else {

        fortniteNotice.classList.add(
            "hidden"
        );

    }


    /*
    Show result card
    */

    results.classList.remove(
        "hidden"
    );

}


/*
==================================================
FORMAT SENSITIVITY
==================================================
*/

function formatSensitivity(
    value
) {

    return Number(
        value.toFixed(4)
    ).toString();

}


/*
==================================================
SWAP
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


        if (
            sourceSensitivity.value !== ""
        ) {

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

        const value =
            mainSensitivity.textContent;


        if (
            value === "—"
        ) {

            return;

        }


        try {

            await navigator.clipboard.writeText(
                value
            );


            copyButton.textContent =
                "✓ Copied";


            setTimeout(
                () => {

                    copyButton.textContent =
                        "📋 Copy";

                },
                1500
            );


        } catch {

            alert(
                "Could not copy the result."
            );

        }

    }
);


/*
==================================================
CM/360 CALCULATOR
==================================================
*/

cmButton.addEventListener(
    "click",
    () => {

        const game =
            getGame(cmGame);


        const sens =
            Number(
                cmSensitivity.value
            );


        const dpi =
            Number(
                cmDpi.value
            );


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
            !Number.isFinite(dpi) ||
            dpi <= 0
        ) {

            alert(
                "Please enter a valid DPI."
            );

            return;

        }


        const result =
            calculateCm360(
                sens,
                dpi,
                game.yaw
            );


        cmResult.textContent =
            result.toFixed(2) +
            " cm";


        if (
            game.scale === "percentage"
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


/*
==================================================
COMPARE TWO CONFIGURATIONS
==================================================
*/

compareButton.addEventListener(
    "click",
    () => {

        const gameA =
            games[
                compareGameA.value
            ];


        const gameB =
            games[
                compareGameB.value
            ];


        const sensA =
            Number(
                compareSensA.value
            );


        const dpiA =
            Number(
                compareDpiA.value
            );


        const sensB =
            Number(
                compareSensB.value
            );


        const dpiB =
            Number(
                compareDpiB.value
            );


        /*
        Validate
        */

        if (
            !Number.isFinite(sensA) ||
            sensA <= 0 ||
            !Number.isFinite(sensB) ||
            sensB <= 0
        ) {

            alert(
                "Please enter valid sensitivities."
            );

            return;

        }


        if (
            !Number.isFinite(dpiA) ||
            dpiA <= 0 ||
            !Number.isFinite(dpiB) ||
            dpiB <= 0
        ) {

            alert(
                "Please enter valid DPI values."
            );

            return;

        }


        /*
        Calculate both cm/360
        */

        const cmA =
            calculateCm360(
                sensA,
                dpiA,
                gameA.yaw
            );


        const cmB =
            calculateCm360(
                sensB,
                dpiB,
                gameB.yaw
            );


        /*
        Difference
        */

        const difference =
            Math.abs(
                cmA - cmB
            );


        const percentageDifference =
            (
                difference /
                Math.min(
                    cmA,
                    cmB
                )
            ) * 100;


        /*
        Display
        */

        compareCmA.textContent =
            cmA.toFixed(2) +
            " cm";


        compareCmB.textContent =
            cmB.toFixed(2) +
            " cm";


        /*
        Consider them equivalent if
        the difference is less than 0.5%.
        */

        if (
            percentageDifference <= 0.5
        ) {

            compareStatus.textContent =
                "🟢 Equivalent sensitivity";


            compareStatus.style.color =
                "#7ee787";

        } else {

            compareStatus.textContent =
                "🔴 Different sensitivity";


            compareStatus.style.color =
                "#ff7b72";

        }


        compareResult.classList.remove(
            "hidden"
        );

    }
);


/*
==================================================
ENTER KEY SUPPORT
==================================================
*/

[
    sourceSensitivity,
    sourceDpi,
    targetDpi
].forEach(
    element => {

        element.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    convertSensitivity();

                }

            }
        );

    }
);
