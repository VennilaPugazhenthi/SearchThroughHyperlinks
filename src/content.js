chrome.runtime.onMessage.addListener(function (request,sender, sendResponse) {
    //Finds the matches of the searched word
    const re = new RegExp(request,'gi')
    const matches = document.documentElement.innerText.match(re)

    //Highlights the matched words to light yellow color excluding the tags but also highlights the functions of html
    // var match= new RegExp(request+"(?![^<>]*>)","gi");
    // document.documentElement.innerHTML=document.documentElement.innerHTML.replace(match,function (match) {
    //     return ("<mark style='background-color: #FFFF99;'>"+match+"</mark>");
    // });

    //Changes the font color of matched word to blue
    // document.documentElement.innerHTML=document.documentElement.innerHTML.replace(re,function (match) {
    //     return match.fontcolor('blue');
    // });

    // Highlights the matched words that are just text
    var parents=[];
    var children=[];

    //Find all text nodes, and add their parents to a list
    recursiveFindTextNodes(0,document.body,function (parent, node) {
        if(node.data.match(re)){
            parents.push(parent);
            children.push(node);
        }
    });

    //The list only contains elements with text as their children
    //Loop through the list and replace any matches
    var count_color=0;
    for(let i=0; i< parents.length; i++){
        var parent = parents[i];
        var node = children[i];
        var div = document.createElement("span");
        parent.replaceChild(div,node);
        div.innerHTML = node.data.replace(re, function (match) {
            return "<mark style='background-color:#FFFF99;'>"+match+"</mark>";
        });
        count_color=count_color+1;
    }
    //Logs number of highlights
    console.log(count_color.toString());

    //Extracts all the usefully hyperlinks and pushes it into an array
    var x= document.querySelectorAll("a");
    var myarray = []
    for (var i=0;i<x.length; i++){
        var nametext=x[i].textContent;
        var cleantext= nametext.replace(/\s+/g,' ').trim();
        var cleanlink= x[i].href;
        // myarray.push([cleantext,cleanlink]);
        myarray.push(cleanlink);
    }

    console.log(myarray[1]);
    // var http = new XMLHttpRequest();
    // http.open("GET",myarray[1]);
    // http.onreadystatechange=(e)=>{
    //     urlResult = http.responseText;
    //     var parse = new DOMParser();
    //     urlResult = parse.parseFromString(urlResult,'text/html').body.innerText.match(request);
    //     console.log("HEYY");
    //     console.log(urlResult.length);
    // }

    sendResponse({count: matches.length,list:myarray,len:x.length})
})

function recursiveFindTextNodes(parent, node, func) {
    // nodeType 3 designates text
    if(parent && node.nodeType === 3){
        // Pass the text node and its parent to the handler function
        func(parent, node);
    }else{
        // Loop through children and make recursive calls
        for(let i=0; i<node.childNodes.length; i++){
            recursiveFindTextNodes(node, node.childNodes[i],func);
        }
    }

}