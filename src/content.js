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
            // return "<mark style='background-color:#FFFF99;'>"+match+"</mark>";
            count_color=count_color+1;
            return "<mark style='background-color:#008000;'>"+match+"</mark>";
        });
    }
    //Logs number of highlights
    console.log("Number of highlights:",count_color.toString());

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


    // var xhr = new XMLHttpRequest();
    // // OPEN - type, url/file, async
    // xhr.open("GET",myarray[1],true);
    //
    // xhr.onreadystatechange = function(){
    //     console.log("READYSTATE: ",xhr.readyState);
    //     if(this.readyState == 4 && this.status == 200){
    //         console.log("Inside the xhr");
    //         var response= this.responseText;
    //
    //         var parse = new DOMParser();
    //
    //         var html_new = parse.parseFromString(response,'text/html');
    //         console.log(html_new);
    //         var match_new=html_new.documentElement.innerText.match(re);
    //
    //         var appear;
    //
    //         //Error Handling for appearence in list of links
    //         try{
    //             appear=match_new.length;
    //         }catch (err) {
    //             if(err instanceof TypeError){
    //                 appear=0;
    //             }else{
    //                 appear=0;
    //             }
    //         }
    //
    //         console.log("The appearence of searched word in new website is:",appear.toString());
    //     }
    // }
    // xhr.send();

    var numarray=[];
    for(var k=0; k<x.length; k++){
        var xhr = new XMLHttpRequest();
        // OPEN - type, url/file, async
        xhr.open("GET",myarray[k],true);

        xhr.onreadystatechange = function(){
            // console.log("READYSTATE: ",xhr.readyState);
            if(this.readyState == 4 && this.status == 200){
                // console.log("Inside the xhr");
                var response= this.responseText;

                var parse = new DOMParser();

                var html_new = parse.parseFromString(response,'text/html');
                console.log(html_new);
                var match_new=html_new.documentElement.innerText.match(re);

                var appear;

                //Error Handling for appearence in list of links
                try{
                    appear=match_new.length;
                }catch (err) {
                    if(err instanceof TypeError){
                        appear=0;
                    }else{
                        appear=0;
                    }
                }
                console.log("The appearence of searched word in new website is:",myarray[k],appear.toString());
                numarray.push(appear);
            }
        }
        xhr.send();
    }


    // readyState value
    // 0: request not initialized
    // 1: server connection established
    // 2: request received
    // 3: processing request
    // 4: request finished and response is ready


    // HTTP Statuses
    // 200: "OK"
    // 403: "Forbidden"
    // 404: "Not Found"

    // Error Handling for appearence of searched word in current web page
    var appear_current;
    try{
        appear_current=matches.length;
    }catch (e) {
        if(e instanceof TypeError){
            appear_current=0;
        }else{
            appear_current=0;
        }
    }

    sendResponse({count: appear_current,list:myarray,len:x.length})
    // sendResponse({count: matches.length,list:myarray,len:x.length,list_num:numarray})
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