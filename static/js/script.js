document.addEventListener("DOMContentLoaded", function () {

    /* ========================================
       Screen References
    ======================================== */

    const splashScreen = document.querySelector(".splash-screen");
    const welcomeScreen = document.querySelector(".welcome-screen");
    const tutorialScreen = document.querySelector(".tutorial-screen");


    /* ========================================
       Welcome Screen Elements
    ======================================== */

    const languageButtons = document.querySelectorAll(
        ".welcome-language-btn"
    );

    const continueButton = document.querySelector(".continue-btn");


    /* ========================================
       Tutorial Elements
    ======================================== */

    const tutorialSteps = document.querySelectorAll(".tutorial-step");
    const progressDots = document.querySelectorAll(".progress-dot");

    const backButton = document.querySelector(".tutorial-back");
    const nextButton = document.querySelector(".tutorial-next");
    const skipButton = document.querySelector(".tutorial-skip");

    const stepCount = document.querySelector(
        ".tutorial-step-count span"
    );


    let currentStep = 0;


    /* ========================================
       Splash → Welcome
    ======================================== */

    setTimeout(function () {

        splashScreen.classList.add("splash-exit");

        setTimeout(function () {

            splashScreen.style.display = "none";
            welcomeScreen.classList.add("welcome-visible");

        }, 500);

    }, 2600);


    /* ========================================
       Language Selection
    ======================================== */

    languageButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            languageButtons.forEach(function (btn) {
                btn.classList.remove("selected");
            });

            button.classList.add("selected");

        });

    });


    /* ========================================
       Welcome → Tutorial
    ======================================== */

    continueButton.addEventListener("click", function () {

        welcomeScreen.style.display = "none";

        tutorialScreen.classList.add("tutorial-visible");

        currentStep = 0;

        updateTutorial();

    });


    /* ========================================
       Update Tutorial
    ======================================== */

    function updateTutorial() {

        tutorialSteps.forEach(function (step, index) {

            if (index === currentStep) {
                step.classList.add("active");
            } else {
                step.classList.remove("active");
            }

        });


        progressDots.forEach(function (dot, index) {

            if (index === currentStep) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }

        });


        stepCount.textContent = currentStep + 1;


        /* Back button */

        backButton.disabled = currentStep === 0;


        /* Last tutorial step */

        if (currentStep === tutorialSteps.length - 1) {

            nextButton.textContent = "Get Started";

        } else {

            nextButton.textContent = "Next";

        }

    }


    /* ========================================
       Next Button
    ======================================== */

    nextButton.addEventListener("click", function () {

        if (currentStep < tutorialSteps.length - 1) {

            currentStep++;

            updateTutorial();

        } else {

            /*
               Dashboard will be connected here
               after we build it.
            */

            console.log("Tutorial completed");

        }

    });


    /* ========================================
       Back Button
    ======================================== */

    backButton.addEventListener("click", function () {

        if (currentStep > 0) {

            currentStep--;

            updateTutorial();

        }

    });


    /* ========================================
       Skip Tutorial
    ======================================== */

    skipButton.addEventListener("click", function () {

        /*
           Dashboard will be connected here
           after we build it.
        */

        console.log("Tutorial skipped");

    });

});