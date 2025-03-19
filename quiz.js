const questions = [
    { 
        question: "What is the capital of France?", 
        options: ["Berlin", "Paris", "Madrid", "Rome"], 
        answer: 1, 
        selected: null, 
        image: "images/image3blue.png"
    },
    { 
        question: "Which is the largest planet in the Solar System?", 
        options: ["Earth", "Mars", "Jupiter", "Saturn"], 
        answer: 2, 
        selected: null, 
        image: "C:\Users\aksha\Downloads\today geo\geomitra\image3blue.png"
    },
    { question: "What is the capital of France?", options: ["Berlin", "Paris", "Madrid", "Rome"], answer: 1, selected: null },
    { question: "Which is the largest planet in the Solar System?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: 2, selected: null },
    { question: "What is 5 + 7?", options: ["10", "11", "12", "13"], answer: 2, selected: null },
    { question: "What is the square root of 64?", options: ["6", "7", "8", "9"], answer: 2, selected: null },
    { question: "Who developed the theory of relativity?", options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"], answer: 1, selected: null },
    { question: "Which element has the chemical symbol 'O'?", options: ["Oxygen", "Gold", "Silver", "Iron"], answer: 0, selected: null },
    { question: "What is the boiling point of water in Celsius?", options: ["90", "100", "110", "120"], answer: 1, selected: null },
    { question: "Which country is famous for the Great Wall?", options: ["India", "China", "Russia", "Japan"], answer: 1, selected: null },
    { question: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: 2, selected: null },
    { question: "Which is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: 1, selected: null },
    { question: "How many continents are there?", options: ["5", "6", "7", "8"], answer: 2, selected: null },
    { question: "Who painted the Mona Lisa?", options: ["Vincent Van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"], answer: 2, selected: null },
    { question: "What is the smallest unit of matter?", options: ["Molecule", "Atom", "Proton", "Electron"], answer: 1, selected: null },
    { question: "Which ocean is the largest?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3, selected: null },
    { question: "How many legs does a spider have?", options: ["4", "6", "8", "10"], answer: 2, selected: null },
    { question: "What is the capital of Japan?", options: ["Seoul", "Beijing", "Bangkok", "Tokyo"], answer: 3, selected: null },
    { question: "Which organ pumps blood throughout the body?", options: ["Liver", "Brain", "Heart", "Lungs"], answer: 2, selected: null },
    { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Neptune"], answer: 1, selected: null },
    { question: "How many colors are in a rainbow?", options: ["5", "6", "7", "8"], answer: 2, selected: null },
    { question: "What is the largest mammal in the world?", options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], answer: 1, selected: null },
    { question: "Who discovered gravity?", options: ["Galileo Galilei", "Isaac Newton", "Albert Einstein", "Marie Curie"], answer: 1, selected: null },
    { question: "Which gas do humans breathe in for survival?", options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Hydrogen"], answer: 1, selected: null },
    { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"], answer: 1, selected: null }
];

let currentQuestionIndex = 0;
let timeLeft = 60;
let interval;
let quizPaused = false;
const resumePassword = "1234";

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("quizStarted")) {
        window.location.href = "quiz.html";
        return;
    }

    localStorage.setItem("savedQuestions", JSON.stringify(questions));

    const savedQuestions = localStorage.getItem("savedQuestions");
    if (savedQuestions) {
        try {
            const parsedQuestions = JSON.parse(savedQuestions);
            if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
                questions.length = 0;
                questions.push(...parsedQuestions);
            }
        } catch (e) {
            console.error("Error parsing saved questions", e);
            localStorage.setItem("savedQuestions", JSON.stringify(questions));
        }
    }

    const savedAnswers = localStorage.getItem("selectedAnswers");
    if (savedAnswers) {
        const storedAnswers = JSON.parse(savedAnswers);
        storedAnswers.forEach((q, index) => {
            if (questions[index]) {
                questions[index].selected = q.selected;
            }
        });
    }

    currentQuestionIndex = localStorage.getItem("currentQuestionIndex")
        ? parseInt(localStorage.getItem("currentQuestionIndex"))
        : 0;

    showQuestion(currentQuestionIndex);
    document.getElementById("resumeBtn").addEventListener("click", resumeQuiz);
    document.getElementById("submitBtn").addEventListener("click", submitQuiz);

    startQuiz();
});

function startQuiz() {
    quizPaused = false;
    document.getElementById("pauseScreen").classList.add("hide");
    document.getElementById("quizContainer").classList.remove("hide");
    document.getElementById("togglePanelBtn").style.display = "block";
    startTimer();
    showQuestion(currentQuestionIndex);
}

document.addEventListener("visibilitychange", function () {
    if (document.hidden && !quizSubmitting) {
        alert("You switched tabs! Quiz paused. Enter password to resume.");
        pauseQuiz();
    }
});

function pauseQuiz() {
    quizPaused = true;
    localStorage.setItem("quizPaused", "true");
    document.getElementById("quizContainer").classList.add("hide");
    document.getElementById("pauseScreen").classList.remove("hide");
    document.getElementById("navigation").style.display = "none";
    document.getElementById("togglePanelBtn").style.display = "none";
    clearInterval(interval);
}

function resumeQuiz() {
    let enteredPassword = document.getElementById("resumePassword").value;
    if (enteredPassword === resumePassword) {
        quizPaused = false;
        localStorage.removeItem("quizPaused");
        document.getElementById("pauseScreen").classList.add("hide");
        document.getElementById("quizContainer").classList.remove("hide");
        document.getElementById("navigation").style.display = "block";
        document.getElementById("togglePanelBtn").style.display = "block";
        document.getElementById("errorMessage").textContent = "";
        startTimer();
        showQuestion(currentQuestionIndex);
    } else {
        document.getElementById("errorMessage").textContent = "Incorrect password!";
    }
}

function showQuestion(index) {
    if (index >= questions.length) {
        submitQuiz();
        return;
    }
    document.getElementById("nextBtn").style.display = index === questions.length - 1 ? "none" : "inline-block";


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

        btn.onclick = () => {
            selectAnswer(i);
        };

        answersDiv.appendChild(btn);
    });

    localStorage.setItem("currentQuestionIndex", index);
    document.getElementById("prevBtn").style.display = index === 0 ? "none" : "inline-block";
    document.getElementById("nextBtn").style.display = "inline-block";
    document.getElementById("submitBtn").style.display = "none";

    checkIfAllAnswered();
}

function selectAnswer(selectedIndex) {
    questions[currentQuestionIndex].selected = selectedIndex;
    localStorage.setItem("selectedAnswers", JSON.stringify(questions));
    showQuestion(currentQuestionIndex);
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
}

function checkIfAllAnswered() {
    const allAnswered = questions.every(q => q.selected !== null);
    if (allAnswered) {
        document.getElementById("nextBtn").style.display = "none";
        document.getElementById("prevBtn").style.display = "none";
        document.getElementById("submitBtn").style.display = "inline-block";
    }
}

function startTimer() {
    clearInterval(interval);
    timeLeft = localStorage.getItem("timeLeft") ? parseInt(localStorage.getItem("timeLeft")) : 7200; // 2 hours = 7200 seconds

    interval = setInterval(() => {
        if (!quizPaused) {
            let hours = Math.floor(timeLeft / 3600);
            let minutes = Math.floor((timeLeft % 3600) / 60);
            let seconds = timeLeft % 60;

            document.getElementById("timer").textContent = `Time Left: ${hours}h ${minutes}m ${seconds}s`;

            localStorage.setItem("timeLeft", timeLeft);
            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(interval);
                alert("Time's up! Submitting quiz...");
                submitQuiz();
            }
        }
    }, 1000);
}


let quizSubmitting = false; // New flag to track quiz submission

function submitQuiz() {
    quizSubmitting = true; // Set flag to true before redirecting

    const unanswered = questions.filter(q => q.selected === null).length;
    if (unanswered > 0) {
        alert(`You have ${unanswered} unanswered questions!`);
        quizSubmitting = false; // Reset flag if user cancels submission
        return;
    }

    if (confirm("Are you sure you want to submit the quiz?")) {
        clearInterval(interval);
        const finalScore = calculateScore();
        localStorage.setItem("finalScore", finalScore);
        localStorage.setItem("totalQuestions", questions.length);
        localStorage.setItem("quizCompleted", "true");
        localStorage.removeItem("timeLeft");

        window.location.href = "enable-internet.html"; // Redirect to enable-internet page
    } else {
        quizSubmitting = false; // Reset flag if user cancels submission
    }
}

document.addEventListener("visibilitychange", function () {
    if (document.hidden && !quizSubmitting) { // Only trigger alert if not submitting
        alert("You switched tabs! Quiz paused. Enter password to resume.");
        pauseQuiz();
    }
});

function calculateScore() {
    return questions.reduce((score, q) => (q.selected === q.answer ? score + 1 : score), 0);
}  
function detectSplitScreen() {
    let originalAspectRatio = window.innerWidth / window.innerHeight;

    setInterval(() => {
        let currentAspectRatio = window.innerWidth / window.innerHeight;

        // Detect split-screen if aspect ratio changes significantly OR window size reduces below 75%
        if (
            (Math.abs(currentAspectRatio - originalAspectRatio) > 0.3) || 
            (window.innerWidth < screen.width * 0.75 && window.innerHeight < screen.height * 0.75)
        ) {
            if (!quizPaused) {
                alert("Split screen or multi-window mode detected! Quiz paused. Enter password to resume.");
                pauseQuiz();
            }
        }
    }, 1000); // Check every second
}

// Call this function when the quiz starts
detectSplitScreen();




