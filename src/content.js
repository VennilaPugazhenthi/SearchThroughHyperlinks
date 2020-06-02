chrome.runtime.onMessage.addListener(function (request,sender, sendResponse) {
    //Finds the matches of the searched word
    const re = new RegExp(request,'gi')
    const matches = document.documentElement.innerText.match(re)
    // sendResponse({count: matches.length})

    //Extracts all the usefully hyperlinks and pushes it into an array
    var x= document.querySelectorAll("a");
    var myarray = []
    for (var i=0;i<x.length; i++){
        var nametext=x[i].textContent;
        var cleantext= nametext.replace(/\s+/g,' ').trim();
        var cleanlink= x[i].href;
        // myarray.push([cleantext,cleanlink]);
        myarray.push(cleanlink);
    };
    sendResponse({count: matches.length,list:myarray,len:x.length})
})