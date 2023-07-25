let stop_loading_vids = false

browser.runtime.onMessage.addListener((obj) => {
    if (obj.type == 'stop_loading_vids')
        stop_loading_vids = obj.message
});

browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (details.documentUrl.includes('/feed/subscriptions') && stop_loading_vids && details.url.includes('browse') && !details.url.includes('edit_playlist'))
            return { cancel: true };
    },
    { urls: ['<all_urls>'] },
    ['blocking']
);