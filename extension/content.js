// 1. Communication with FocusForge Web App
const isFocusForgeApp = window.location.hostname === "localhost" || 
                       window.location.hostname === "127.0.0.1" ||
                       window.location.href.includes("focusforge");

if (isFocusForgeApp) {
  // Listen for state changes from the app
  window.addEventListener("FOCUSFORGE_TIMER_STATE", (event) => {
    chrome.runtime.sendMessage({ 
      type: "SET_FOCUS_MODE", 
      active: event.detail.active,
      domains: event.detail.domains
    });
  });

  // Listen for timer finished from the app
  window.addEventListener("FOCUSFORGE_TIMER_FINISHED", () => {
    chrome.runtime.sendMessage({ type: "TIMER_FINISHED" });
  });
}

// 2. Global Blur Enforcement Logic
function updateBlur(active, domains = []) {
  // Never blur the FocusForge app or essential workspace tools
  const WHITELIST = ["localhost", "127.0.0.1", "google.com", "gmail.com", "googleusercontent.com", "googleapis.com", "focusforge"];
  const isWhitelisted = WHITELIST.some(w => window.location.hostname.toLowerCase().includes(w));
  
  if (isFocusForgeApp || isWhitelisted) {
    console.log("[FocusForge] Site is whitelisted. Skipping shield.");
    return;
  }

  const distractionList = (domains || []).filter(d => d && d.length > 3);
  
  console.log("[FocusForge] Shield State:", { active, distractionList, current: window.location.hostname });

  if (!active || distractionList.length === 0) {
    document.documentElement.classList.remove("focusforge-distraction");
    const overlay = document.getElementById("focusforge-shield-overlay");
    if (overlay) overlay.remove();
    return;
  }

  const currentHostname = window.location.hostname.toLowerCase();
  const isDistraction = distractionList.some(d => {
    const blocked = d.toLowerCase().trim();
    return currentHostname === blocked || currentHostname.endsWith("." + blocked);
  });

  if (active && isDistraction) {
    document.documentElement.classList.add("focusforge-distraction");
    
    if (!document.getElementById("focusforge-shield-overlay")) {
      const overlay = document.createElement("div");
      overlay.id = "focusforge-shield-overlay";
      
      const siteName = window.location.hostname.split('.')[1]?.toUpperCase() || "DISTRACTION";
      
      overlay.innerHTML = `
        <div style="text-align: center; color: white; font-family: 'Inter', sans-serif; padding: 40px; background: rgba(15, 23, 42, 0.9); border-radius: 32px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(20px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          <div style="font-size: 64px; margin-bottom: 24px;">🛡️</div>
          <h1 style="font-size: 32px; font-weight: 900; margin-bottom: 12px; letter-spacing: -0.02em;">FOCUSFORGE SHIELD</h1>
          <p style="font-size: 18px; color: #94a3b8; margin-bottom: 32px;">${siteName} is currently restricted to protect your productivity.</p>
          <div style="font-[10px]; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: #3b82f6;">Teacher Managed Policy</div>
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
    updateBlur(message.active, message.domains);
  } else if (message.type === "PLAY_NOTIFICATION") {
    // Play sound even on other tabs
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    audio.play().catch(() => {});
  }
});
