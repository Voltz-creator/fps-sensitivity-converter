/*
    FPS Sensitivity Converter V7

    Main formula:

    cm/360 =
        (360 × 2.54) /
        (DPI × sensitivity × yaw)

    Target sensitivity =
        (360 × 2.54) /
        (target DPI × cm/360 × target yaw)

    Equivalent:

    targetSens =
        sourceSens ×
        (sourceYaw / targetYaw) ×
        (sourceDPI / targetDPI)
*/


// ======================================================
// GAME DATABASE
// ======================================================

const GAMES = {

    valorant: {
        name: "VALORANT",
        yaw: 0.07,
        confidence: "high",
        scale: "decimal",
        path:
            "Settings → General → Mouse → Sensitivity"
    },


    cs2: {
        name: "Counter-Strike 2",
        yaw: 0.022,
        confidence: "high",
        scale: "decimal",
        path:
            "Settings → Keyboard / Mouse → Mouse Sensitivity"
    },


    apex: {
        name: "Apex Legends",
        yaw: 0.022,
        confidence: "high",
        scale: "decimal",
        path:
            "Settings → Mouse/Keyboard → Mouse Sensitivity"
    },


    overwatch: {
        name: "Overwatch 2",
        yaw: 0.0066,
        confidence: "high",
        scale: "decimal",
        path:
            "Options → Controls → Mouse → Sensitivity"
    },


    fortnite: {
        name: "Fortnite",
        yaw: 0.0055555556,
        confidence: "experimental",
        scale: "percentage",
        path:
            "Settings → Mouse and Keyboard → X-Axis / Y-Axis Sensitivity"
    },


    r6: {
        name: "Rainbow Six Siege",
        yaw: 0.00572958,
        confidence: "experimental",
        scale: "integer",
        path:
            "Options → Controls → Mouse Sensitivity"
    },


    cod: {
        name: "Call of Duty",
        yaw: 0.0066,
        confidence: "high",
        scale: "decimal",
        path:
            "Settings → Mouse → Sensitivity"
    }

};


// ======================================================
// DOM
// ======================================================

const sourceGame =
    document.getElementById("sourceGame");

const sourceSens =
    document.getElementById("sourceSens");

const sourceDpi =
    document.getElementById("sourceDpi");

const targetGame =
    document.getElementById("targetGame");

const targetDpi =
    document.getElementById("targetDpi");

const convertButton =
    document.getElementById("convertButton");

const swapButton =
    document.getElementById("swapButton");

const previewSens =
    document.getElementById("previewSens");

const errorMessage =
    document.getElementById("errorMessage");

const resultSection =
    document.getElementById("resultSection");

const resultGame =
    document.getElementById("resultGame");

const resultSens =
    document.getElementById("resultSens");

const resultDpi =
    document.getElementById("resultDpi");

const resultYaw =
    document.getElementById("resultYaw");

const sourceCm =
    document.getElementById("sourceCm");

const targetCm =
    document.getElementById("targetCm");

const sourceEdpi =
    document.getElementById("sourceEdpi");

const targetEdpi =
    document.getElementById("targetEdpi");

const instructionText =
    document.getElementById("instructionText");

const confidenceBox =
    document.getElementById("confidenceBox");

const confidenceText =
    document.getElementById("confidenceText");

const experimentalWarning =
    document.getElementById("experimentalWarning");


// ======================================================
// HELPERS
// ======================================================

function getGame(id) {

    return GAMES[id];

}


function formatNumber(
    value,
    decimals = 4
) {

    if (!Number.isFinite(value)) {
        return "—";
    }

    return Number(
        value.toFixed(decimals)
    ).toString();

}


// ======================================================
// CM/360
// ======================================================

function calculateCm360(
    gameId,
    sensitivity,
    dpi
) {

    const game =
        getGame(gameId);

    if (!game) {
        throw new Error(
            "Game not found."
        );
    }

    if (
        sensitivity <= 0 ||
        dpi <= 0
    ) {

        throw new Error(
            "Sensitivity and DPI must be greater than 0."
        );

    }

    return (
        360 * 2.54
    ) / (
        dpi *
        sensitivity *
        game.yaw
    );

}


// ======================================================
// CONVERSION
// ======================================================

function convertSensitivity(
    sourceId,
    sourceSensitivity,
    sourceDpiValue,
    targetId,
    targetDpiValue
) {

    const source =
        getGame(sourceId);

    const target =
        getGame(targetId);

    if (!source || !target) {

        throw new Error(
            "Invalid game."
        );

    }


    const cm360 =
        calculateCm360(
            sourceId,
            sourceSensitivity,
            sourceDpiValue
        );


    const targetSensitivity =
        (
            360 * 2.54
        ) / (
            targetDpiValue *
            cm360 *
            target.yaw
        );


    return {
        sensitivity:
            targetSensitivity,

        cm360:
            cm360
    };

}


// ======================================================
// VALIDATION
// ======================================================

function validateInputs() {

    errorMessage.textContent = "";

    const sens =
        Number(
            sourceSens.value
        );

    const sourceDpiValue =
        Number(
            sourceDpi.value
        );

    const targetDpiValue =
        Number(
            targetDpi.value
        );


    if (
        !Number.isFinite(sens) ||
        sens <= 0
    ) {

        errorMessage.textContent =
            "Please enter a valid sensitivity.";

        return false;

    }


    if (
        !Number.isFinite(
            sourceDpiValue
        ) ||
        sourceDpiValue <= 0
    ) {

        errorMessage.textContent =
            "Please enter a valid source DPI.";

        return false;

    }


    if (
        !Number.isFinite(
            targetDpiValue
        ) ||
        targetDpiValue <= 0
    ) {

        errorMessage.textContent =
            "Please enter a valid target DPI.";

        return false;

    }


    if (
        sourceGame.value ===
        targetGame.value
    ) {

        errorMessage.textContent =
            "Source and target games must be different.";

        return false;

    }


    return true;

}


// ======================================================
// PREVIEW
// ======================================================

function calculatePreview() {

    if (
        !sourceSens.value ||
        !sourceDpi.value ||
        !targetDpi.value
    ) {

        previewSens.textContent =
            "—";

        return null;

    }


    try {

        const result =
            convertSensitivity(
                sourceGame.value,
                Number(sourceSens.value),
                Number(sourceDpi.value),
                targetGame.value,
                Number(targetDpi.value)
            );


        previewSens.textContent =
            formatNumber(
                result.sensitivity,
                4
            );


        return result;

    } catch {

        previewSens.textContent =
            "—";

        return null;

    }

}


// ======================================================
// MAIN CONVERSION
// ======================================================

function performConversion() {

    if (!validateInputs()) {

        previewSens.textContent =
            "—";

        return null;

    }


    try {

        const sourceId =
            sourceGame.value;

        const targetId =
            targetGame.value;

        const sensitivity =
            Number(
                sourceSens.value
            );

        const sourceDpiValue =
            Number(
                sourceDpi.value
            );

        const targetDpiValue =
            Number(
                targetDpi.value
            );


        const result =
            convertSensitivity(
                sourceId,
                sensitivity,
                sourceDpiValue,
                targetId,
                targetDpiValue
            );


        previewSens.textContent =
            formatNumber(
                result.sensitivity,
                4
            );


        displayResult(
            sourceId,
            targetId,
            sensitivity,
            sourceDpiValue,
            targetDpiValue,
            result
        );


        return result;

    } catch (error) {

        errorMessage.textContent =
            error.message;

        return null;

    }

}


// ======================================================
// DISPLAY RESULT
// ======================================================

function displayResult(
    sourceId,
    targetId,
    sourceSensitivity,
    sourceDpiValue,
    targetDpiValue,
    result
) {

    const source =
        getGame(sourceId);

    const target =
        getGame(targetId);


    resultSection.classList.remove(
        "hidden"
    );


    resultGame.textContent =
        target.name;


    resultSens.textContent =
        formatNumber(
            result.sensitivity,
            4
        );


    resultDpi.textContent =
        `${formatNumber(
            targetDpiValue,
            0
        )} DPI`;


    resultYaw.textContent =
        target.yaw;


    sourceCm.textContent =
        `${formatNumber(
            result.cm360,
            2
        )} cm`;


    targetCm.textContent =
        `${formatNumber(
            result.cm360,
            2
        )} cm`;


    sourceEdpi.textContent =
        formatNumber(
            sourceSensitivity *
            sourceDpiValue,
            2
        );


    targetEdpi.textContent =
        formatNumber(
            result.sensitivity *
            targetDpiValue,
            2
        );


    document.getElementById(
        "sensPath"
    ).textContent =
        target.path;


    instructionText.textContent =
        `In ${target.name}, set your sensitivity to ${formatNumber(
            result.sensitivity,
            4
        )} and your mouse DPI to ${formatNumber(
            targetDpiValue,
            0
        )}. The calculated physical sensitivity is approximately ${formatNumber(
            result.cm360,
            2
        )} cm/360°.`;



    // ==============================================
    // CONFIDENCE
    // ==============================================

    if (
        source.confidence ===
        "experimental" ||

        target.confidence ===
        "experimental"
    ) {

        confidenceBox.className =
            "confidence experimental";


        confidenceBox.innerHTML =
            `
            🟡

            <strong>
                Experimental
            </strong>

            <span id="confidenceText">
                At least one game requires additional verification.
            </span>
            `;

    } else {

        confidenceBox.className =
            "confidence high";


        confidenceBox.innerHTML =
            `
            🟢

            <strong>
                High confidence
            </strong>

            <span id="confidenceText">
                The conversion uses established yaw values.
            </span>
            `;

    }



    // ==============================================
    // GAME WARNINGS
    // ==============================================

    experimentalWarning.classList.add(
        "hidden"
    );


    if (
        targetId === "fortnite"
    ) {

        experimentalWarning.classList.remove(
            "hidden"
        );

        experimentalWarning.textContent =
            "⚠️ Fortnite uses a percentage-based sensitivity scale. Verify the result physically in-game.";

    }


    if (
        targetId === "r6"
    ) {

        experimentalWarning.classList.remove(
            "hidden"
        );

        experimentalWarning.textContent =
            "⚠️ Rainbow Six Siege depends on its sensitivity configuration. This conversion assumes the standard/default multiplier.";

    }


    if (
        sourceId === "fortnite"
    ) {

        experimentalWarning.classList.remove(
            "hidden"
        );

        experimentalWarning.textContent =
            "⚠️ Fortnite uses a percentage-based sensitivity scale. Verify the result physically in-game.";

    }


    if (
        sourceId === "r6"
    ) {

        experimentalWarning.classList.remove(
            "hidden"
        );

        experimentalWarning.textContent =
            "⚠️ Rainbow Six Siege depends on its sensitivity configuration. This conversion assumes the standard/default multiplier.";

    }


    // ==============================================
    // SCROLL
    // ==============================================

    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ======================================================
// SWAP
// ======================================================

function swapGames() {

    const oldSource =
        sourceGame.value;

    const oldTarget =
        targetGame.value;


    const oldSourceDpi =
        sourceDpi.value;

    const oldTargetDpi =
        targetDpi.value;


    const currentResult =
        resultSens.textContent;


    sourceGame.value =
        oldTarget;

    targetGame.value =
        oldSource;


    sourceDpi.value =
        oldTargetDpi;

    targetDpi.value =
        oldSourceDpi;


    if (
        currentResult !== "—" &&
        currentResult !== ""
    ) {

        const numeric =
            Number(
                currentResult
            );

        if (
            Number.isFinite(numeric)
        ) {

            sourceSens.value =
                numeric;

        }

    }


    calculatePreview();

}


// ======================================================
// QUICK DPI
// ======================================================

document
    .querySelectorAll(
        "[data-dpi-source]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                sourceDpi.value =
                    button.dataset.dpiSource;

                calculatePreview();

            }
        );

    });


document
    .querySelectorAll(
        "[data-dpi-target]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                targetDpi.value =
                    button.dataset.dpiTarget;

                calculatePreview();

            }
        );

    });


// ======================================================
// BUTTONS
// ======================================================

convertButton.addEventListener(
    "click",
    performConversion
);


swapButton.addEventListener(
    "click",
    swapGames
);


// ======================================================
// ENTER
// ======================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            const active =
                document.activeElement;


            if (
                active.tagName ===
                    "INPUT" ||

                active.tagName ===
                    "SELECT"
            ) {

                performConversion();

            }

        }

    }
);


// ======================================================
// LIVE PREVIEW
// ======================================================

[
    sourceGame,
    sourceSens,
    sourceDpi,
    targetGame,
    targetDpi

].forEach(element => {

    element.addEventListener(
        "input",
        calculatePreview
    );

    element.addEventListener(
        "change",
        calculatePreview
    );

});


// ======================================================
// COPY SETTINGS
// ======================================================

document
    .getElementById(
        "copyButton"
    )
    .addEventListener(
        "click",
        async () => {

            const text =
`FPS Sensitivity Converter

Game: ${resultGame.textContent}
Sensitivity: ${resultSens.textContent}
DPI: ${resultDpi.textContent}
Yaw: ${resultYaw.textContent}
CM/360°: ${targetCm.textContent}

Use these settings in ${resultGame.textContent}.`;


            try {

                await navigator.clipboard.writeText(
                    text
                );


                const button =
                    document.getElementById(
                        "copyButton"
                    );


                const oldText =
                    button.textContent;


                button.textContent =
                    "✅ Copied!";


                setTimeout(
                    () => {

                        button.textContent =
                            oldText;

                    },
                    1500
                );

            } catch {

                alert(
                    "Could not copy the settings."
                );

            }

        }
    );


// ======================================================
// SHARE LINK
// ======================================================

document
    .getElementById(
        "shareButton"
    )
    .addEventListener(
        "click",
        () => {

            const result =
                calculatePreview();


            if (!result) {

                return;

            }


            const params =
                new URLSearchParams();


            params.set(
                "source",
                sourceGame.value
            );

            params.set(
                "sens",
                sourceSens.value
            );

            params.set(
                "sourceDpi",
                sourceDpi.value
            );

            params.set(
                "target",
                targetGame.value
            );

            params.set(
                "targetDpi",
                targetDpi.value
            );


            const url =
                `${window.location.origin}${window.location.pathname}?${params.toString()}`;


            document.getElementById(
                "shareUrl"
            ).value =
                url;


            document.getElementById(
                "shareBox"
            ).classList.remove(
                "hidden"
            );

        }
    );


// ======================================================
// COPY SHARE LINK
// ======================================================

document
    .getElementById(
        "copyLinkButton"
    )
    .addEventListener(
        "click",
        async () => {

            const url =
                document.getElementById(
                    "shareUrl"
                ).value;


            try {

                await navigator.clipboard.writeText(
                    url
                );


                const button =
                    document.getElementById(
                        "copyLinkButton"
                    );


                const oldText =
                    button.textContent;


                button.textContent =
                    "✅ Copied!";


                setTimeout(
                    () => {

                        button.textContent =
                            oldText;

                    },
                    1500
                );

            } catch {

                alert(
                    "Could not copy the link."
                );

            }

        }
    );


// ======================================================
// CM/360 CALCULATOR
// ======================================================

document
    .getElementById(
        "calculateCmButton"
    )
    .addEventListener(
        "click",
        () => {

            const gameId =
                document.getElementById(
                    "cmGame"
                ).value;


            const sensitivity =
                Number(
                    document.getElementById(
                        "cmSens"
                    ).value
                );


            const dpi =
                Number(
                    document.getElementById(
                        "cmDpi"
                    ).value
                );


            const resultBox =
                document.getElementById(
                    "cmResult"
                );


            const resultValue =
                document.getElementById(
                    "cmValue"
                );


            if (
                !Number.isFinite(
                    sensitivity
                ) ||
                sensitivity <= 0 ||

                !Number.isFinite(
                    dpi
                ) ||
                dpi <= 0
            ) {

                resultBox.classList.add(
                    "hidden"
                );

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
                    `${formatNumber(
                        cm,
                        2
                    )} cm`;


                resultBox.classList.remove(
                    "hidden"
                );

            } catch {

                resultBox.classList.add(
                    "hidden"
                );

            }

        }
    );


// ======================================================
// LOAD SHARED CONVERSION
// ======================================================

function loadSharedConversion() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    if (
        !params.has("source") ||
        !params.has("sens") ||
        !params.has("target")
    ) {

        return;

    }


    const source =
        params.get("source");

    const sens =
        params.get("sens");

    const sourceDpiValue =
        params.get("sourceDpi");

    const target =
        params.get("target");

    const targetDpiValue =
        params.get("targetDpi");


    if (
        !GAMES[source] ||
        !GAMES[target]
    ) {

        return;

    }


    sourceGame.value =
        source;

    sourceSens.value =
        sens;

    targetGame.value =
        target;


    if (sourceDpiValue) {

        sourceDpi.value =
            sourceDpiValue;

    }


    if (targetDpiValue) {

        targetDpi.value =
            targetDpiValue;

    }


    performConversion();

}


// ======================================================
// INITIALIZATION
// ======================================================

previewSens.textContent =
    "—";


loadSharedConversion();
