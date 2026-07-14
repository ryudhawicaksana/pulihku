// Listen to messages from the web page
window.addEventListener("message", (event) => {
  // Only accept messages from ourselves
  if (event.source !== window) return;

  if (event.data && event.data.source === "pulihku-web") {
    if (event.data.type === "PING") {
      // Respond immediately to confirm extension is installed
      window.postMessage({ source: "pulihku-extension", type: "PONG", active: true }, "*");
    } else if (event.data.type === "UPDATE_CUSTOM_BLOCKS") {
      // Forward custom blocks to background script
      chrome.runtime.sendMessage({ type: "UPDATE_CUSTOM_BLOCKS", domains: event.data.domains });
    } else if (event.data.type === "UPDATE_SAFE_SEARCH") {
      // Forward safe search status to background script
      chrome.runtime.sendMessage({ type: "UPDATE_SAFE_SEARCH", enabled: event.data.enabled });
    }
  }
});

// Broadcast that the extension is loaded on this tab
window.postMessage({ source: "pulihku-extension", type: "PONG", active: true }, "*");
