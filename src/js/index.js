'use strict';

// === DOM-Elemente abrufen  ===
const scoreElement = document.getElementById('score-element');
const timerElement = document.getElementById('timer-element');
const questionElement = document.getElementById('question-element');
const answersElement = document.getElementById('answers-element');

const btnNext = document.getElementById('btn-next');

// === Quiz Variablen  ===
const QUESTION_TIME = 15;

let score = 0;
let currentQuestionIndex = 0;
let timerSeconds;
let timerInterval;

const quizData = [
    {
        question: 'Was ist das Ergebnis von 1 + 1?',
        answers : ['2', '3', '5', '11'],
        correctIndex: 0,
    },
    {
        question: 'Was ist das Englische Wort für Hallo?',
        answers : ['Ola', 'Bonjour', 'Tach', 'Hello'],
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
]

// === Timer-Funktionen  ===
const updateTimer = (timer) => {
    timerSeconds = timer;
    const interval = setInterval(() => {
        timerElement.textContent = timerSeconds;
    
        if(timerSeconds <= 0){
            clearInterval(interval);
            showQuestion();
        }
        timerSeconds--;
    }, 1000);  
};

const showAnswers = () => {
    let answersString = '';
      
    quizData[round].answers.forEach((answerText, index) => {
        answersString += `
            <li><button class="btn-answer" data-index="${index}">${answerText}</button></li>
        `;
    });

    answersElement.innerHTML = answersString;

    document.querySelectorAll('.btn-answer').forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedIndex = parseInt(event.target.dataset.index);
            const correct = quizData[round].correctIndex;

            if (selectedIndex === correct){
                console.log(`${selectedIndex} ✅ Richtige Antwort!`);
                console.log(`✅ Richtige Antwort! ${correct}`);
                score++;
                event.target.style.backgroundColor = "green";
            } else {
                console.log(`${selectedIndex} ❌ Falsche Antwort!`);
                console.log(`❌ Falsche Antwort! ${correct}`);
                event.target.style.backgroundColor = "red";
            }

            setTimeout(() => {
                showQuestion();
            },1000);
            console.log(`Round: ${round}`);
            round++;
        });
    });
};

const showQuestion = () => {
    
    if(round !== quizData.length - 1){
        questionElement.textContent = quizData[round].question;
        showAnswers();
        if (round === 0) {
            updateTimer(15);
        } else {
            updateTimer(16);
        }

    } else {
        console.log('Quiz vorbei');
    }
    
};

window.onload = () => {
    showQuestion();
};

// === Event-Binding ===
btnNext.addEventListener('click', updateTimer);
