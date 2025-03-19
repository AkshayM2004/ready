document.addEventListener("DOMContentLoaded", () => {
    if (!window.questions || !Array.isArray(window.questions) || window.questions.length === 0) {
        window.questions = JSON.parse(localStorage.getItem("savedQuestions")) || [];
    }

    console.log("Loaded questions:", window.questions);

    if (questions.length > 0) {
        generateQuestionPanel();
    }

    const toggleButton = document.getElementById("togglePanelBtn");
    const questionPanel = document.getElementById("questionPanel");

    questionPanel.style.display = "none";

    toggleButton.addEventListener("click", () => {
        if (questionPanel.style.display === "none") {
            questionPanel.style.display = "block";
            toggleButton.textContent = "Hide Questions";
        } else {
            questionPanel.style.display = "none";
            toggleButton.textContent = "Show Questions";
        }
    });
});

// Function to generate the question panel
function generateQuestionPanel() {
    const panel = document.getElementById("questionPanel");
    if (!panel) return;

    panel.innerHTML = ""; // Clear existing content

    const gridContainer = document.createElement("div");
    gridContainer.classList.add("question-grid");

    questions.forEach((_, index) => {
        const button = document.createElement("button");
        button.textContent = index + 1;
        button.classList.add("question-btn");

        if (index === currentQuestionIndex) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {
            currentQuestionIndex = index;
            showQuestion(currentQuestionIndex);
            updateQuestionPanel();
        });

        gridContainer.appendChild(button);
    });

    panel.appendChild(gridContainer);
    panel.style.display = "block";
}

// Function to update active question in the panel
function updateQuestionPanel() {
    const buttons = document.querySelectorAll(".question-btn");
    buttons.forEach((btn, idx) => {
        if (idx === currentQuestionIndex) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}



// Function to show a question
function showQuestion(index) {
    if (index >= questions.length) {
        showResults();
        return;
    }

    const questionData = questions[index];
    document.getElementById("question").textContent = questionData.question;

    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";

    questionData.options.forEach((option, i) => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.classList.add("answer-btn");

        if (questionData.selected === i) {
            btn.classList.add("selected");
        }

        btn.onclick = () => selectAnswer(i);
        answersDiv.appendChild(btn);
    });

    // Handle navigation buttons
    document.getElementById("prevBtn").style.display = index === 0 ? "none" : "inline-block";
    document.getElementById("nextBtn").style.display = index === questions.length - 1 ? "none" : "inline-block";  
    document.getElementById("submitBtn").style.display = index === questions.length - 1 ? "inline-block" : "none";

    updateQuestionPanel(); // Update question panel highlights
}

// Function to start the quiz
function startQuiz() {
    quizPaused = false;
    document.getElementById("pauseScreen").classList.add("hide");
    document.getElementById("quizContainer").classList.remove("hide");

    const panel = document.getElementById("questionPanel");
    if (panel) panel.style.display = "flex"; // Ensure panel is visible

    startTimer();
    showQuestion(currentQuestionIndex);
    generateQuestionPanel();
}
