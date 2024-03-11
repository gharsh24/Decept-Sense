let darkPatternVariables;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.darkPatternVariables) {
    darkPatternVariables = message.darkPatternVariables;

    // Send a message to the popup script
    chrome.runtime.sendMessage({ darkPatternVariables });
  }
});

// Create a function to get the dark pattern variables when requested by the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getDarkPatternVariables") {
    sendResponse({ darkPatternVariables });
  }
});
chrome.contextMenus.create({
  id: "yourContextMenuId",
  title: "Check Authenticity",
  contexts: ["selection"],
});

// Add an event listener to handle the context menu item click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "yourContextMenuId") {
    // Your action when the context menu is clicked
    console.log("Context menu clicked!");
  }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "showNotification") {
    console.log("showNotification");
    chrome.notifications.create("", {
      type: "basic",

      title: "Report Submitted",
      message: "Thank you for submitting a report",
    });
  }
});
