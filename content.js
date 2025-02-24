// Function to extract text from the page
function getTextFromPage() {
    return document.body.innerText;
}

// Function to fetch API key and check spelling
function checkSpelling() {
    chrome.storage.local.get("apiKey", async (data) => {
        const apiKey = data.apiKey;
        if (!apiKey) {
            console.error("❌ API Key missing! Please configure it.");
            return;
        }

        let text = getTextFromPage();

        try {
            const response = await fetch(`https://api.textgears.com/spelling?key=${apiKey}&text=${encodeURIComponent(text)}&language=en-GB`);
            const result = await response.json();
            
            if (result?.response?.errors?.length) {
                result.response.errors.forEach(error => {
                    highlightError(error.bad);
                });
            }
        } catch (error) {
            console.error("⚠️ Spell check failed:", error);
        }
    });
}

// Function to highlight spelling mistakes on the page
function highlightError(word) {
    let regex = new RegExp(`\\b${word}\\b`, "gi");
    document.body.innerHTML = document.body.innerHTML.replace(regex, `<span style="background-color: yellow; color: red;">${word}</span>`);
}

// Automatically check spelling when the page loads
window.onload = () => {
    checkSpelling();
};