document.addEventListener('DOMContentLoaded', function () {
    var searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            onClick();
        }
    });
    var btn = document.getElementById("findBtn");
    btn.addEventListener("click", onClick);
});

function onClick() {
    createTable();
    var val = document.getElementById("searchInput").value;


    chrome.tabs.query({currentWindow: true, active: true},
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, val, setCount)
        })
}

function createTable() {
    //Table Headers
    var tableHeader = ['', 'Hyperlinks', 'Appearances'];
    var table = document.getElementById('displayTable');
    var headerRow = table.insertRow(-1);
    for (var i = 0; i < tableHeader.length; i++) {
        var headerCell = document.createElement('th');
        headerCell.innerHTML = tableHeader[i];
        headerRow.appendChild(headerCell);
    }
}

function setCount(res) {

    //Outputs number of appearance
    // const div = document.createElement('div')
    var div = document.getElementById('current_appearance');
    div.textContent = res.count.toString() + ' appearance'
    // document.body.appendChild(div)

}

var totalLinks = 0;


// global variables
var parent = null;            // 'parent' node
var items = new Array();      // array of 'child' nodes
var col = 2;                  // column for sorting
var N = 0;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    var url = message.url;
    var urlTitle = message.urlTitle;
    var occurrence = message.num;
    if (!urlTitle) {
        urlTitle = url;
    }
    if (totalLinks !== message.limit - 1) {
        insertRow(url, urlTitle, occurrence);
        totalLinks += 1;
    } else {
        insertRow(url, urlTitle, occurrence);
        totalLinks += 1;
        // alert("SORT")
        var sort = document.createElement("BUTTON");
        sort.id = "sort";
        sort.innerText = "Sort";
        sort.setAttribute('style', 'float:left;');
        document.body.appendChild(sort);
        sort.onclick = function sorting() {
            var table, rows, switching, i, x, y, shouldSwitch;
            table = document.getElementById('empTable');
            switching = true;

            while (switching) {
                switching = false;
                rows = table.rows;
                // alert(rows.length-1);
                for (i = 1; i < (rows.length - 1); i++) {
                    shouldSwitch = false;


                    x = rows[i].getElementsByTagName("TD")[2];
                    y = rows[i + 1].getElementsByTagName("TD")[2];
                    // alert(Number(x.innerText));
                    // alert(x.id);
                    if (Number(x.innerText) < Number(y.innerText)) {
                        // alert("IF");
                        shouldSwitch = true;
                        break;
                    }
                }
                if (shouldSwitch) {

                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                }
            }

        }

        //Creates button at the end of the list
        var go = document.createElement("BUTTON");
        go.id = "go";
        go.innerText = "Open";
        go.setAttribute('style', 'float:right;')
        document.body.appendChild(go);
        //A function to save all the checked hyperlinks to an array
        go.onclick = function respond() {
            // var container=document.getElementById("container");

            var grid = document.getElementById('empTable');
            var checklist = grid.getElementsByTagName("INPUT");
            // var checklist=container.children;

            // var total = totalLinks*3;
            var total = totalLinks;

            var checkboxesChecked = [];         //Saves all the checked hyperlinks
            var num_clicked_links = 0;
            //If the checkbox is checked, then add it to the array
            for (var j = 0; j < total; j++) {
                if (checklist[j].checked == true) {
                    checkboxesChecked.push(checklist[j].id);
                    num_clicked_links = num_clicked_links + 1;

                }
            }
            //Opens the checked hyperlinks
            var windowCreated = 0;
            var windowCreatedID;
            for (var k = 0; k < num_clicked_links; k++) {
                //Opens the checked hyperlinks in new tabs in same window
                chrome.tabs.create({url: checkboxesChecked[k]});

            }
        }
    }

})

function insertRow(url, urlTitle, occurrence) {
    var table = document.getElementById('displayTable');
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    var cell = document.createElement('td');


    cell = row.insertCell(0);
    //Create checkboxes for each hyperlinks
    var check = document.createElement("INPUT");
    check.setAttribute("type", "checkbox");
    check.id = url;
    cell.appendChild(check);


    cell = row.insertCell(1);
    //Create label for each checkboxes for each hyperlinks
    var label = document.createElement("a");
    label.setAttribute('href', url);
    label.setAttribute('style', "color:#0000FF;")
    label.appendChild(document.createTextNode(urlTitle));
    cell.appendChild(label);


    cell = row.insertCell(2);
    var num = document.createElement('num');
    num.innerText = occurrence;
    cell.appendChild(num);
}