

const API_URL = 'https://baconipsum.com/api/?type=meat-and-filler'; 

let startTime, timerInterval, typingTime = 60; 
const randomTextElement = document.getElementById('random-text');
const typingArea = document.getElementById('typing-area');
const startBtn = document.getElementById('start-btn');
const showResultsBtn = document.getElementById('show-results-btn');
const timeValue = document.getElementById('time-value');
const wpmValue = document.getElementById('wpm-value');
const accuracyValue = document.getElementById('accuracy-value');
const typingTimerValue = document.getElementById('typing-timer-value');
const feedback = document.getElementById('feedback');
const progressBar = document.getElementById('progress-bar');

async function fetchRandomText() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data[0]; 
    } catch (error) {
        console.error('Fetch error:', error);
        return 'Error fetching text.';
    }
}

function resetTimer() {
    typingTimerValue.textContent = typingTime;
}

function startTimer() {
    let timeRemaining = typingTime;
    timerInterval = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            endTest();
        } else {
            timeRemaining--;
            typingTimerValue.textContent = timeRemaining;
            updateProgressBar();
        }
    }, 1000);
}

function updateProgressBar() {
    const progressPercentage = ((typingTime - typingTimerValue.textContent) / typingTime) * 100;
    progressBar.style.width = progressPercentage + '%';
}

function endTest() {
    typingArea.disabled = true;
    showResultsBtn.disabled = false;
    clearInterval(timerInterval);
    calculateResults();
}

function calculateResults() {
    const typedText = typingArea.value.trim();
    const totalTime = typingTime;
    const wordsTyped = typedText.split(' ').filter(word => word).length; 
    const wpm = Math.floor((wordsTyped / totalTime) * 60);
    const accuracy = Math.round((typedText.length / randomTextElement.textContent.length) * 100);

    timeValue.textContent = totalTime;
    wpmValue.textContent = wpm;
    accuracyValue.textContent = accuracy + '%';
    feedback.textContent = `You typed ${wordsTyped} words with ${accuracy}% accuracy.`;
}

startBtn.addEventListener('click', async () => {
    randomTextElement.textContent = await fetchRandomText(); 
    typingArea.disabled = false;
    typingArea.value = '';
    typingArea.focus();
    resetTimer();
    startTimer();
    showResultsBtn.disabled = true; 
});

showResultsBtn.addEventListener('click', () => {
    alert(`Results:\nTime: ${timeValue.textContent} seconds\nWPM: ${wpmValue.textContent}\nAccuracy: ${accuracyValue.textContent}`);
});
