// content.js

// 1. Communication with FocusForge Web App (localhost:3000)
if (window.location.hostname === "localhost") {
  window.addEventListener("FOCUSFORGE_TIMER_STATE", (event) => {
    chrome.runtime.sendMessage({ 
      type: "SET_FOCUS_MODE", 
      active: event.detail.active 
    });
  });
}

// 2. Global Blur Enforcement Logic
function updateBlur(active) {
  // Never blur the FocusForge app itself
  if (window.location.hostname === "localhost") return;

  if (active) {
    document.documentElement.classList.add("focusforge-distraction");
    
    // Optional: Add a warning overlay if it doesn't exist
    if (!document.getElementById("focusforge-shield-overlay")) {
      const overlay = document.createElement("div");
      overlay.id = "focusforge-shield-overlay";
      overlay.innerHTML = `
        <div style="text-align: center; color: white; font-family: sans-serif;">
          <h1 style="font-size: 48px; margin-bottom: 20px;">🛡️ FocusForge Shield</h1>
          <p style="font-size: 18px;">This site is blurred to protect your focus.</p>
          <p style="font-size: 14px; opacity: 0.7; margin-top: 10px;">Return to your dashboard to finish your session.</p>
        </div>
      `;
      document.body.appendChild(overlay);
    }
  } else {
    document.documentElement.classList.remove("focusforge-distraction");
    const overlay = document.getElementById("focusforge-shield-overlay");
    if (overlay) overlay.remove();
  }
}

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "FOCUS_STATE_CHANGED") {
    updateBlur(message.active);
  }
});

// Check state on load (if necessary, but background handles onUpdated)
