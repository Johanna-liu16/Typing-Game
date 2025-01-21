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

   for (var i = 0; i < 25; i++) {
        aWord = await getWords();
        quote.push(aWord);
    }
    quote = quote.concat(quote)
    quote = quote.join("\n")
    document.getElementById('words').innerHTML = quote

    // separate each character
    for (var j = 0; j <quote.length; j++) {
        document.getElementById('words').innerHTML += (`<span>${quote[j]}</span>`)
    }

    //detect keyborad actions 
    document.getElementById('game').addEventListener('keyup', event => {
        console.log(event)
    })
}

renderWords();

