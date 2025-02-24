document.getElementById("checkSpelling").addEventListener("click", () => {
    chrome.storage.local.get("apiKey", (data) => {
        const apiKey = data.apiKey;
        if (!apiKey) {
            alert("API key is missing. Please configure it.");
            return;
        }

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: checkSpellingOnPage,
                args: [apiKey]
            });
        });
    });
});

function checkSpellingOnPage(apiKey) {
    let text = document.body.innerText;

    fetch(`https://api.textgears.com/spelling?key=${apiKey}&text=${encodeURIComponent(text)}&language=en-GB`)
        .then(response => response.json())
        .then(data => {
            if (data.errors) {
                data.errors.forEach(error => {
                    highlightError(error.bad);
                });
            }
        })
        .catch(error => console.error("Spell check failed:", error));
    
    function highlightError(word) {
        let regex = new RegExp(`\\b${word}\\b`, "gi");
        document.body.innerHTML = document.body.innerHTML.replace(regex, `<span style="background-color: yellow; color: red;">${word}</span>`);
    }
}