document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("misspelledWords", (data) => {
        let words = data.misspelledWords || [];
        let wordListContainer = document.getElementById("wordList");

        if (words.length > 0) {
            wordListContainer.innerHTML = words.map(word => `<li>${word}</li>`).join("");
        } else {
            wordListContainer.innerHTML = "<li>No spelling mistakes found.</li>";
        }
    });
});