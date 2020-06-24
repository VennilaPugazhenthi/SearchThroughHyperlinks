document.addEventListener('DOMContentLoaded',function () {
    var btn = document.getElementById("press");
    btn.addEventListener("click",clicked);

});

function clicked() {
    createTable();
    var val=document.getElementById("findInput").value;


    chrome.tabs.query({currentWindow:true, active:true},
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id,val,setCount)
        })
}
function createTable() {
    //Table Headers
    var tableHeader = ['','Hyperlinks','Appearances'];
    var empTable=document.createElement('table');
    empTable.setAttribute('id','empTable');
    empTable.id='empTable';

    var tr = empTable.insertRow(-1);
    for(var h=0;h<tableHeader.length;h++){
        var th = document.createElement('th');
        th.innerHTML= tableHeader[h];
        tr.appendChild(th);
    }
    var div= document.getElementById('displayTable');
    div.appendChild(empTable);
}

function setCount(res) {

    //Outputs number of appearance
    const div = document.createElement('div')
    div.textContent = res.count.toString() + ' appearance'
    document.body.appendChild(div)

}
var totalLinks=0;
chrome.runtime.onMessage.addListener(function (message,sender,sendResponse) {

        if(totalLinks!==message.limit-1){

            var textlink = message.url;
            var value = message.num;

            var empTable = document.getElementById('empTable');
            var rowCount= empTable.rows.length;
            var tr =empTable.insertRow(rowCount);

            var td = document.createElement('td');

            td=tr.insertCell(0);
            //Create checkboxes for each hyperlinks
            var check = document.createElement("INPUT");
            check.setAttribute("type", "checkbox");
            check.id = textlink;
            td.appendChild(check);


            td=tr.insertCell(1);
            //Create label for each checkboxes for each hyperlinks
            var label = document.createElement("label");
            label.setAttribute('for', textlink);
            label.appendChild(document.createTextNode(textlink+' '+value));
            td.appendChild(label);

            td=tr.insertCell(2);
            td.appendChild(document.createTextNode(value));


            // Lists all the hyperlinks as checkboxes with linebreak between each of them
            // container.appendChild(check);
            // container.appendChild(label);
            // linebreak = document.createElement("br");
            // container.appendChild(linebreak);

            totalLinks+=1;
        }else{
            var textlink = message.url;
            var value = message.num;

            var empTable = document.getElementById('empTable');
            var rowCount= empTable.rows.length;
            var tr =empTable.insertRow(rowCount);

            var td = document.createElement('td');

            td=tr.insertCell(0);
            //Create checkboxes for each hyperlinks
            var check = document.createElement("INPUT");
            check.setAttribute("type", "checkbox");
            check.id = textlink;
            td.appendChild(check);

            td=tr.insertCell(1);
            //Create label for each checkboxes for each hyperlinks
            var label = document.createElement("label");
            label.setAttribute('for', textlink);
            label.appendChild(document.createTextNode(textlink+' '+value));
            // label.appendChild(document.createTextNode(res.list[i].toString()+res.list_num[i].toString());
            td.appendChild(label);

            td=tr.insertCell(2);
            td.appendChild(document.createTextNode(value));

            //Lists all the hyperlinks as checkboxes with linebreak between each of them
            // container.appendChild(check);
            // container.appendChild(label);
            // linebreak = document.createElement("br");
            // container.appendChild(linebreak);
            totalLinks+=1;

            //Creates button at the end of the list
            var go = document.createElement("BUTTON");
            go.id="go";
            go.innerText = "Go!";
            document.body.appendChild(go);
            //A function to save all the checked hyperlinks to an array
            go.onclick = function respond () {
                var container=document.getElementById("container");
                var checklist=container.children;
                // var checklist = container.getAttribute("type");
                var total = totalLinks*3;


                var checkboxesChecked=[];         //Saves all the checked hyperlinks
                var num_clicked_links=0;
                //If the checkbox is checked, then add it to the array
                for(var j=0;j<total;j++){
                    if(checklist[j].checked==true){
                        checkboxesChecked.push(checklist[j].id);
                        num_clicked_links=num_clicked_links+1;
                        // alert(checklist[j].id);
                    }
                }
                //Opens the checked hyperlinks
                var windowCreated=0;
                var windowCreatedID;
                for(var k=0; k<num_clicked_links;k++){
                    //Opens the checked hyperlinks in new tabs in same window
                    chrome.tabs.create({url:checkboxesChecked[k]});

                }
            }
        }

})