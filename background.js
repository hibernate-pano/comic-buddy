chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    // 从存储中获取 API key
    chrome.storage.sync.get(['apiKey'], function(result) {
      if (result.apiKey) {
        translateWithAI(request.text, request.targetLang, result.apiKey).then(translatedText => {
          sendResponse({ translatedText: translatedText });
        });
      } else {
        sendResponse({ error: "API Key not set" });
      }
    });
  } else if (request.action === "validateApiKey") {
    validateApiKey(request.apiKey).then(isValid => {
      sendResponse({ valid: isValid });
    });
  }
  return true; // Keep the message channel open for async response
});

// Function to call AI API
async function translateWithAI(text, targetLang, apiKey) {
  const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt: `将以下漫画文本翻译成${targetLang}：\n\n${text}\n\n请注意：\n1. 保持原文的语气和风格\n2. 考虑漫画对话的简洁性\n3. 如果有特定的文化参考或俚语，请适当调整以适应目标语言文化\n4. 保留任何声音效果或拟声词，但根据需要进行调整`,
      max_tokens: 1000
    })
  });
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }
  return data.choices[0].text.trim();
}

// Function to validate API key
async function validateApiKey(apiKey) {
  try {
    const response = await fetch('https://api.openai.com/v1/engines', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}