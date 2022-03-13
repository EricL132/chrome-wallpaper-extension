chrome.identity.getProfileUserInfo(function(info) { email = info.email;});

// Listener sends user email back to page
chrome.extension.onMessage.addListener(async function(request, sender, sendResponse) {
    sendResponse( {email: email})
});

