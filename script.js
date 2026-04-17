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
const savedList = document.getElementById("savedList");

//event listener
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const word = input.value.trim();
    if (word === "") return;

    fetchWord(word);
});

//fetch API
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

function displayWord(data) {
    const word = data.word;
    const phonetic = data.phonetic || "No pronunciation";
    const meaning = data.meanings[0];
    const definition = meaning.definitions[0];

    wordEl.textContent = word;
    pronunciationEl.textContent = phonetic;
    partOfSpeechEl.textContent = meaning.partOfSpeech;
    definitionEl.textContent = definition.definition;
    exampleEl.textContent = definition.example || "No example available";
    synonymsEl.textContent = meaning.synonyms.length > 0 
        ? "Synonyms: " + meaning.synonyms.join(", ") 
        : "No synonyms";

    if (data.phonetics[0] && data.phonetics[0].audio) {
        audioEl.src = data.phonetics[0].audio;
        audioEl.classList.remove("hidden");
    } else {
        audioEl.classList.add("hidden");
    }

    result.classList.add("show");
}

function renderSavedWords() {
    const savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];

    savedList.innerHTML = "";

    savedWords.forEach((item, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span class="saved-word">${item.word}</span>
            <span class="delete-btn">✖</span>
        `;

        li.querySelector(".saved-word").onclick = () => {
            fetchWord(item.word);
        };

        li.querySelector(".delete-btn").onclick = (e) => {
            e.stopPropagation();
            deleteWord(index);
        };

        savedList.appendChild(li);
    });
}
function deleteWord(index) {
    let savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];

    savedWords.splice(index, 1);

    localStorage.setItem("savedWords", JSON.stringify(savedWords));

    renderSavedWords();
}


function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}

