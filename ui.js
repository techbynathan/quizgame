// Default Questions
const defaultQuestions = [
    { question: "What is the capital of France?", choices: ["A) Prague", "B) Berlin", "C) Paris", "D) Madrid"], answer: "C" },
    { question: "Which number is even?", choices: ["A) 3", "B) 7", "C) 9", "D) 8"], answer: "D" },
    { question: "What does CPU stand for?", choices: ["A) Central Processing Unit", "B) Computer Personal Unit", "C) Central Program Utility", "D) Control Processing Unit"], answer: "A" },
    { question: "What is the most popular sport in the world?", choices: ["A) American Football", "B) Basketball", "C) Soccer", "D) Baseball"], answer: "C" }
];

// Game State
let gameState = {
    currentQuestionIndex: 0,
    score: 0,
    attemptsLeft: 0,
    questionList: [],
    difficulty: 'medium',
    customQuestions: []
};

// Difficulty Settings
const difficultySettings = {
    medium: { attempts: 15 },
    hard: { attempts: 10 },
    insane: { attempts: 2 }
};

// DOM Elements
const settingsSection = document.getElementById('settingsSection');
const customQuestionsSection = document.getElementById('customQuestionsSection');
const quizSection = document.getElementById('quizSection');
const completeSection = document.getElementById('completeSection');

const sourceSelect = document.getElementById('sourceSelect');
const difficultySelect = document.getElementById('difficultySelect');
const startBtn = document.getElementById('startBtn');
const finishCustomBtn = document.getElementById('finishCustomBtn');
const restartBtn = document.getElementById('restartBtn');

const answerInput = document.getElementById('answerInput');
const submitAnswerBtn = document.getElementById('submitAnswerBtn');
const feedbackMessage = document.getElementById('feedbackMessage');

// Event Listeners
sourceSelect.addEventListener('change', handleSourceChange);
startBtn.addEventListener('click', handleStartClick);
finishCustomBtn.addEventListener('click', handleFinishCustomClick);
submitAnswerBtn.addEventListener('click', handleSubmitAnswer);
restartBtn.addEventListener('click', resetGame);
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSubmitAnswer();
});

// Handle source selection change
function handleSourceChange() {
    if (sourceSelect.value === 'custom') {
        settingsSection.style.display = 'none';
        customQuestionsSection.style.display = 'block';
    } else {
        settingsSection.style.display = 'block';
        customQuestionsSection.style.display = 'none';
    }
}

// Handle start button click
function handleStartClick() {
    gameState.difficulty = difficultySelect.value;
    gameState.questionList = [...defaultQuestions];
    shuffleQuestions(gameState.questionList);
    startQuiz();
}

// Handle finish custom questions click
function handleFinishCustomClick() {
    if (gameState.customQuestions.length === 0) {
        alert('Please add at least one question before starting!');
        return;
    }
    gameState.difficulty = difficultySelect.value;
    gameState.questionList = [...gameState.customQuestions];
    shuffleQuestions(gameState.questionList);
    startQuiz();
}

// Add custom question
function addCustomQuestion() {
    const questionText = document.getElementById('questionInput').value.trim();
    const choiceA = document.getElementById('choiceAInput').value.trim();
    const choiceB = document.getElementById('choiceBInput').value.trim();
    const choiceC = document.getElementById('choiceCInput').value.trim();
    const choiceD = document.getElementById('choiceDInput').value.trim();
    const correctAnswer = document.getElementById('correctAnswerSelect').value;

    if (!questionText || !choiceA || !choiceB || !choiceC || !choiceD || !correctAnswer) {
        alert('Please fill in all fields!');
        return;
    }

    const newQuestion = {
        question: questionText,
        choices: [`A) ${choiceA}`, `B) ${choiceB}`, `C) ${choiceC}`, `D) ${choiceD}`],
        answer: correctAnswer
    };

    gameState.customQuestions.push(newQuestion);
    displayCustomQuestions();
    clearCustomForm();
}

// Clear custom question form
function clearCustomForm() {
    document.getElementById('questionInput').value = '';
    document.getElementById('choiceAInput').value = '';
    document.getElementById('choiceBInput').value = '';
    document.getElementById('choiceCInput').value = '';
    document.getElementById('choiceDInput').value = '';
    document.getElementById('correctAnswerSelect').value = '';
}

// Display custom questions
function displayCustomQuestions() {
    const listContainer = document.getElementById('customQuestionsList');
    listContainer.innerHTML = '';

    gameState.customQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'custom-question-item';
        questionDiv.innerHTML = `
            <strong>Question ${index + 1}:</strong> ${q.question}<br>
            <small>Correct Answer: ${q.answer}</small>
            <button onclick="removeCustomQuestion(${index})" style="margin-top: 8px; padding: 5px 10px; background: #d62828; color: white; border: none; border-radius: 4px; cursor: pointer;">Remove</button>
        `;
        listContainer.appendChild(questionDiv);
    });
}

// Remove custom question
function removeCustomQuestion(index) {
    gameState.customQuestions.splice(index, 1);
    displayCustomQuestions();
}

// Add event listener to add question button
document.getElementById('addQuestionBtn').addEventListener('click', addCustomQuestion);

// Shuffle questions
function shuffleQuestions(questions) {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}

// Start the quiz
function startQuiz() {
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.attemptsLeft = difficultySettings[gameState.difficulty].attempts;

    settingsSection.style.display = 'none';
    customQuestionsSection.style.display = 'none';
    quizSection.style.display = 'block';
    completeSection.style.display = 'none';

    document.getElementById('totalQuestions').textContent = gameState.questionList.length;
    displayQuestion();
}

// Display current question
function displayQuestion() {
    if (gameState.currentQuestionIndex >= gameState.questionList.length || gameState.attemptsLeft <= 0) {
        endQuiz();
        return;
    }

    const currentQuestion = gameState.questionList[gameState.currentQuestionIndex];
    document.getElementById('questionNumber').textContent = gameState.currentQuestionIndex + 1;
    document.getElementById('questionText').textContent = currentQuestion.question;
    document.getElementById('currentScore').textContent = gameState.score;
    document.getElementById('attemptsLeft').textContent = gameState.attemptsLeft;

    const choicesContainer = document.getElementById('choicesContainer');
    choicesContainer.innerHTML = '';

    currentQuestion.choices.forEach(choice => {
        const choiceDiv = document.createElement('div');
        choiceDiv.className = 'choice';
        choiceDiv.textContent = choice;
        choiceDiv.addEventListener('click', () => {
            answerInput.value = choice.split(')')[0].trim();
        });
        choicesContainer.appendChild(choiceDiv);
    });

    answerInput.value = '';
    feedbackMessage.textContent = '';
    feedbackMessage.className = 'feedback-message';
    answerInput.focus();
}

// Handle answer submission
function handleSubmitAnswer() {
    const userAnswer = answerInput.value.toUpperCase().trim();

    if (!['A', 'B', 'C', 'D'].includes(userAnswer)) {
        feedbackMessage.textContent = 'Please enter A, B, C, or D';
        feedbackMessage.className = 'feedback-message incorrect';
        return;
    }

    const currentQuestion = gameState.questionList[gameState.currentQuestionIndex];

    if (userAnswer === currentQuestion.answer) {
        feedbackMessage.textContent = '✓ Correct!';
        feedbackMessage.className = 'feedback-message correct';
        gameState.score += 1;
    } else {
        gameState.attemptsLeft -= 1;
        feedbackMessage.textContent = `✗ Wrong! Correct answer: ${currentQuestion.answer}. Attempts left: ${gameState.attemptsLeft}`;
        feedbackMessage.className = 'feedback-message incorrect';
    }

    gameState.currentQuestionIndex += 1;
    setTimeout(() => {
        if (gameState.attemptsLeft > 0 && gameState.currentQuestionIndex < gameState.questionList.length) {
            displayQuestion();
        } else {
            endQuiz();
        }
    }, 1500);
}

// End the quiz
function endQuiz() {
    quizSection.style.display = 'none';
    completeSection.style.display = 'block';

    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('finalTotal').textContent = gameState.questionList.length;

    const percentage = Math.round((gameState.score / gameState.questionList.length) * 100);
    document.getElementById('scorePercentage').textContent = `${percentage}%`;
}

// Reset game
function resetGame() {
    gameState = {
        currentQuestionIndex: 0,
        score: 0,
        attemptsLeft: 0,
        questionList: [],
        difficulty: 'medium',
        customQuestions: []
    };

    settingsSection.style.display = 'block';
    customQuestionsSection.style.display = 'none';
    quizSection.style.display = 'none';
    completeSection.style.display = 'none';
    sourceSelect.value = 'default';
}