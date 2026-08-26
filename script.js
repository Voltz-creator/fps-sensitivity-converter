/* ==================================================
   FPS SENSITIVITY CONVERTER
   VERSION 3
================================================== */


/* ==================================================
   GAME DATABASE

   yaw = horizontal rotation constant

   IMPORTANT:
   Fortnite is currently experimental.
================================================== */

const games = {

    valorant: {
        name: "VALORANT",
        yaw: 0.07,
        reliable: true
    },

    cs2: {
        name: "Counter-Strike 2",
        yaw: 0.022,
        reliable: true
    },

    apex: {
        name: "Apex Legends",
        yaw: 0.022,
        reliable: true
    },

    overwatch: {
        name: "Overwatch 2",
        yaw: 0.0066,
        reliable: true
    },

    fortnite: {
        name: "Fortnite",
        yaw: 0.0055555556,
        reliable: false
    }

};


/* ==================================================
   GET ELEMENTS
================================================== */


/* Converter */

const sourceGame =
    document.getElementById("sourceGame");

const targetGame =
    document.getElementById("targetGame");

const sourceSensitivity =
    document.getElementById("sourceSensitivity");

const sourceDpi =
    document.getElementById("sourceDpi");

const targetDpiDisplay =
    document.getElementById("targetDpiDisplay");

const convertedSensitivity =
    document.getElementById("convertedSensitivity");

const results =
    document.getElementById("results");

const resultGame =
    document.getElementById("resultGame");

const mainSensitivity =
    document.getElementById("mainSensitivity");

const resultDpi =
    document.getElementById("resultDpi");

const instructionText =
    document.getElementById("instructionText");

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

const swapButton =
    document.getElementById("swapButton");

const fortniteNotice =
    document.getElementById("fortniteNotice");


/* CM/360 */

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


/* Compare */

const compareGameA =
    document.getElementById("compareGameA");

const compareSensA =
    document.getElementById("compareSensA");

const compareDpiA =
    document.getElementById("compareDpiA");

const compareGameB =
    document.getElementById("compareGameB");

const compareSensB =
    document.getElementById("compareSensB");

const compareDpiB =
    document.getElementById("compareDpiB");

const compareButton =
    document.getElementById("compareButton");

const compareResult =
    document.getElementById("compareResult");

const compareStatus =
    document.getElementById("compareStatus");

const compareCmA =
    document.getElementById("compareCmA");

const compareCmB =
    document.getElementById("compareCmB");


/* ==================================================
   GET GAME
================================================== */

function getGame(selectElement) {

    return games[selectElement.value];

}


/* ==================================================
   CM/360 CALCULATION

   Formula:

   cm/360 =
   (360 × 2.54) /
   (DPI × sensitivity × yaw)
================================================== */

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
   FORMAT NUMBER
================================================== */

function formatSensitivity(value) {

    if (!Number.isFinite(value)) {
        return "—";
    }

    return Number(
        value.toFixed(4)
    ).toString();

}


/* ==================================================
   MAIN CONVERSION

   THIS FUNCTION IS GLOBAL.

   The HTML button calls it directly:

   onclick="convertSensitivity()"

   This makes the button reliable.
================================================== */

function convertSensitivity() {

    try {

        /* Get selected games */

        const source =
            getGame(sourceGame);

        const target =
            getGame(targetGame);


        /* Get values */

        const sensitivity =
            Number(
                sourceSensitivity.value
            );

        const dpi =
            Number(
                sourceDpi.value
            );


        /* Validate sensitivity */

        if (
            !Number.isFinite(sensitivity) ||
            sensitivity <= 0
        ) {

            alert(
                "Please enter a valid sensitivity."
            );

            sourceSensitivity.focus();

            return;
        }


        /* Validate DPI */

        if (
            !Number.isFinite(dpi) ||
            dpi <= 0
        ) {

            alert(
                "Please enter a valid DPI."
            );

            sourceDpi.focus();

            return;
        }


        /* Keep same DPI */

        const targetDpi =
            dpi;


        /* Calculate source cm/360 */

        const sourceCm =
            calculateCm360(
                sensitivity,
                dpi,
                source.yaw
            );


        /*
            Calculate target sensitivity.

            We want:

            source cm/360
            =
            target cm/360
        */

        const targetSensitivity =
            (
                360 * 2.54
            ) /
            (
                targetDpi *
                target.yaw *
                sourceCm
            );


        /* Verify target cm/360 */

        const targetCm =
            calculateCm360(
                targetSensitivity,
                targetDpi,
                target.yaw
            );


        /* eDPI */

        const sourceEDPI =
            sensitivity *
            dpi;

        const targetEDPI =
            targetSensitivity *
            targetDpi;


        /* Format */

        const formatted =
            formatSensitivity(
                targetSensitivity
            );


        /* Live result */

        convertedSensitivity.textContent =
            formatted;

        targetDpiDisplay.textContent =
            targetDpi + " DPI";


        /* Main result */

        resultGame.textContent =
            target.name;

        mainSensitivity.textContent =
            formatted;

        resultDpi.textContent =
            targetDpi + " DPI";


        /* Instruction */

        instructionText.textContent =
            `In ${target.name}, set your sensitivity to ${formatted} and keep your mouse DPI at ${targetDpi}. Your calculated physical sensitivity is approximately ${sourceCm.toFixed(2)} cm/360°.`;



        /* Statistics */

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


        /* Fortnite warning */

        if (
            !source.reliable ||
            !target.reliable
        ) {

            fortniteNotice.classList.remove(
                "hidden"
            );

        } else {

            fortniteNotice.classList.add(
                "hidden"
            );

        }


        /* Show result */

        results.classList.remove(
            "hidden"
        );


        /* Scroll to result */

        setTimeout(
            () => {

                results.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            },
            50
        );


    } catch (error) {

        console.error(
            "Conversion error:",
            error
        );

        alert(
            "Something went wrong. Please check your values."
        );

    }

}


/* ==================================================
   SWAP GAMES
================================================== */

swapButton.addEventListener(
    "click",
    function () {

        const oldSource =
            sourceGame.value;

        sourceGame.value =
            targetGame.value;

        targetGame.value =
            oldSource;


        /* Automatically convert if a value exists */

        if (
            sourceSensitivity.value.trim() !== ""
        ) {

            convertSensitivity();

        }

    }
);


/* ==================================================
   COPY RESULT
================================================== */

copyButton.addEventListener(
    "click",
    async function () {

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

            copyButton.textContent =
                "✓ Copied!";


            setTimeout(
                function () {

                    copyButton.textContent =
                        "📋 Copy";

                },
                1500
            );


        } catch (error) {

            console.error(
                "Copy error:",
                error
            );

            alert(
                "Copy failed. You can copy the result manually."
            );

        }

    }
);


/* ==================================================
   CM/360 CALCULATOR
================================================== */

cmButton.addEventListener(
    "click",
    function () {

        const game =
            getGame(cmGame);

        const sensitivity =
            Number(
                cmSensitivity.value
            );

        const dpi =
            Number(
                cmDpi.value
            );


        /* Validate */

        if (
            !Number.isFinite(sensitivity) ||
            sensitivity <= 0
        ) {

            alert(
                "Please enter a valid sensitivity."
            );

            cmSensitivity.focus();

            return;
        }


        if (
            !Number.isFinite(dpi) ||
            dpi <= 0
        ) {

            alert(
                "Please enter a valid DPI."
            );

            cmDpi.focus();

            return;
        }


        /* Calculate */

        const result =
            calculateCm360(
                sensitivity,
                dpi,
                game.yaw
            );


        /* Display */

        cmResult.textContent =
            result.toFixed(2) +
            " cm";


        /* Fortnite warning */

        if (
            !game.reliable
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
   COMPARE
================================================== */

compareButton.addEventListener(
    "click",
    function () {

        const gameA =
            games[
                compareGameA.value
            ];

        const gameB =
            games[
                compareGameB.value
            ];


        const sensitivityA =
            Number(
                compareSensA.value
            );

        const dpiA =
            Number(
                compareDpiA.value
            );


        const sensitivityB =
            Number(
                compareSensB.value
            );

        const dpiB =
            Number(
                compareDpiB.value
            );


        /* Validate sensitivity */

        if (
            !Number.isFinite(sensitivityA) ||
            sensitivityA <= 0 ||
            !Number.isFinite(sensitivityB) ||
            sensitivityB <= 0
        ) {

            alert(
                "Please enter valid sensitivities."
            );

            return;
        }


        /* Validate DPI */

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


        /* Calculate CM/360 */

        const cmA =
            calculateCm360(
                sensitivityA,
                dpiA,
                gameA.yaw
            );

        const cmB =
            calculateCm360(
                sensitivityB,
                dpiB,
                gameB.yaw
            );


        /* Difference */

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


        /* Display values */

        compareCmA.textContent =
            cmA.toFixed(2) +
            " cm";

        compareCmB.textContent =
            cmB.toFixed(2) +
            " cm";


        /* Determine result */

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


/* ==================================================
   ENTER KEY

   Main converter
================================================== */

sourceSensitivity.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            convertSensitivity();

        }

    }
);


sourceDpi.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            convertSensitivity();

        }

    }
);


/* ==================================================
   ENTER KEY - CM/360
================================================== */

cmSensitivity.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            cmButton.click();

        }

    }
);

cmDpi.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            cmButton.click();

        }

    }
);
