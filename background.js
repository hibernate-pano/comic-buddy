chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    // Call the AI API for translation
    translateWithAI(request.text, request.targetLang).then(translatedText => {
      sendResponse({ translatedText: translatedText });
    });
  }
  return true; // Keep the message channel open for async response
});

// Function to call AI API
async function translateWithAI(text, targetLang) {
  const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
  const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt: `Translate the following text from English to ${targetLang}:\n\n${text}\n\nPlease ensure the translation maintains the original context and tone.`,
      max_tokens: 1000
    })
  });
  const data = await response.json();
  return data.choices[0].text.trim();
}