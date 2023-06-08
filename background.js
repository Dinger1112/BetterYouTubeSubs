let stop_loading_vids = false
let current_page

browser.runtime.onMessage.addListener((obj) => {
    if (obj.type == 'page')
        current_page = obj.message 
    else if (obj.type == 'stop_loading_vids')
        stop_loading_vids = obj.message
});

browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (current_page == '/feed/subscriptions' && stop_loading_vids && details.url.includes('browse'))
            return { cancel: true };
    },
    { urls: ['<all_urls>'] },
    ['blocking']
);