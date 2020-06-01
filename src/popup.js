document.getElementById("press").addEventListener("click",clicked);
function clicked() {
    var val=document.getElementById("findInput").value;
    chrome.tabs.query({currentWindow:true, active:true},
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id,val,setCount)
        })
}

function setCount(res) {
    //Outputs number of appearance
    const div =document.createElement('div')
    div.textContent=res.count.toString()+' appearance'

    document.body.appendChild(div)

    //Outputs all the hyperlinks in the web page
    var totalLinks=res.len;
    document.getElementById("links").innerHTML="";
    for (var i=0;i<totalLinks;i++){
        var textlink=res.list[i].toString();
        if(textlink.indexOf("http://")==0||textlink.indexOf("https://")==0){
            document.getElementById("links").innerHTML+=res.list[i].toString()+"<br/>";
        }

    }

}