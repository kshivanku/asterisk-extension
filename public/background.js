/*global chrome*/
console.log("background script loaded");

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var activeTab = tabs[0];
  console.log(tabs);
  chrome.tabs.sendMessage(activeTab.id, { message: "clicked_browser_action" });
});

chrome.action.onClicked.addListener(function (tab) {
  console.log("button clicked");
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log(tab);
  if (changeInfo.status === "complete") {
    chrome.tabs.sendMessage(tabId, {
      message: "url-changed",
      url: tab.url,
    });
  }
});
