/*global chrome*/
import React from 'react';
import ReactDOM from 'react-dom';
import "./content.css";
import Overlay from './Overlay'

console.log('content script loaded')

window['onload'] = function() {
    setTimeout(startObserver, 2000);
}

function startObserver() {
    placeBadges()
    const targetNode = document.querySelector('[aria-label="Timeline: Your Home Timeline"]').firstChild;
    const config = { attributes: true, childList: true, subtree: false };
    console.log(targetNode)
    const callback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                placeBadges()
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    // observer.disconnect();
}

function placeBadges() {
    let nameElements = document.getElementsByClassName('css-1dbjc4n r-k4xj1c r-18u37iz r-1wtj0ep');
    for (let i = 0 ; i < nameElements.length ; i++) {
        let targetElement =  nameElements[i].firstChild
        let nameElementsChildren = targetElement.children;
        let contains_badge= false
        if(nameElementsChildren.length <= 1) {
            contains_badge= true
        }
        else {
            for (let child of nameElementsChildren) {
                child.classList.contains('huh-badge') ? contains_badge = true : contains_badge = false
            }
        }
        if(!contains_badge){
            let node = document.createElement("button");            
            node.setAttribute('data-name', targetElement.innerText.split(/\n/)[0])            
            node.setAttribute('class', 'huh-badge')            
            node.innerHTML = `huh?`
            node.addEventListener('click', (e)=>{
                let message = {
                    'displayname': e.path[1].innerText.split(/\n/)[0],
                    'username': e.path[1].innerText.split(/\n/)[1].split('@')[1],
                }
                console.log(message)
                const overlay = document.createElement('div');
                overlay.id = "overlay-root";
                document.body.appendChild(overlay);
                ReactDOM.render(<Overlay name={message.displayname}/>, overlay);                
            })
            targetElement.appendChild(node)
        }
    }
}













chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
       if(request.message === "clicked_browser_action") {
         console.log('Button Clicked')
       }
    }
 );
 
//  function toggle(){
//      console.log('toggling view')
//     if(overlay.style.display === "none"){
//       overlay.style.display = "block";
//     }else{
//       overlay.style.display = "none";
//     }
//  }

