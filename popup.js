const polishBtn = document.getElementById('polishBtn');
const settingsBtn = document.getElementById('settingsBtn');
const inputSentence = document.getElementById('inputSentence');
const outputSentence = document.getElementById('outputSentence');
const toast = document.getElementById('toast');

// Show toast messages
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Open Settings page
settingsBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// Handle polishing
polishBtn.addEventListener('click', async () => {
  const input = inputSentence.value.trim();
  if (!input) {
    showToast("Please type something first! 🧐");
    return;
  }

  outputSentence.value = "Polishing... ✨ (Please wait)";

  chrome.storage.sync.get(['openaiApiKey'], async function(result) {
    const OPENAI_API_KEY = result.openaiApiKey;

    if (!OPENAI_API_KEY) {
      outputSentence.value = "";
      showToast("API Key missing! Set it in Settings ⚙️");
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `Make this sentence sound professional: "${input}"` }],
          max_tokens: 100
        })
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw new Error(data.error?.message || "Unknown API error");
      }

      if (data.choices && data.choices.length > 0) {
        outputSentence.value = data.choices[0].message.content.trim();
        showToast("Success! 🚀");
      } else {
        outputSentence.value = "";
        showToast("No response from AI 🤖.");
      }
    } catch (error) {
      console.error(error);
      outputSentence.value = "";
      showToast(`Error: ${error.message}`);
    }
  });
});
