//elements
const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const result = document.getElementById("result");
const errorMessage = document.getElementById("errorMessage");

const wordEl = document.getElementById("word");
const pronunciationEl = document.getElementById("pronunciation");
const partOfSpeechEl = document.getElementById("partOfSpeech");
const definitionEl = document.getElementById("definition");
const exampleEl = document.getElementById("example");
const synonymsEl = document.getElementById("synonyms");
const audioEl = document.getElementById("audio");

//event listener
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const word = input.value.trim();
    if (word === "") return;

    fetchWord(word);
});

function fetchWord(word) {
    errorMessage.classList.add("hidden");
    result.classList.remove("show");

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Word not found");
            }
            return response.json();
        })
        .then(data => {
            displayWord(data[0]);
        })
        .catch(error => {
            showError(error.message);
        });
}