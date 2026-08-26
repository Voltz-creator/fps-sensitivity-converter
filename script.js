/*
==================================================
FPS SENSITIVITY CONVERTER
V3
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
GET ELEMENTS
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

const targetDpiDisplay =
    document.getElementById("targetDpiDisplay");

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

const fortniteNotice =
    document.getElementById("fortniteNotice");


// CM/360

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


// Compare

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


/*
==================================================
GET GAME
==================================================
*/

function getGame(
    select
) {

    return games[
        select.value
    ];

}


/*
==================================================
CM/360 FORMULA
==================================================

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
CONVERT
==================================================
*/

function convertSensitivity() {

    const source =
        getGame(sourceGame);

    const target =
        getGame(targetGame);


    const sensitivity =
        Number(
            sourceSensitivity.value
        );


    const dpi =
        Number(
            sourceDpi.value
        );


    /*
    Validate sensitivity
    */

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


    /*
    Validate DPI
    */

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


    /*
    IMPORTANT:

    We keep the same DPI.

    The physical sensitivity is preserved
    by changing only the target sensitivity.
    */

    const targetDpi =
        dpi;


    /*
    Calculate source CM/360
    */

    const sourceCm =
        calculateCm360(
            sensitivity,
            dpi,
            source.yaw
        );


    /*
    Calculate target sensitivity
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


    /*
    Calculate target CM/360
    */

    const targetCm =
        calculateCm360(
            targetSensitivity,
            targetDpi,
            target.yaw
        );


    /*
    eDPI
    */

    const sourceEDPI =
        sensitivity *
        dpi;


    const targetEDPI =
        targetSensitivity *
        targetDpi;


    /*
    Format target sensitivity
    */

    const formatted =
        formatSensitivity(
            targetSensitivity
        );


    /*
    Live result
    */

    convertedSensitivity.textContent =
        formatted;


    targetDpiDisplay.textContent =
        dpi + " DPI";


    /*
    Main result
    */

    resultGame.textContent =
        target.name;


    mainSensitivity.textContent =
        formatted;


    resultDpi.textContent =
        dpi + " DPI";


    /*
    Instruction
    */

    instructionText.textContent =
        `In ${target.name}, set your sensitivity to ${formatted} and keep your mouse DPI at ${dpi}. This gives you approximately ${sourceCm.toFixed(2)} cm/360°.`;



    /*
    Statistics
    */

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


    /*
    Fortnite warning
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
    Show result
    */

    results.classList.remove(
        "hidden"
    );


    /*
    Scroll to result
    */

    results.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/*
==================================================
CONVERSION BUTTON
==================================================
*/

convertButton.addEventListener(
    "click",
    convertSensitivity
);


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


        /*
        If a sensitivity already exists,
        automatically convert again.
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
COPY SETUP
==================================================
*/

copyButton.addEventListener(
    "click",
    async () => {

        const game =
            resultGame.textContent;

        const sens =
            mainSensitivity.textContent;

        const dpi =
            resultDpi.textContent;


        const text =
`FPS Sensitivity Converter

Game: ${game}
Sensitivity: ${sens}
DPI: ${dpi}

CM/360: ${targetCm360.textContent}`;


        try {

            await navigator.clipboard.writeText(
                text
            );


            copyButton.textContent =
                "✓ Copied";


            setTimeout(
                () => {

                    copyButton.textContent =
                        "📋 Copy setup";

                },
                1500
            );


        } catch {

            alert(
                "Could not copy the setup."
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
COMPARE
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


        /*
        Validation
        */

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
        CM/360
        */

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
        Result

        0.5% tolerance.
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
ENTER KEY
==================================================
*/

[
    sourceSensitivity,
    sourceDpi
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
