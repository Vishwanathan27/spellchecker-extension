document.getElementById("checkSpelling").addEventListener("click", () => {
    console.log("🖱️ Spell check button clicked!");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: checkSpellingOnPage
        });
    });
});

function checkSpellingOnPage() {
    chrome.storage.local.get("apiKey", async (data) => {
        const apiKey = data.apiKey;
        if (!apiKey) {
            console.error("❌ API Key missing! Please configure it.");
            return;
        }

        let text = document.body.innerText;

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

    function highlightError(word) {
        let regex = new RegExp(`\\b${word}\\b`, "gi");
        document.body.innerHTML = document.body.innerHTML.replace(regex, `<span style="background-color: yellow; color: red;">${word}</span>`);
    }
}