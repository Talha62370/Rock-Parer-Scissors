
// --- DOM ELEMENTS ---
const initialView = document.getElementById('initial-view');
const resultView = document.getElementById('result-view');
const hurrayView = document.getElementById('hurray-view');
const gameChoicesBtns = document.querySelectorAll('.initial-view .choice[data-choice]');

const rulesBtn = document.getElementById('rules-btn');
const rulesPopup = document.getElementById('rules-popup');
const closeRulesBtn = document.getElementById('close-rules');
const nextBtn = document.getElementById('next-btn');

const computerScoreDisplay = document.getElementById('computer-score');
const yourScoreDisplay = document.getElementById('your-score');

const resultMessage = document.getElementById('result-message');
const resultAgainstPC = document.getElementById('result-against-pc');
const actionButton = document.getElementById('action-button');
const playerPickDisplay = document.getElementById('player-pick-display');
const pcPickDisplay = document.getElementById('pc-pick-display');
const playerPickContainer = document.getElementById('player-pick-container');
const pcPickContainer = document.getElementById('pc-pick-container');

// --- GAME STATE/SCORES ---
let scores = {
    player: parseInt(localStorage.getItem('yourScore') || '0', 10),
    computer: parseInt(localStorage.getItem('computerScore') || '0', 10)
};

function updateScoreDisplay() {
    yourScoreDisplay.textContent = scores.player;
    computerScoreDisplay.textContent = scores.computer;
}
updateScoreDisplay();

function saveScores() {
    localStorage.setItem('yourScore', scores.player);
    localStorage.setItem('computerScore', scores.computer);
}

// --- CORE GAME LOGIC ---
const choices = ['rock', 'paper', 'scissors'];

function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}

function determineWinner(playerChoice, pcChoice) {
    if (playerChoice === pcChoice) return 'TIE';
    if (
        (playerChoice === 'rock' && pcChoice === 'scissors') ||
        (playerChoice === 'paper' && pcChoice === 'rock') ||
        (playerChoice === 'scissors' && pcChoice === 'paper')
    ) {
        return 'WIN';
    }
    return 'LOSE';
}

// Helper to create the choice HTML structure for the result view
const createChoiceElement = (choice) => {
    const el = document.createElement('div');
    el.classList.add('choice');
    el.classList.add(`${choice}-btn`);
    
    const img = document.createElement('img');
    img.src = handImages[choice];
    img.alt = choice;
    img.classList.add('hand-icon');
    
    el.appendChild(img);
    return el;
};

function displayChoicesInResult(playerChoice, pcChoice, result) {
    playerPickDisplay.innerHTML = '';
    pcPickDisplay.innerHTML = '';
    
    playerPickContainer.classList.remove('winner');
    pcPickContainer.classList.remove('winner');
    
    playerPickDisplay.appendChild(createChoiceElement(playerChoice));
    pcPickDisplay.appendChild(createChoiceElement(pcChoice));
    
    // Add glow based on who won
    if (result === 'WIN') {
        playerPickContainer.classList.add('winner');
    } else if (result === 'LOSE') {
        pcPickContainer.classList.add('winner');
    }
}

function updateScoreAndUI(result, playerChoice, pcChoice) {
    if (result === 'WIN') scores.player++;
    else if (result === 'LOSE') scores.computer++;
    
    saveScores();
    updateScoreDisplay();
    
    nextBtn.classList.add('hidden');
    
    if (result === 'WIN') {
        resultMessage.textContent = 'YOU WIN';
        resultAgainstPC.textContent = 'AGAINST PC';
        actionButton.textContent = 'PLAY AGAIN';
        nextBtn.classList.remove('hidden'); 
    } else if (result === 'LOSE') {
        resultMessage.textContent = 'YOU LOST';
        resultAgainstPC.textContent = 'AGAINST PC';
        actionButton.textContent = 'PLAY AGAIN';
    } else {
        resultMessage.textContent = 'TIE UP';
        resultAgainstPC.textContent = ''; 
        actionButton.textContent = 'REPLAY';
    }
    
    displayChoicesInResult(playerChoice, pcChoice, result);
    
    initialView.classList.add('hidden');
    resultView.classList.remove('hidden');
}

function showHurrayScreen() {
    resultView.classList.add('hidden');
    nextBtn.classList.add('hidden');
    document.querySelector('.score-board').classList.add('hidden'); 
    
    hurrayView.classList.remove('hidden');
}

function resetToInitialView() {
    resultView.classList.add('hidden');
    hurrayView.classList.add('hidden');
    nextBtn.classList.add('hidden');
    
    document.querySelector('.score-board').classList.remove('hidden');
    initialView.classList.remove('hidden');
}

// --- EVENT LISTENERS ---
gameChoicesBtns.forEach(button => {
    button.addEventListener('click', (e) => {
        const playerChoice = e.currentTarget.dataset.choice;
        const pcChoice = getComputerChoice();
        const result = determineWinner(playerChoice, pcChoice);
        updateScoreAndUI(result, playerChoice, pcChoice);
    });
});

rulesBtn.addEventListener('click', () => rulesPopup.classList.remove('hidden'));
closeRulesBtn.addEventListener('click', () => rulesPopup.classList.add('hidden'));

nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showHurrayScreen();
});

document.getElementById('hurray-play-again').addEventListener('click', (e) => {
    e.preventDefault();
    resetToInitialView();
});

actionButton.addEventListener('click', () => resetToInitialView());

// Load images into the initial view on startup
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('rock-icon').src = handImages.rock;
    document.getElementById('paper-icon').src = handImages.paper;
    document.getElementById('scissors-icon').src = handImages.scissors;
});