document.addEventListener('DOMContentLoaded', function() {
  const translateButton = document.getElementById('translate');
  const translateSelectionButton = document.getElementById('translateSelection');
  const resetButton = document.getElementById('reset');
  const sourceLangSelect = document.getElementById('sourceLang');
  const targetLangSelect = document.getElementById('targetLang');
  const apiKeyInput = document.getElementById('apiKey');

  // 从存储中加载 API Key
  chrome.storage.sync.get(['apiKey'], function(result) {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
    }
  });

  // 保存 API Key
  apiKeyInput.addEventListener('change', function() {
    chrome.storage.sync.set({apiKey: apiKeyInput.value});
  });

  translateButton.addEventListener('click', function() {
    const sourceLang = sourceLangSelect.value;
    const targetLang = targetLangSelect.value;
    const apiKey = apiKeyInput.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "translate",
        sourceLang: sourceLang,
        targetLang: targetLang,
        apiKey: apiKey
      });
    });
  });

  translateSelectionButton.addEventListener('click', function() {
    const sourceLang = sourceLangSelect.value;
    const targetLang = targetLangSelect.value;
    const apiKey = apiKeyInput.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "translateSelection",
        sourceLang: sourceLang,
        targetLang: targetLang,
        apiKey: apiKey
      });
    });
  });

  resetButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "reset"});
    });
  });
});