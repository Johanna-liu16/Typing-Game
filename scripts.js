// code for typing game
// Created by: Johanna Liu
// Date: Jan 2024

// create words from api
function generateWords() {
    return fetch('https://random-word-api.herokuapp.com/word')
        .then(response => response.json())
        .then(data => data[0]);
}

// get the created word
async function getWords() {

    var word = await generateWords();
    return word;
}

//make array of words
async function renderWords() {
    var quote = [];

   for (var i = 0; i < 50; i++) {
        aWord = await getWords();
        quote.push(aWord);
    }
    document.getElementById('words').innerHTML = quote.join("\n")
}

renderWords();

