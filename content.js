function getTextFromPage() {
    return document.body.innerText;
}

async function checkSpelling(text) {
    try {
        const response = await fetch(`https://api.textgears.com/spelling?key=YOUR_API_KEY&text=${encodeURIComponent(text)}&language=en-GB`);
        const data = await response.json();

        if (data?.response?.errors?.length) {
            data.response.errors.forEach(error => {
                highlightError(error.bad);
            });
        }
    } catch (error) {
        console.error("Spell check failed:", error);
    }
}

function highlightError(word) {
    let regex = new RegExp(`\\b${word}\\b`, "gi");
    document.body.innerHTML = document.body.innerHTML.replace(regex, `<span style="background-color: yellow; color: red;">${word}</span>`);
}

const text = getTextFromPage();
checkSpelling(text);