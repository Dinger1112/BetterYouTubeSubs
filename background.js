let stop_loading_vids = false

browser.runtime.onMessage.addListener((obj) => {
    if (obj.type == 'stop_loading_vids')
        stop_loading_vids = obj.message
});

// browser.webRequest.onBeforeRequest.addListener(
//     async (details) => {
//         const tabs = await browser.tabs.query({ currentWindow: true, active: true });
//         let url;
//         for (let t of tabs) {
//             if (t.id == details.tabId) {
//                 url = t.url;
//                 break;
//             }
//         }
//         if (url.includes('/feed/subscriptions') && stop_loading_vids && !details.url.includes('edit_playlist')) {
//             return { cancel: true };
//         }
//     },
//     { urls: ['*://www.youtube.com/youtubei/v1/browse*'] },
//     ['blocking']
// );