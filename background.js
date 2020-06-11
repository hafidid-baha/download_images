// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// Declare extension default properties
let downloadsArray = [];
let initialState = {
  'savedImages': downloadsArray,
  'thumbnails': false,
  'saveImages': true
};
const scriptCode =
  `(function() {
      let images = document.querySelectorAll('img');
      let srcArray =
           Array.from(images).map(function(image) {
             return image.currentSrc;
           });
      return srcArray
    })();`;

const getTitleScriptCode =
  `(function() {
      return document.querySelector('title').innerText;      
    })();`;

// Declare add image function to save downloaded images
function addImage(url) {
  // Images are added
  if(!downloadsArray.includes(url)){

  }
  downloadsArray.push(url);
  // console.log(downloadsArray);
  // Chrome stores the new array with the new image
  chrome.storage.local.set({'savedImages': downloadsArray}, function() {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
    } else {
      console.log('Image saved successfully');
    };
  });
};    


function setUp(array) {
  chrome.storage.local.get(
      ['saveImages', 'thumbnails'], function(config) {
    for (let src of array) {
      // console.log(src);      
      addImage(src);
    };

    // // console.log(downloadsArray);
    // chrome.storage.local.get('savedImages', function(result) {
    //   // Check if storage has exsisting arrays
    //   // If array found, blank array is replaced with found array
    //   // If no array, we add to created blank array
    //   // downloadsArray = result.savedImages;
    //   // console.log("data"+downloadsArray);
      
    // });
    chrome.tabs.create({'url': 'redirect.html','active':true});

    // console.log(downloadsArray);
  });
};


// Set extension setting on installation
chrome.runtime.onInstalled.addListener(function() {
    // chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    //   chrome.declarativeContent.onPageChanged.addRules([{
    //     conditions: [
    //       new chrome.declarativeContent.PageStateMatcher({
    //         pageUrl: { hostEquals: 'https://www.youtube.com/*', schemes: ['https'] },
    //       })
    //     ],
    //     actions: [ new chrome.declarativeContent.ShowPageAction() ]
    //   }]);
    // });
  chrome.storage.local.set(initialState);
});

// chrome.runtime.onMessage.addListener(
//   function(request,sender,sendResponse){
//     // alert(sender.tab ?
//     //   "from a content script:" + sender.tab.url :
//     //   "from the extension");
//    alert('message is her');
//   //  chrome.tabs.create({'url': 'redirect.html','active':true});
//   }
// );


chrome.browserAction.onClicked.addListener(function() {
  // clear up old images from the stored array
  chrome.storage.local.set({'savedImages': []}, function() {
    downloadsArray = [];
    console.log("the images array has been deleted");
  });

  chrome.tabs.executeScript({code: getTitleScriptCode}, function(result) {
    if(result.length > 0){
      chrome.storage.local.set({'title': result[0]});
    }
  });

  // Runs script when popup is opened
  chrome.tabs.executeScript({code: scriptCode}, function(result) {
    setUp(result[0]);
  });

  // setTimeout(() => {
  //   console.log(downloadsArray);
  //   // chrome.tabs.create({'url': 'redirect.html','active':true});
  // }, 200);
  // // chrome.windows.create({'url': 'redirect.html', 'type': 'popup'}, function(window) {

  // });
});
