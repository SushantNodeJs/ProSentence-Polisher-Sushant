const apiKeyInput = document.getElementById('apiKeyInput');
const saveBtn = document.getElementById('saveBtn');
const saveStatus = document.getElementById('saveStatus');

// Load existing API key (if any)
chrome.storage.sync.get(['openaiApiKey'], function(result) {
  if (result.openaiApiKey) {
    apiKeyInput.value = result.openaiApiKey;
  }
});

// Save API key
saveBtn.addEventListener('click', () => {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    saveStatus.textContent = "Please enter a valid API Key 😐";
    return;
  }

  chrome.storage.sync.set({ openaiApiKey: apiKey }, function() {
    saveStatus.textContent = "API Key saved! 🎉";
    setTimeout(() => { saveStatus.textContent = ''; }, 2000);
  });
});
