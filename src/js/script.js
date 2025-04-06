'use strict';

// === DOM-Elemente abrufen  ===
const scoreElement = document.getElementById('score-element');
const timerElement = document.getElementById('timer-element');
const questionElement = document.getElementById('question-element');
const answersElement = document.getElementById('answers-element');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const feedbackElement = document.getElementById('feedback-element');
const btnRestart = document.getElementById('btn-restart');


// === Quiz Variablen  ===
const QUESTION_TIME = 15;

let score = 0;
let currentQuestionIndex = 0;
let timerSeconds;
let timerInterval;
// Erweiterte Quiz Variablen
let highScore = localStorage.getItem('highScore') || 0;
let selectedAnswerIndex = null;

const quizData = [
    {
        question: 'Was bedeutet das Wort Bokeh?',
        answers : ['Ästhetik der Unschärfe', 'Eine spezielle Form eines Buches', 'Eine andere Bezeichnung für Bockwurst', 'Bezeichnung eines Tieres'],
        correctIndex: 0,
    },
    {
        question: 'Was ist das Englische Wort für Hallo?',
        answers : ['Hola', 'Bonjour', 'Tach', 'Hello'],
        correctIndex: 3,
    },
    {
        question: 'Was ist ein Dackel?',
        answers : ['Ein Vogel', 'Ein Hund', 'Ein Fisch', 'Eine Katze'],
        correctIndex: 1,
    },
    {
        question: 'Was ist eine Braunelle?',
        answers : ['Ein Farbton', 'Eine unterart von Garzelle', 'Eine Pflanzenart', 'Ein Gebäck'],
        correctIndex: 2,
    },
    {
        question: 'Was ist die Hauptstadt von Deutschland',
        answers : ['Amsterdam', 'Berlin', 'Düsseldorf', 'Paris'],
        correctIndex: 1,
    },
];

// === Frage darstellen ===
const showQuestion = () => {
    clearInterval(timerInterval);

    const currentQuestion = quizData[currentQuestionIndex];

    // Progress aktualisieren
    progressBar.style.width = `${((currentQuestionIndex + 1) / quizData.length) * 100}%`;
    progressText.textContent = `Frage ${currentQuestionIndex + 1}/${quizData.length}`;


   // Antworten mit erweitertem HTML
    questionElement.textContent = currentQuestion.question;
    answersElement.innerHTML = currentQuestion.answers
    .map((answer, index) => `
        <button class="btn-answer" data-index="${index}"
        ${selectedAnswerIndex !== null ? 'disabled' : ''}>
            
            ${answer}
        </button>
    `).join('');

    // Event-Listener für Antworten mit erweiterten Features
    document.querySelectorAll('.btn-answer').forEach(button => {
        button.addEventListener('click', (e) => {
            if (selectedAnswerIndex !== null) return;

            selectedAnswerIndex = parseInt(e.target.dataset.index);
            const correctIndex = currentQuestion.correctIndex;

            // UI Updates
            button.classList.add(selectedAnswerIndex === correctIndex ? 'correct' : 'wrong');
            if(selectedAnswerIndex !== correctIndex) {
                document.querySelector(`.btn-answer[data-index="${correctIndex}"]`).classList.add('correct');
            }

            // Punktevergabe
            if(selectedAnswerIndex === correctIndex) {
                score++;
                scoreElement.textContent = score;
            }

            // Feedback anzeigen
            showFeedback(selectedAnswerIndex === correctIndex);

            // Nächste Frage nach Verzögerung
            setTimeout(() => {
                currentQuestionIndex++;
                selectedAnswerIndex = null; // Reset für nächste Frage
                if( currentQuestionIndex <quizData.length) {
                    showQuestion();
                } else {
                    endQuiz();
                }
            }, 2000);
        });
    });

    startTimer();
};

// Neue Feedback Funktion
const showFeedback = (isCorrect) => {
    feedbackElement.innerHTML = `
        <h3>${isCorrect ? '✅ Richtig!' : '❌ Falsch!'}</h3>
        <p>
            ${isCorrect ? 'Gut gemacht!' : 
            `Richtig wäre: ${quizData[currentQuestionIndex].answers[quizData[currentQuestionIndex].correctIndex]}`}
        </p>
    `;
    feedbackElement.style.backgroundColor = isCorrect ? 'var(--correct-color)' : 'var(--wrong-color)';
};

// === Antwortverarbeitung ===
const handleAnswer = (selectedIndex) => {
    clearInterval(timerInterval);
    const correctIndex = quizData[currentQuestionIndex].correctIndex;

    if(selectedIndex === correctIndex){
        score++;
        scoreElement.textContent = score;
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if(currentQuestionIndex < quizData.length) {
            showQuestion();
        } else {
            endQuiz();
        }
    }, 1000);
};

// === Timer-Funktionen  ===
const startTimer = () => {
    clearInterval(timerInterval);
    timerSeconds = QUESTION_TIME;
    timerElement.textContent = timerSeconds;

    timerInterval = setInterval(() => {
        timerSeconds--;
        timerElement.textContent = timerSeconds;

        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            handleAnswer(-1);
        }
    }, 1000);
};

// === Quiz beenden ===
const endQuiz = () => {
    clearInterval(timerInterval);

    questionElement.innerHTML = `
        <h2>Quiz beendet! 🎉</h2>
        <p>Erreichte Punkte: ${score}/${quizData.length}</p>
        ${score > highScore ? '<p class="highscore">🏆 Neuer Highscore! 🏆</p>' : ''}
    `;

    if (score >= highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }

    answersElement.innerHTML = '';
    feedbackElement.innerHTML = '';
    feedbackElement.style.backgroundColor = 'transparent';
    timerElement.textContent = '0';
    btnRestart.classList.remove('hidden');
};

btnRestart.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswerIndex = null;
    scoreElement.textContent = '0';
    feedbackElement.innerHTML = '';
    btnRestart.classList.add('hidden');
    showQuestion();
});

// === Initialisierung ===
btnRestart.classList.add('hidden'); // Initial verstecken

document.addEventListener('DOMContentLoaded', () => {
    btnRestart.classList.add('hidden');
    showQuestion();
});