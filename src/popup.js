document.getElementById("press").addEventListener("click",clicked);
function clicked() {
    var val=document.getElementById("findInput").value;
    chrome.tabs.query({currentWindow:true, active:true},
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id,val)
        })
}