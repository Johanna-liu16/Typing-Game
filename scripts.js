// code for typing game
// Created by: Johanna Liu
// Date: Jan 2024

// create 200 random words
function randomWords() {
    var theWords = [];

    for (var i = 0; i < 200; i++) {
        fetch('https://random-word-api.herokuapp.com/word')
            .then(response => {
                return response.json();
            })
            .then(data => {
                const word = data[0];
                theWords.push(word);
            })
    }
    return theWords;
}

//starts game
function newGame() {
    document.getElementById('words').innerHTML = randomWords();
}

newGame();

