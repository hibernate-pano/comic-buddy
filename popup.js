document.addEventListener('DOMContentLoaded', function() {
  const translateButton = document.getElementById('translate');
  const translateSelectionButton = document.getElementById('translateSelection');
  const resetButton = document.getElementById('reset');
  const sourceLangSelect = document.getElementById('sourceLang');
  const targetLangSelect = document.getElementById('targetLang');
  const apiKeyInput = document.getElementById('apiKey');
  const saveApiKeyButton = document.getElementById('saveApiKey');
  const apiKeyStatus = document.getElementById('apiKeyStatus');

  // 从存储中加载 API Key
  chrome.storage.sync.get(['apiKey'], function(result) {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
    }
  });

  // 保存并验证 API Key
  saveApiKeyButton.addEventListener('click', function() {
    const apiKey = apiKeyInput.value;
    chrome.runtime.sendMessage({action: "validateApiKey", apiKey: apiKey}, function(response) {
      if (response.valid) {
        chrome.storage.sync.set({apiKey: apiKey});
        apiKeyStatus.textContent = "API Key 有效并已保存";
        apiKeyStatus.style.color = "green";
      } else {
        apiKeyStatus.textContent = "API Key 无效，请检查并重试";
        apiKeyStatus.style.color = "red";
      }
      apiKeyStatus.style.display = "block";
    });
  });

  translateButton.addEventListener('click', function() {
    const sourceLang = sourceLangSelect.value;
    const targetLang = targetLangSelect.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "translate",
        sourceLang: sourceLang,
        targetLang: targetLang
      });
    });
  });

  translateSelectionButton.addEventListener('click', function() {
    const sourceLang = sourceLangSelect.value;
    const targetLang = targetLangSelect.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "translateSelection",
        sourceLang: sourceLang,
        targetLang: targetLang
      });
    });
  });

  resetButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "reset"});
    });
  });
});