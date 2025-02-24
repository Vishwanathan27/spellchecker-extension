// Function to get text from the page
function getTextFromPage() {
    return document.body.innerText;
}

// Function to check spelling using an API (or dictionary)
async function checkSpelling(text) {
    const response = await fetch(`https://api.textgears.com/spelling?key=YOUR_API_KEY&text=${encodeURIComponent(text)}&language=en-GB`);
    const data = await response.json();
    
    if (data.errors) {
        data.errors.forEach(error => {
            highlightError(error.bad);
        });
    }
}

// Function to highlight errors on the page
function highlightError(word) {
    let regex = new RegExp(`\\b${word}\\b`, "gi");
    document.body.innerHTML = document.body.innerHTML.replace(regex, `<span style="background-color: yellow; color: red;">${word}</span>`);
}

// Run spell check
const text = getTextFromPage();
checkSpelling(text);