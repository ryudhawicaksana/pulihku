// Keep track of settings
let customDomains = [];
let safeSearchEnabled = true;

let isUpdating = false;
let pendingUpdate = false;

// Load stored values on startup
chrome.runtime.onInstalled.addListener(() => {
  updateRules();
});

// Listen to messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_SETTINGS") {
    customDomains = message.domains || [];
    safeSearchEnabled = message.safeSearch !== false; // Default true
    updateRules();
  }
});

// Function to update declarativeNetRequest dynamic rules (with lock to prevent race conditions)
async function updateRules() {
  if (isUpdating) {
    pendingUpdate = true;
    return;
  }
  isUpdating = true;

  try {
    // Get all existing dynamic rules
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIdsToRemove = existingRules.map(r => r.id);

    const newRules = [];
    let ruleId = 10000; // Start dynamic rule IDs at 10000 to avoid conflicts with static rules in rules.json

    // 1. Add Custom Blocklist Rules (filter unique domains)
    const uniqueDomains = Array.from(new Set(customDomains.map(d => d.trim().toLowerCase())));
    uniqueDomains.forEach(domain => {
      const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, "");
      if (!cleanDomain) return;

      newRules.push({
        id: ruleId++,
        priority: 1,
        action: { type: "block" },
        condition: {
          urlFilter: `||${cleanDomain}`,
          resourceTypes: ["main_frame", "sub_frame"]
        }
      });
    });

    // 2. Add Safe Search Enforcer Rules (if enabled)
    if (safeSearchEnabled) {
      // Google Safe Search (Redirect to include safe=active)
      newRules.push({
        id: ruleId++,
        priority: 1,
        action: {
          type: "redirect",
          redirect: {
            transform: {
              queryTransform: {
                addOrReplaceParams: [{ key: "safe", value: "active" }]
              }
            }
          }
        },
        condition: {
          urlFilter: "*://*.google.com/search*",
          resourceTypes: ["main_frame", "sub_frame"]
        }
      });

      // Bing Safe Search (Redirect to include adlt=strict)
      newRules.push({
        id: ruleId++,
        priority: 1,
        action: {
          type: "redirect",
          redirect: {
            transform: {
              queryTransform: {
                addOrReplaceParams: [{ key: "adlt", value: "strict" }]
              }
            }
          }
        },
        condition: {
          urlFilter: "*://*.bing.com/search*",
          resourceTypes: ["main_frame", "sub_frame"]
        }
      });
    }

    // Update dynamic rules
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIdsToRemove,
      addRules: newRules
    });
    
    console.log(`Updated extension dynamic rules. Total dynamic rules: ${newRules.length}`);
  } catch (err) {
    console.error("Error updating rules:", err);
  } finally {
    isUpdating = false;
    if (pendingUpdate) {
      pendingUpdate = false;
      updateRules();
    }
  }
}
