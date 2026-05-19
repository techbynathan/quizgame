const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getDifficultySettings(level) {
    if (level === "medium") {
        return { attempts: 15 };
    } else if (level === "hard") {
        return { attempts: 10 };
    } else if (level === "insane") {
        return { attempts: 2 };
    }
}

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, answer => resolve(answer)));
}

async function selectDifficulty() {
    while (true) {
        const choice = (await askQuestion("Select difficulty (Medium, Hard, Insane): ")).toLowerCase();
        if (["medium", "hard", "insane"].includes(choice)) {
            return choice;
        } else {
            console.log("Invalid choice. Please enter 'medium', 'hard', or 'insane'.");
        }
    }
}

const defaultQuestions = [
    { question: "What is the capital of France?", choices: ["A) Prague", "B) Berlin", "C) Paris", "D) Madrid"], answer: "C" },
    { question: "Which number is even?", choices: ["A) 3", "B) 7", "C) 9", "D) 8"], answer: "D" },
    { question: "What does CPU stand for?", choices: ["A) Central Processing Unit", "B) Computer Personal Unit", "C) Central Program Utility", "D) Control Processing Unit"], answer: "A" },
    { question: "What is the most popular sport in the world?", choices: ["A) American Football", "B) Basketball", "C) Soccer", "D Baseball"], answer: "C" }
];

// The Following Function was created using the assistance of Google's Gemini AI
async function createCustomQuestions() {
    const customQuestions = [];
    console.log("\n--- Custom Question Creator ---");
    while (true) {
        const questionText = await askQuestion("Enter your question (or type 'done' to finish): ");
        if (questionText.toLowerCase() === 'done') {
            break;
        }
        const choiceA = await askQuestion("Choice A: ");
        const choiceB = await askQuestion("Choice B: ");
        const choiceC = await askQuestion("Choice C: ");
        const choiceD = await askQuestion("Choice D: ");
        const choices = [`A) ${choiceA}`, `B) ${choiceB}`, `C) ${choiceC}`, `D) ${choiceD}`];

        let answer = (await askQuestion("Enter correct choice (A, B, C, D): ")).toUpperCase();
        while (!['A', 'B', 'C', 'D'].includes(answer)) {
            answer = (await askQuestion("Invalid. Enter A, B, C, or D: ")).toUpperCase();
        }
        customQuestions.push({ question: questionText, choices, answer });
    }
    return customQuestions;
}
// End of Function that used Google's Gemini AI

async function selectQuestionSource() {
    while (true) {
        const sourceChoice = (await askQuestion("Use (D)efault or (C)ustom questions? ")).toLowerCase();
        if (sourceChoice === 'd' || sourceChoice === 'c') {
            return sourceChoice === 'd' ? "default" : "custom";
        }
        console.log("Invalid choice.");
    }
}

async function runQuizSession(questionList, startingAttempts) {
    let currentScore = 0;
    let attemptsLeft = startingAttempts;
    for (const q of questionList) {
        if (attemptsLeft <= 0) {
            console.log("\nOh no! You have run out of attempts.");
            break;
        }

        console.log("\n" + q.question);
        q.choices.forEach(choice => console.log(choice));

        let userAnswer = (await askQuestion("Enter A, B, C, or D: ")).toUpperCase();

        if (userAnswer === q.answer) {
            console.log("Correct!");
            currentScore += 1;
        } else {
            attemptsLeft -= 1;
            console.log(`Wrong! Correct answer: ${q.answer}. Attempts left: ${attemptsLeft}`);
        }
    }
    return currentScore;
}

async function main() {
    const source = await selectQuestionSource();
    const questionsToUse = source === "default" ? defaultQuestions : await createCustomQuestions();

    if (questionsToUse.length === 0) {
        console.log("No questions. Exiting.");
        rl.close();
        process.exit(0);
    }

    // Shuffle questions
    for (let i = questionsToUse.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questionsToUse[i], questionsToUse[j]] = [questionsToUse[j], questionsToUse[i]];
    }

    const difficulty = await selectDifficulty();
    const settings = getDifficultySettings(difficulty);

    const finalScore = await runQuizSession(questionsToUse, settings.attempts);

    console.log(`\nQuiz finished! Final score: ${finalScore}/${questionsToUse.length}`);

    rl.close();
}

main();
