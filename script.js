/* ==================================================
   FPS SENSITIVITY CONVERTER
   VERSION 4
================================================== */


/* ==================================================
   GAME DATABASE
================================================== */

const games = {

    valorant: {
        name: "VALORANT",
        yaw: 0.07,
        reliable: true,

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
                status: "Keep your DPI"
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
        reliable: true,

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
                status: "Keep your DPI"
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
        reliable: true,

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
                status: "Keep your DPI"
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
        reliable: true,

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
                status: "Keep your DPI"
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
        reliable: false,

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
                status: "Keep your DPI"
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

const swapButton =
    document.getElementById("swapButton");

const fortniteNotice =
    document.getElementById("fortniteNotice");

const copyMessage =
    document.getElementById("copyMessage");


/* CM calculator */

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

function getGame(gameId) {

    return games[gameId];

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
   UPDATE TARGET DPI
================================================== */

function updateTargetDpi() {

    const dpi =
        Number(
            sourceDpi.value
        );

    if (
        Number.isFinite(dpi) &&
        dpi > 0
    ) {

        targetDpiDisplay.textContent =
            dpi + " DPI";

    } else {

        targetDpiDisplay.textContent =
            "—";

    }

}


/* ==================================================
   CREATE SETTINGS LIST
================================================== */

function renderSettings(
    target,
    targetSensitivity,
    dpi
) {

    settingsList.innerHTML = "";


    target.settings.forEach(
        function (setting) {

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
                    dpi + " DPI";

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
   MAIN CONVERTER
================================================== */

function convertSensitivity() {

    const source =
        getGame(
            sourceGame.value
        );

    const target =
        getGame(
            targetGame.value
        );


    const sensitivity =
        Number(
            sourceSensitivity.value
        );

    const dpi =
        Number(
            sourceDpi.value
        );


    /* Validation */

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


    /* Target DPI */

    const targetDpi =
        dpi;


    /* Source CM/360 */

    const sourceCm =
        calculateCm360(
            sensitivity,
            dpi,
            source.yaw
        );


    /*
        Target sensitivity

        Same physical CM/360.
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


    /* Verify */

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


    /* Display */

    const formatted =
        formatSensitivity(
            targetSensitivity
        );


    convertedSensitivity.textContent =
        formatted;


    targetDpiDisplay.textContent =
        targetDpi + " DPI";


    resultGame.textContent =
        target.name;


    mainSensitivity.textContent =
        formatted;


    resultDpi.textContent =
        targetDpi + " DPI";


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


    /* Settings */

    renderSettings(
        target,
        targetSensitivity,
        targetDpi
    );


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


    /* Show */

    results.classList.remove(
        "hidden"
    );


    /* Scroll */

    setTimeout(
        function () {

            results.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        },
        50
    );

}


/* ==================================================
   SWAP
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


        if (
            sourceSensitivity.value.trim()
            !== ""
        ) {

            convertSensitivity();

        }

    }
);


/* ==================================================
   COPY SETTINGS
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


            copyMessage.classList.remove(
                "hidden"
            );


            setTimeout(
                function () {

                    copyMessage.classList.add(
                        "hidden"
                    );

                },
                2000
            );


        } catch (error) {

            console.error(
                error
            );

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
    function () {

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
   UPDATE DPI LIVE
================================================== */

sourceDpi.addEventListener(
    "input",
    updateTargetDpi
);


/* ==================================================
   ENTER KEY
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


/* ==================================================
   INITIALIZE
================================================== */

updateTargetDpi();
