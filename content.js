console.log("🚀 Spell Checker Extension Loaded");

// Function to check spelling on page load
function checkSpelling() {
    chrome.storage.local.get("apiKey", async (data) => {
        const apiKey = data.apiKey;
        if (!apiKey) {
            console.error("❌ API Key missing! Please configure it.");
            return;
        }

        let text = getTextFromPage();
        console.log("🔍 Checking spelling for:", text.slice(0, 100)); // Show first 100 characters

        try {
            const response = await fetch(`https://api.textgears.com/spelling?key=${apiKey}&text=${encodeURIComponent(text)}&language=en-GB`);
            const result = await response.json();
            
            console.log("📄 Spell Check API Response:", result);
            if (result?.response?.errors?.length) {
                let misspelledWords = result.response.errors.map(error => error.bad);
                showNotification(misspelledWords);
            } else {
                console.log("✅ No spelling mistakes found.");
            }
        } catch (error) {
            console.error("⚠️ Spell check failed:", error);
        }
    });
}

// Function to extract visible text from the page
function getTextFromPage() {
    return document.body.innerText;
}

// ✅ Function to show notification with spelling mistakes
function showNotification(misspelledWords) {
    let count = misspelledWords.length;
    console.log(`⚠️ Found ${count} spelling mistakes:`, misspelledWords);

    // Send message to background script to show a notification
    chrome.runtime.sendMessage({
        type: "SHOW_SPELLING_NOTIFICATION",
        count: count,
        words: misspelledWords
    });
}

// Run spell check automatically when the page loads
window.onload = () => {
    console.log("🔄 Page loaded, running spell checker...");
    checkSpelling();
};