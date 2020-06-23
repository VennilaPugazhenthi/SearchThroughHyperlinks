console.log("Background Script is running..");

chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    chrome.tabs.excuteScripts(null,{file:popup.js});
});

// chrome.browserAction.onClicked.addListener(function () {
//     // chrome.tabs.executeScript(null,{file:'popup.js'});
//     // chrome.tabs.executeScript(null,{
//     //     code:"console.log('WOW THIS WORKS!');"
//     // });
// });





// chrome.runtime.onMessage.addListener(function (msg) {
//     console.log("Message recieved in background script");
//     console.log("Length is",msg.len);
//     var myarray=msg.array;
//     var len= msg.len;
//     var re = msg.re;
//     var numarray=[];
//     // for(var k=0; k<len; k++){
//     var xhr = new XMLHttpRequest();
//     // OPEN - type, url/file, async
//
//     xhr.open("GET",myarray[1],true);
//
//     xhr.onreadystatechange = function(){
//         // console.log("READYSTATE: ",xhr.readyState);
//         if(this.readyState == 4 && this.status == 200){
//             // console.log("Inside the xhr");
//             var response= this.responseText;
//
//             var parse = new DOMParser();
//
//             var html_new = parse.parseFromString(response,'text/html');
//             console.log("The response:");
//             console.log(html_new);
//             var parents_new=[];
//             var children_new=[];
//
//             //Find all text nodes, and add their parents to a list
//             recursiveFindTextNodes(0,html_new.body,function (parent, node) {
//                 if(node.data.match(re)){
//                     // console.log("Does it make it here?");
//                     parents_new.push(parent);
//                     children_new.push(node);
//                 }
//             });
//
//             var count_appearence=0;
//             console.log("The length of parents_new:",parents_new.length);
//             for(let i=0; i< parents_new.length; i++){
//                 console.log("Here:",parents_new.length);
//                 var parent = parents_new[i];
//                 var node = children_new[i];
//                 if(node.data.match(re)){
//                     console.log("Match found");
//                     count_appearence=count_appearence+1;
//                 }
//             }
//             // console.log("The appearence in new website is:",myarray[k],count_appearence.toString());
//
//             //Displays the website and appearence number together async
//             console.log("The appearence in new website is:",this.responseURL.toString(),count_appearence.toString());
//
//         }
//     }
//     xhr.send();
//     // }
// });
//
// function recursiveFindTextNodes(parent, node, func) {
//     // nodeType 3 designates text
//     if(parent && node.nodeType === 3 ){
//         if(parent.tagName!=="SCRIPT" && parent.tagName!=="STYLE" && parent.tagName!=="IFRAME" && parent.tagName !=="CANVAS"
//             && parent.tagName!=="META"){
//             // console.log("The tag name:", parent.tagName);
//             // Pass the text node and its parent to the handler function
//             func(parent, node);
//         }
//     }else{
//         // Loop through children and make recursive calls
//         for(let i=0; i<node.childNodes.length; i++){
//             recursiveFindTextNodes(node, node.childNodes[i],func);
//         }
//     }
//
// }