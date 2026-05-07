// background.js
let isFocusModeActive = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SET_FOCUS_MODE") {
    isFocusModeActive = message.active;
    
    // Notify all tabs about the state change
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { 
          type: "FOCUS_STATE_CHANGED", 
          active: isFocusModeActive 
        }).catch(() => {}); // Ignore errors for internal chrome pages
      });
    });
  }
});

// Also notify new tabs when they load
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && isFocusModeActive) {
    chrome.tabs.sendMessage(tabId, { 
      type: "FOCUS_STATE_CHANGED", 
      active: true 
    }).catch(() => {});
  }
});
