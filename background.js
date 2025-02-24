chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ apiKey: "6J4h2jDfVU9As7Zt" }, () => {
        console.log("✅ API Key stored securely.");
    });
});