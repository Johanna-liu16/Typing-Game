// code for typing game
// Created by: Johanna Liu
// Date: Jan 2024

function addClass(element, name) {
    if (!element.classList.contains(name)) {
        element.classList.add(name);
    }
}

function removeClass(element, name) {
    if (element.classList.contains(name)) {
        element.classList.remove(name);
    }
}

// Fetch a random word from the API
function generateWords() {
    return fetch('https://random-word-api.herokuapp.com/word')
        .then(response => response.json())
        .then(data => data[0]);
}

// Create an array of words
async function renderWords() {
    const wordArray = [];
    const wordCount = 25;

    // Generate words and store them in an array
    for (let i = 0; i < wordCount; i++) {
        const word = await generateWords();
        wordArray.push(word);
    }

    // Render the words as spans
    const wordsContainer = document.getElementById('words');
    wordsContainer.innerHTML = ''; // Clear the container
    wordArray.join(' ').split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char;
        if (index === 0) addClass(span, 'current');
        wordsContainer.appendChild(span);
    });

    // Start tracking typing input
    trackTyping();
}

// Typing logic
let correctLetters = 0
let timerStarted = false
let timeUp = false

function trackTyping() {
    const wordsContainer = document.getElementById('words');
    const letters = wordsContainer.querySelectorAll('.letter');
    let currentIndex = 0;


    document.addEventListener('keydown', (event) => {
        // end typing movement if time up
        if (timeUp) {
            return
        }

        const key = event.key;
        const currentLetter = letters[currentIndex];
        const expected = currentLetter.innerHTML;
        const isLetter = key.length === 1 && key !== ' ';
        const isSpace = key === ' '
        const isBackspace = key === 'Backspace'

        // start the timer
        if (!timerStarted && key) {
            startTimer();
            timerStarted = true;
        }

        console.log(correctLetters)

        if (isLetter) {
            if (currentLetter) {
                if (key === expected) {
                    correctLetters++
                    addClass(currentLetter, 'correct')
                } else {
                    addClass(currentLetter, 'wrong')
                }
                currentIndex ++
            }
        }

        if (isSpace) {
            if (expected !== ' ') {
                addClass(currentLetter, 'wrong')
                currentIndex++
            } else {
                addClass(currentLetter, 'correct')
                correctLetters++
                currentIndex++
            }
        }

        if(isBackspace) {
            if (currentLetter) {
                currentIndex--
                const previousLetter = letters[currentIndex];
                if (previousLetter.classList.contains('correct')) {
                    correctLetters = Math.max(0, correctLetters - 1); // Prevent negative count
                }
                removeClass(previousLetter, 'correct');
                removeClass(previousLetter, 'wrong');
            }
        }

        // Check if last letter was typed
        if (currentIndex === letters.length) {
            gameOver()
            return
        }

        // move cursor 
        const cursor = document.getElementById('cursor')
        const nextLetter = letters[currentIndex];
        if (nextLetter) {
            cursor.style.top = nextLetter.getBoundingClientRect().top + 2 + 'px';
            cursor.style.left = nextLetter.getBoundingClientRect().left + 2 + 'px'
        }

        // move lines
        if (currentLetter.getBoundingClientRect().top > 250) {
            const wordBank = document.getElementById('words')
            const margin = parseInt(wordBank.style.marginTop || '0px')
            wordBank.style.marginTop = (margin - 35) + 'px'
        }
    });
}

// the timer
function startTimer() {
    let timerElement = document.getElementById('timer');
    let timer = 30; 

    timerElement.innerHTML = `${timer}`;

    let countdown = setInterval(() => {
        timer--;
        timerElement.innerHTML = `${timer}`;

        // Calculate WPM
        let timeElapsed = (30 - timer) / 60; // Convert seconds to minutes
        let wordsTyped = correctLetters / 5; // Convert characters to words
        let wpm = Math.round(wordsTyped / timeElapsed)

        document.getElementById('wpm').innerHTML = `WPM: ${wpm}`;

        if (timer <= 0) {
            clearInterval(countdown); // Stop the timer at 0
            timeUp = true
            gameOver()
        }
    }, 1000);

    function gameOver() {
        let cursor = document.getElementById('cursor');
        let wordsContainer = document.getElementById('words');
        let finalWords = document.getElementById('finalWords')

        // blur text
        wordsContainer.classList.add('blurred')

        //remove cursor
        cursor.style.display = 'none'

        //show text
        finalWords.innerHTML = 'Click Anywhere to Restart';
        finalWords.style.display = 'block'

         // Add event listener to restart game on click
        document.addEventListener('click', () => {
        location.reload()
    }, { once: true })
    }
}

// Initialize the game
renderWords();

