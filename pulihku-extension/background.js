// Keep track of settings
let customDomains = [];
let safeSearchEnabled = true;

// Load stored values on startup (optional but keeps rules persisted)
chrome.runtime.onInstalled.addListener(() => {
  updateRules();
});

// Listen to messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_CUSTOM_BLOCKS") {
    customDomains = message.domains || [];
    updateRules();
  } else if (message.type === "UPDATE_SAFE_SEARCH") {
    safeSearchEnabled = !!message.enabled;
    updateRules();
  }
});

// Function to update declarativeNetRequest dynamic rules
async function updateRules() {
  // Get all existing dynamic rules
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const ruleIdsToRemove = existingRules.map(r => r.id);

  const newRules = [];
  let ruleId = 10000; // Start dynamic rule IDs at 10000 to avoid conflicts with static rules in rules.json

  // 1. Add Custom Blocklist Rules
  customDomains.forEach(domain => {
    // Clean domain
    const cleanDomain = domain.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");
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
}
