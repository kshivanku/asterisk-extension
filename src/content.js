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

window["onload"] = function () {
  setTimeout(startObserver, 2000);
  document.body.appendChild(overlay);
  Firebase.initializeApp(firebaseConfig);
};

function startObserver() {
  placeBadges();
  const targetNode = document.querySelector(
    '[aria-label="Timeline: Your Home Timeline"]'
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

function placeBadges() {
  let nameElements = document.getElementsByClassName(
    "css-1dbjc4n r-k4xj1c r-18u37iz r-1wtj0ep"
  );
  for (let i = 0; i < nameElements.length; i++) {
    let targetElement = nameElements[i].firstChild;
    let nameElementsChildren = targetElement.children;
    let contains_badge = false;
    if (nameElementsChildren.length <= 1) {
      contains_badge = true;
    } else {
      for (let child of nameElementsChildren) {
        child.classList.contains("huh-badge")
          ? (contains_badge = true)
          : (contains_badge = false);
      }
    }
    if (!contains_badge) {
      let node = document.createElement("button");
      node.setAttribute("data-name", targetElement.innerText.split(/\n/)[0]);
      node.setAttribute("class", "huh-badge");
      node.innerText = `huh?`;
      node.addEventListener("click", (e) => {
        toggle();
        let userinfodiv_arr = e.path[1].innerText.split(/\n/);
        let un = "";
        for (let elem of userinfodiv_arr) {
          if (elem.indexOf("@") > -1) {
            un = elem.split("@")[1];
          }
        }
        let clikedNode = {
          displayname: userinfodiv_arr[0],
          username: un,
        };
        ReactDOM.render(
          <Overlay
            displayname={clikedNode.displayname}
            username={clikedNode.username}
            toggle={toggle}
            Firebase={Firebase}
          />,
          overlay
        );
      });
      targetElement.appendChild(node);
    }
  }
}

function toggle() {
  if (overlay.style.display === "none") {
    overlay.style.display = "block";
    // document.body.style.overflow = "hidden";
  } else {
    overlay.style.display = "none";
    // document.body.style.overflow = "auto";
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    console.log("Button Clicked");
  }
});
