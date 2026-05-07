// background.js
let isFocusModeActive = false;
let blockedDomains = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SET_FOCUS_MODE") {
    isFocusModeActive = message.active;
    if (Array.isArray(message.domains)) {
      blockedDomains = message.domains;
    }
    console.log("[FocusForge] Focus Mode Set:", isFocusModeActive, "Domains:", blockedDomains);
    broadcastFocusState();
  } else if (message.type === "TIMER_FINISHED") {
    // Notify all tabs to play a sound
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { type: "PLAY_NOTIFICATION" }).catch(() => {});
      });
    });
  }
});

function broadcastFocusState() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, { 
        type: "FOCUS_STATE_CHANGED", 
        active: isFocusModeActive,
        domains: blockedDomains
      }).catch(() => {});
    });
  });
}

// Also notify new tabs when they load
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && isFocusModeActive) {
    chrome.tabs.sendMessage(tabId, { 
      type: "FOCUS_STATE_CHANGED", 
      active: true,
      domains: blockedDomains
    }).catch(() => {});
  }
});
