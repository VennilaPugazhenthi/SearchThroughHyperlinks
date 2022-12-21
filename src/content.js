chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //Finds the matches of the searched word
    const re = new RegExp(request, 'gi')
    const matches = document.documentElement.innerText.match(re)

    // Error Handling for appearance of searched word in current web page
    var appear_current;
    try {
        appear_current = matches.length;
    } catch (e) {
        if (e instanceof TypeError) {
            appear_current = 0;
        } else {
            appear_current = 0;
        }
    }

    // Highlights the matched words that are just text
    var parents = [];
    var children = [];

    //Find all text nodes, and add their parents to a list
    recursiveFindTextNodes(0, document.body, function (parent, node) {
        if (node.data.match(re)) {
            parents.push(parent);
            children.push(node);
        }
    });

    //The list only contains elements with text as their children
    //Loop through the list and replace any matches
    var count_color = 0;
    for (let i = 0; i < parents.length; i++) {
        var parent = parents[i];
        var node = children[i];
        var div = document.createElement("span");
        parent.replaceChild(div, node);
        div.innerHTML = node.data.replace(re, function (match) {
            count_color = count_color + 1;
            return "<mark style='background-color:#FFF34D; border-radius: 5px;'>" + match + "</mark>";
        });
    }

    //Extracts all the usefully hyperlinks and pushes it into an array
    var extractedLinks = document.querySelectorAll("a");
    let hyperlinkMap = new Map();
    for (var i = 0; i < extractedLinks.length; i++) {
        var href_validility = extractedLinks[i].href.toString();
        if (href_validility.indexOf("http://") == 0 || href_validility.indexOf("https://") == 0) {
            var cleanlink = extractedLinks[i].href;
            if (!hyperlinkMap.has(cleanlink)) {
                var nametext = extractedLinks[i].textContent;
                var cleantext = nametext.replace(/\s+/g, ' ').trim();
                hyperlinkMap.set(cleanlink, cleantext);
            }
        }
    }

    getCountFromLinks(hyperlinkMap, re);

    sendResponse({count: appear_current, list: hyperlinkMap.keys(), len: hyperlinkMap.size})

})

function getCountFromLinks(hyperlinkMap, re) {
    var max = hyperlinkMap.size;
    for (let [link, linkText] of hyperlinkMap) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", link, true);
        xhr.timeout = 1500;
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = this.responseText;

                var parse = new DOMParser();

                var html_new = parse.parseFromString(response, 'text/html');

                var count_appearence = 0;
                //Find all text nodes, and add their parents to a list
                recursiveFindTextNodes(0, html_new.body, function (parent, node) {
                    if (node.data.match(re)) {
                        count_appearence++;
                    }
                });

                chrome.runtime.sendMessage({
                    url: this.responseURL.toString(),
                    urlTitle: linkText,
                    num: count_appearence.toString(),
                    limit: hyperlinkMap.size
                }, function (response) {
                    console.log(response);
                });
            }

            if (this.status == 403 || this.status == 404) {
                chrome.runtime.sendMessage({
                    url: this.responseURL.toString(),
                    urlTitle: linkText,
                    num: "0",
                    limit: hyperlinkMap.size
                }, function (response) {
                    console.log(response);
                });
            }
        }
        xhr.ontimeout = () => {
            hyperlinkMap.delete(link);
        };
        xhr.send();
    }
}

function recursiveFindTextNodes(parent, node, func) {
    // nodeType 3 designates text
    if (parent && node.nodeType === 3) {
        if (parent.tagName !== "SCRIPT" && parent.tagName !== "STYLE" && parent.tagName !== "IFRAME" && parent.tagName !== "CANVAS"
            && parent.tagName !== "META") {
            func(parent, node);
        }
    } else {
        // Loop through children and make recursive calls
        for (let i = 0; i < node.childNodes.length; i++) {
            recursiveFindTextNodes(node, node.childNodes[i], func);
        }
    }

}