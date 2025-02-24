chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ apiKey: "6J4h2jDfVU9As7Zt" }, () => {
        console.log("✅ API Key stored securely.");
    });
});

// ✅ Listen for messages from `content.js` and show a notification
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "SHOW_SPELLING_NOTIFICATION") {
        let wordList = message.words.join(", ");
        let notificationMessage = `Found ${message.count} spelling mistakes. Click to view.`;

        chrome.notifications.create("spellCheckNotification", {
            type: "basic",
            iconUrl: "icon.png",
            title: "Spell Checker",
            message: notificationMessage,
            priority: 2
        });

        // Store misspelled words to show in popup
        chrome.storage.local.set({ misspelledWords: message.words });
    }
});

// ✅ Open a popup when the notification is clicked
chrome.notifications.onClicked.addListener((notificationId) => {
    if (notificationId === "spellCheckNotification") {
        chrome.runtime.openOptionsPage(); // Open the settings page (or a custom popup)
    }
});