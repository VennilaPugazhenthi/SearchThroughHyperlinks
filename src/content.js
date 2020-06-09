chrome.runtime.onMessage.addListener(function (request,sender, sendResponse) {
    //Finds the matches of the searched word
    const re = new RegExp(request,'gi')
    const matches = document.documentElement.innerText.match(re)


    //Changes the matched words to blue color including the tags
    // document.documentElement.innerHTML=document.documentElement.innerHTML.replace(re,function(match) {
    //      return match.fontcolor('blue');
    // });

    //Changes the matched words to blue color excluding the tags
    // document.documentElement.innerHTML=document.documentElement.innerHTML.replace(new RegExp(request+"(?![^<>]*>)","gi"),function(match) {
    //     return match.fontcolor('blue');
    //     // return document.documentElement.innerHTML.replace(match,"<mark>"+match+"</mark>");
    // });

    //Highlights the matched words to light yellow color excluding the tags
    var match= new RegExp(request+"(?![^<>]*>)","gi");
    document.documentElement.innerHTML=document.documentElement.innerHTML.replace(match,function (match) {
        return ("<mark style='background-color: #FFFF99;'>"+match+"</mark>");

    });




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

