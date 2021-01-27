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

window["onload"] = function () {
  setTimeout(startObserver, 2000);
  document.body.appendChild(overlay);
  Firebase.initializeApp(firebaseConfig);
};

function startObserver() {
  placeBadges();
  let aria_label = "";
  if (currentUrl.indexOf("/home") > -1) {
    aria_label = "Your Home Timeline";
  } else if (currentUrl.indexOf("/status") > -1) {
    aria_label = "Conversation";
  } else {
    aria_label = null;
  }
  console.log(aria_label);
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
  } else {
    let nameElements = document.getElementsByClassName(
      "css-901oao r-18jsvk2 r-1qd0xha r-1b6yd1w r-1vr29t4 r-ad9z0x r-bcqeeo r-qvutc0"
    );
    let targetElement = nameElements[2];
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
    console.log(e);
    clikedNode.displayname = e.path[1].childNodes[0].innerText;
    clikedNode.username = e.path[3].childNodes[1].innerText.split("@")[1];
  }
  ReactDOM.render(
    <Overlay
      displayname={clikedNode.displayname}
      username={clikedNode.username}
      toggle={toggle}
      Firebase={Firebase}
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  if (request.message === "url-changed") {
    console.log("url changed");
    currentUrl = request.url;
    setTimeout(startObserver, 2000);
  }
});
