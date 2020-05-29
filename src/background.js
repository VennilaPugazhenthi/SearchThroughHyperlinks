window.bears = {}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    window.bears[request.url] = request.count
})

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({url: 'popup.html'})
})

chrome.contextMenus.create({
    type:'checkbox',
    id:'list',
    title:'list'+'%s',
    contexts:['link','page'],
    checked:true,
    visible:true
})