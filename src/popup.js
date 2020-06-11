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
    const div = document.createElement('div')
    div.textContent = res.count.toString() + ' appearance'
    document.body.appendChild(div)

    //Outputs all the hyperlinks in the web page
    var totalLinks = res.len;

    for (var i = 0; i < totalLinks; i++) {
        var textlink = res.list[i].toString();
        if (textlink.indexOf("http://") == 0 || textlink.indexOf("https://") == 0) {

            //Create checkboxes for each hyperlinks
            var check = document.createElement("INPUT");
            check.setAttribute("type", "checkbox");
            check.id = res.list[i].toString();



            //Create label for each checkboxes for each hyperlinks
            var label = document.createElement("label");
            label.setAttribute('for', res.list[i].toString());
            label.appendChild(document.createTextNode(res.list[i].toString()));

            //Lists all the hyperlinks as checkboxes with linebreak between each of them
            container.appendChild(check);
            container.appendChild(label);
            linebreak = document.createElement("br");
            container.appendChild(linebreak);
        }
    }
    //Creates button at the end of the list
    var go = document.createElement("BUTTON");
    go.id="go";
    go.innerText = "Go!";
    document.body.appendChild(go);
    //A function to save all the checked hyperlinks to an array
    go.onclick = function respond () {
        var container=document.getElementById("container");
        var checklist=container.children;
        var checkboxesChecked=[];         //Saves all the checked hyperlinks
        var num_clicked_links=0;
        //If the checkbox is checked, then add it to the array
        for(var j=0;j<res.len;j++){
            if(checklist[j].checked==true){
                checkboxesChecked.push(checklist[j].id);
                num_clicked_links=num_clicked_links+1;
                // alert(checklist[j].id);
            }
        }
        //Opens the checked hyperlinks
        for(var k=0; k<num_clicked_links;k++){
            //Opens the checked hyperlinks in new tabs in same window
            chrome.tabs.create({url:checkboxesChecked[k]});

            //Opens the checked hyperlinks in new window
            // window.open(checkboxesChecked[k],'_wnd'+k,'_self');
        }

    }


}