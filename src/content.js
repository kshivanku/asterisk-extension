/*global chrome*/
import React from "react";
import ReactDOM from "react-dom";
import "./content.css";
import Overlay from "./Overlay";
import Firebase from "firebase/app";
import "firebase/database";
import firebaseConfig from "./firebaseConfig";

const overlay = document.createElement("div");
overlay.id = "overlay-root";
overlay.style.display = "none";
let currentUrl = "https://twitter.com/home";
let huh_user = null;

window["onload"] = function () {
  document.body.appendChild(overlay);
  Firebase.initializeApp(firebaseConfig);
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "url-changed") {
    currentUrl = request.url;
    setTimeout(startExtension, 2000);
  }
});

function startExtension() {
  //   chrome.storage.sync.remove(["current_huh_user"], function (result) {
  //     console.log('removed huh_user from storage');
  //   });
  chrome.storage.sync.get(["current_huh_user"], function (result) {
    if (result["current_huh_user"]) {
      huh_user = result["current_huh_user"];
      placeBadges();
      startObserver();
    } else if (currentUrl.indexOf("/home") > -1) {
      huh_user = document
        .getElementsByClassName(
          "css-4rbku5 css-18t94o4 css-1dbjc4n r-sdzlij r-1loqt21 r-ahm1il r-1ny4l3l r-1udh08x r-o7ynqc r-6416eg r-13qz1uu"
        )[0]
        .href.split(".com/")[1];
      console.log("got huh user from home page");
      placeBadges();
      startObserver();
      chrome.storage.sync.set({ current_huh_user: huh_user }, function () {
        console.log("Value is set to " + huh_user);
      });
    } else {
      console.log("huh_user is undefined");
    }
  });
}

function startObserver() {
  let aria_label = "";
  if (currentUrl.indexOf("/home") > -1) {
    aria_label = "Your Home Timeline";
  } else if (currentUrl.indexOf("/status") > -1) {
    aria_label = "Conversation";
  } else {
    aria_label = null;
  }
  if (aria_label) {
    const targetNode = document.querySelector(
      `[aria-label="Timeline: ${aria_label}"]`
    ).firstChild;
    const config = { attributes: true, childList: true, subtree: false };
    const callback = function (mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          placeBadges();
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    // observer.disconnect();
  }
}

function placeBadges() {
  if (currentUrl.indexOf("/home") > -1 || currentUrl.indexOf("/status") > -1) {
    let nameElements = document.getElementsByClassName(
      "css-1dbjc4n r-k4xj1c r-18u37iz r-1wtj0ep"
    );
    for (let i = 0; i < nameElements.length; i++) {
      let targetElement = nameElements[i].firstChild;
      let nameElementsChildren = targetElement.children;
      let contains_badge = false;
      if (
        nameElementsChildren.length <= 1 &&
        currentUrl.indexOf("/home") > -1
      ) {
        contains_badge = true;
      } else {
        if (
          nameElementsChildren[
            nameElementsChildren.length - 1
          ].classList.contains("huh-badge")
        ) {
          contains_badge = true;
        } else {
          contains_badge = false;
        }
      }
      if (currentUrl.indexOf("/status") > -1 && i > 0) {
        contains_badge = true;
      }
      if (!contains_badge) {
        add_node(targetElement);
      }
    }
  } else if (
    currentUrl.indexOf("/hashtag") === -1 &&
    currentUrl.indexOf("/search") === -1 &&
    currentUrl.indexOf("/explore") === -1 &&
    currentUrl.indexOf("/notifications") === -1 &&
    currentUrl.indexOf("/messages") === -1 &&
    currentUrl.indexOf("/bookmarks") === -1 &&
    currentUrl.indexOf("/lists") === -1 &&
    currentUrl.indexOf("/topics") === -1 &&
    currentUrl.indexOf("/moments") === -1 &&
    currentUrl.indexOf("/settings") === -1
  ) {
    let nameElements = document.getElementsByClassName(
      "css-901oao r-18jsvk2 r-1qd0xha r-1b6yd1w r-1vr29t4 r-ad9z0x r-bcqeeo r-qvutc0"
    );
    let targetElement = nameElements[1];
    add_node(targetElement);
  }
}

function add_node(targetElement) {
  let node = document.createElement("button");
  node.setAttribute("class", "huh-badge");
  node.innerText = `huh?`;
  if (currentUrl.indexOf("/status") > -1) {
    node.style.marginTop = "4px";
  } else {
    node.style.marginLeft = "10px";
  }
  node.addEventListener("click", (e) => {
    handleButtonClick(e);
  });
  targetElement.appendChild(node);
}

function handleButtonClick(e) {
  toggle();
  let clikedNode = {
    displayname: "none",
    username: "none",
  };
  if (currentUrl.indexOf("/home") > -1 || currentUrl.indexOf("/status") > -1) {
    let userinfodiv_arr = e.path[1].innerText.split(/\n/);
    let un = "";
    for (let elem of userinfodiv_arr) {
      if (elem.indexOf("@") > -1) {
        un = elem.split("@")[1];
      }
    }
    clikedNode = {
      displayname: userinfodiv_arr[0],
      username: un,
    };
  } else {
    clikedNode.displayname = e.path[1].childNodes[0].innerText;
    clikedNode.username = e.path[3].childNodes[1].innerText.split("@")[1];
  }
  ReactDOM.render(
    <Overlay
      displayname={clikedNode.displayname}
      username={clikedNode.username}
      toggle={toggle}
      Firebase={Firebase}
      huh_user={huh_user}
    />,
    overlay
  );
}

function toggle() {
  if (overlay.style.display === "none") {
    overlay.style.display = "block";
  } else {
    overlay.style.display = "none";
  }
}
