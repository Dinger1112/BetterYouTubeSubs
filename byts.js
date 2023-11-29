let subs_dom
let is_setup = false

let videos = true
let shorts = true
let live_streams = true
let unwatched = true
let continue_watching = true
let finished = true

let videos_prev = true
let shorts_prev = true
let live_streams_prev = true
let unwatched_prev = true
let continue_watching_prev = true
let finished_prev = true
let type_status_prev = ''
let show_status_prev = ''

let white_list = []
let black_list = []
let fav_type = "Videos"
let fav_show = "Unwatched"
let slow_move_videos = false

let WAIT_TIME = 1000
let width = 0

setTimeout(() => {
    if (window.location.pathname == '/feed/subscriptions' && !is_setup)
        setup()
}, 2000);

// window.addEventListener('yt-navigate-start', () => {
//     browser.runtime.sendMessage({ type: 'stop_loading_vids', message: false })
// })
// window.addEventListener('yt-navigate-finish', () => {
//     browser.runtime.sendMessage({ type: 'stop_loading_vids', message: true })
// })
// window.addEventListener('popstate', () => {
//     if(subs_dom.getElementsByTagName('ytd-rich-item-renderer').length == 0)
//         browser.runtime.sendMessage({ type: 'stop_loading_vids', message: false })
// })
// browser.runtime.sendMessage({ type: 'stop_loading_vids', message: true })
document.querySelector('#video-preview').remove()

window.addEventListener('yt-navigate-finish', () => {
    if (window.location.pathname == '/feed/subscriptions') {
        if(!is_setup) 
            setup()
        else {
            setTimeout(() => {
                applyChannelFilters()
                applyFilters()
                removeDuplicates()
                moveVideos()
            }, WAIT_TIME);
        }
    } else {
        setTimeout(() => {
            for (let vid of document.getElementsByTagName('ytd-rich-item-renderer'))
                vid.classList.remove('hidden')
        }, 2000);
    }
})

new MutationObserver((mutations) => {
    if (window.location.pathname != '/feed/subscriptions') {
        for (let m of mutations) {
            for (let n of m.addedNodes) {
                if (n.tagName == 'YTD-CONTINUATION-ITEM-RENDERER') {
                    for (let vid of document.getElementsByTagName('ytd-rich-item-renderer'))
                        vid.classList.remove('hidden')
                }     
            }
        }
    }
}).observe(document.documentElement, { subtree: true, childList: true })

function setup() {
    subs_dom = document.querySelector('ytd-browse[page-subtype="subscriptions"]')
    
    browser.storage.sync.get().then((value) => {
        if (value.alt_move_vids != undefined && value.alt_move_vids == 'Yes')
            slow_move_videos = true
        if (value.white_list != undefined) {
            white_list = value.white_list
            black_list = value.black_list
            setTimeout(() => {
                if (!slow_move_videos)
                    width = subs_dom.querySelector('ytd-rich-item-renderer').offsetWidth
                applyChannelFilters()
                moveVideos()
            }, 500);
        }
        if (value.type != undefined) 
            fav_type = value.type
        if (value.show != undefined)
            fav_show = value.show
    })

    // setTimeout(() => {
    //     let continue_element = subs_dom.querySelector('ytd-continuation-item-renderer')
    //     continue_element.insertAdjacentElement('beforebegin', show_more)
    //     subs_dom.querySelector('#ghost-cards').classList.add('hidden')
    //     subs_dom.querySelector('#spinner').classList.add('hidden')
    // }, 2000);

    // let show_more = document.createElement('div')
    // show_more.classList.add('btn', 'show_more')
    // show_more.innerText = 'SHOW MORE'
    // show_more.onclick = () => {
    //     window.scrollBy(0, 1000)
    //     subs_dom.querySelector('#ghost-cards').classList.remove('hidden')
    //     subs_dom.querySelector('#spinner').classList.remove('hidden')
    //     show_more.style.height = '2000px'
    //     browser.runtime.sendMessage({ type: 'stop_loading_vids', message: false })
    //     window.scrollBy(0, -1)
    //     setTimeout(() => {
    //         window.scrollBy(0, 1)
    //         show_more.style.height = 'initial'
    //     }, 20)
        
    //     setTimeout(() => {
    //         browser.runtime.sendMessage({ type: 'stop_loading_vids', message: true })
    //         applyChannelFilters()
    //         applyFilters() 
    //         removeDuplicates()
    //         moveVideos()
    //         let i = setInterval(() => {
    //             let continue_element = subs_dom.querySelector('ytd-continuation-item-renderer')
    //             if (subs_dom.querySelector('.show_more') == null) {
    //                 continue_element.insertAdjacentElement('beforebegin', show_more)
    //                 show_more.removeAttribute('hidden')
    //                 clearInterval(i)
    //             }
    //         }, 1000);
    //         subs_dom.querySelector('#ghost-cards').classList.add('hidden')
    //         subs_dom.querySelector('#spinner').classList.add('hidden')
    //     }, WAIT_TIME)
    // }

    // window.addEventListener('yt-navigate-finish', () => {
    //     setTimeout(() => {
    //         let continue_element = subs_dom.querySelector('ytd-continuation-item-renderer')
    //         continue_element.insertAdjacentElement('beforebegin', show_more)
    //         subs_dom.querySelector('#ghost-cards').classList.add('hidden')
    //         subs_dom.querySelector('#spinner').classList.add('hidden')
    //     }, WAIT_TIME);
    // })

    let block = document.createElement('div')
    block.style.marginTop = window.innerHeight + 'px'
    block.style.width = '100%'
    let continue_element = subs_dom.querySelector('ytd-continuation-item-renderer')
    continue_element.insertAdjacentElement('beforebegin', block)
    setTimeout(() => {
        new MutationObserver((mutations) => {
            let nodes = mutations[0].addedNodes
            for (let node of nodes) {
                if (node.tagName == 'YTD-RICH-GRID-ROW' || node.tagName == 'YTD-CONTINUATION-ITEM-RENDERER') {
                    let continue_element = subs_dom.querySelector('ytd-continuation-item-renderer')
                    continue_element.insertAdjacentElement('beforebegin', block)
                    setTimeout(() => {
                        applyChannelFilters()
                        applyFilters()
                        removeDuplicates()
                        moveVideos()
                        window.scrollTo(0,0)
                    }, WAIT_TIME)
                }
            }
        }).observe(subs_dom.querySelector('#contents'), {childList: true})
    }, 1000);

    window.addEventListener('resize', () => {
        setTimeout(() => {
            // continue_element = subs_dom.querySelector('ytd-continuation-item-renderer')
            // continue_element.insertAdjacentElement('beforebegin', show_more)
            // subs_dom.querySelector('#ghost-cards').classList.add('hidden')
            // subs_dom.querySelector('#spinner').classList.add('hidden')
            window.scrollTo(0,0)
            let block = document.createElement('div')
            block.style.marginTop = window.innerHeight + 'px'
            let continue_element = subs_dom.querySelector('ytd-continuation-item-renderer')
            continue_element.insertAdjacentElement('beforebegin', block)
            applyChannelFilters()
            applyFilters()
            removeDuplicates()
            moveVideos()
        }, WAIT_TIME);
    })

    let show = document.createElement('div')

    let show_btn = document.createElement('div')
    show_btn.innerText = 'SHOW'
    show_btn.classList.add('btn')
    show_btn.onclick = () => {
        if (!(shorts && !videos && !live_streams)) {
            show_dropdown.classList.toggle('hidden')
            type_dropdown.classList.add('hidden')
        }
    }

    let show_dropdown = document.createElement('div')
    show_dropdown.classList.add('dropdown_content')
    show_dropdown.classList.add('hidden')
    show_dropdown.onclick = () => {
        favorite.innerText = '☆'
        applyFilters()
        moveVideos()
    }

    let show_all = document.createElement('div')
    show_all.innerText = 'All'
    show_all.onclick = () => {
        unwatched = true
        continue_watching = true
        finished = true
        show_status.innerText = ''
    }

    let show_unwatched = document.createElement('div')
    show_unwatched.innerText = 'Unwatched'
    show_unwatched.onclick = () => {
        unwatched = true
        continue_watching = false
        finished = false
        show_status.innerText = 'UNWATCHED'
    }

    let show_continue_watching = document.createElement('div')
    show_continue_watching.innerText = 'Continue Watching'
    show_continue_watching.onclick = () => {
        unwatched = false
        continue_watching = true
        finished = false
        show_status.innerText = 'CONTINUE WATCHING'
    }

    let show_finished = document.createElement('div')
    show_finished.innerText = 'Finished'
    show_finished.onclick = () => {
        unwatched = false
        continue_watching = false
        finished = true
        show_status.innerText = 'FINISHED'
    }

    show_dropdown.appendChild(show_all)
    show_dropdown.appendChild(show_unwatched)
    show_dropdown.appendChild(show_continue_watching)
    show_dropdown.appendChild(show_finished)
    show.appendChild(show_btn)
    show.appendChild(show_dropdown)

    let type = document.createElement('div')

    let type_btn = document.createElement('div')
    type_btn.innerText = 'TYPE'
    type_btn.classList.add('btn')
    type_btn.onclick = () => {
        type_dropdown.classList.toggle('hidden')
        show_dropdown.classList.add('hidden')
    }

    let type_dropdown = document.createElement('div')
    type_dropdown.classList.add('dropdown_content')
    type_dropdown.classList.add('hidden')
    type_dropdown.onclick = () => {
        favorite.innerText = '☆'
        applyFilters()
        moveVideos()
    }

    let type_all = document.createElement('div')
    type_all.innerText = 'All'
    type_all.onclick = () => {
        videos = true
        shorts = true
        live_streams = true
        type_status.innerText = ''
    }

    let type_videos = document.createElement('div')
    type_videos.innerText = 'Videos'
    type_videos.onclick = () => {
        videos = true
        shorts = false
        live_streams = false
        type_status.innerText = 'VIDEOS'
    }

    let type_shorts = document.createElement('div')
    type_shorts.innerText = 'Shorts'
    type_shorts.onclick = () => {
        videos = false
        shorts = true
        live_streams = false
        type_status.innerText = 'SHORTS'
        unwatched = true
        continue_watching = true
        finished = true
        show_status.innerText = ''
    }

    let type_live = document.createElement('div')
    type_live.innerText = 'Live Streams'
    type_live.onclick = () => {
        videos = false
        shorts = false
        live_streams = true
        type_status.innerText = 'LIVE STREAMS'
    }

    type_dropdown.appendChild(type_all)
    type_dropdown.appendChild(type_videos)
    type_dropdown.appendChild(type_shorts)
    type_dropdown.appendChild(type_live)
    type.appendChild(type_btn)
    type.appendChild(type_dropdown)

    let favorite = document.createElement('button')
    favorite.classList.add('fav_btn')
    favorite.innerText = '☆'
    favorite.onclick = () => {
        if (favorite.innerText == '★') {
            videos = videos_prev
            shorts = shorts_prev
            live_streams = live_streams_prev
            unwatched = unwatched_prev
            continue_watching = continue_watching_prev
            finished = finished_prev
            type_status.innerText = type_status_prev
            show_status.innerText = show_status_prev
            favorite.innerText = '☆'
        } else {
            videos_prev = videos
            shorts_prev = shorts
            live_streams_prev = live_streams
            unwatched_prev = unwatched
            continue_watching_prev = continue_watching
            finished_prev = finished
            type_status_prev = type_status.innerText
            show_status_prev = show_status.innerText
            switch (fav_type) {
                case 'All':
                    videos = true
                    shorts = true
                    live_streams = true
                    type_status.innerText = ''
                    break
                case 'Videos':
                    videos = true
                    shorts = false
                    live_streams = false
                    type_status.innerText = 'VIDEOS'
                    break
                case 'Shorts':
                    videos = false
                    shorts = true
                    live_streams = false
                    type_status.innerText = 'SHORTS'
                    break
                case 'Live Streams':
                    videos = false
                    shorts = false
                    live_streams = true
                    type_status.innerText = 'LIVE STREAMS'
                    break
            }
            switch (fav_show) {
                case 'All':
                    unwatched = true
                    continue_watching = true
                    finished = true
                    show_status.innerText = ''
                    break
                case 'Unwatched':
                    unwatched = true
                    continue_watching = false
                    finished = false
                    show_status.innerText = 'UNWATCHED'
                    break
                case 'Continue Watching':
                    unwatched = false
                    continue_watching = true
                    finished = false
                    show_status.innerText = 'CONTINUE WATCHING'
                    break
                case 'Finished':
                    unwatched = false
                    continue_watching = false
                    finished = true
                    show_status.innerText = 'FINISHED'
                    break
            }
            favorite.innerText = '★'
        }
        applyFilters()
        moveVideos()
    }

    let status = document.createElement('div')
    status.classList.add('status')

    let show_status = document.createElement('div')
    show_status.classList.add('show_status')

    let type_status = document.createElement('div')
    type_status.classList.add('type_status')
    
    status.appendChild(show_status)
    status.appendChild(type_status)

    let title_container = subs_dom.querySelector('ytd-rich-section-renderer').querySelector('#title-container')
    title_container.insertBefore(show, title_container.childNodes[5])
    title_container.insertBefore(type, title_container.childNodes[5])
    title_container.insertBefore(favorite, title_container.childNodes[5])
    title_container.insertBefore(status, title_container.childNodes[5])

    window.addEventListener('click', (event) => {
        if (!event.target.matches('.btn')) {
            show_dropdown.classList.add('hidden')
            type_dropdown.classList.add('hidden')
        }
    })

    is_setup = true
}

function applyFilters() {
    let vids = subs_dom.getElementsByTagName('ytd-rich-item-renderer')
    for (let vid of vids) {
        if (!vid.hasAttribute('is-slim-media')) {
            let progress = vid.querySelector('#progress')
            try {progress = progress.style.width.slice(0, -1)}
            catch(err) {progress = 0}
            let is_live = (vid.querySelector('#metadata-line').textContent.includes('Streamed') || 
                            vid.querySelector('#metadata-line').textContent.includes('Scheduled') || 
                            (vid.querySelector('.badge-style-type-live-now-alternate') != null && vid.querySelector('.badge-style-type-live-now-alternate').textContent == 'LIVE')
                        )
            if (((videos && !is_live) || (live_streams && is_live)) && ((unwatched && progress < 15) || (continue_watching && progress >= 15 && progress <= 80) || (finished && progress > 80)))
                vid.classList.remove('hidden')
            else
                vid.classList.add('hidden')
        }
    }
    if (shorts)
        subs_dom.getElementsByTagName('ytd-rich-section-renderer')[1].classList.remove('hidden')
    else
        subs_dom.getElementsByTagName('ytd-rich-section-renderer')[1].classList.add('hidden')
}

function moveVideos() {
    // if (slow_move_videos) {
    //     let grid_rows = subs_dom.getElementsByTagName('ytd-rich-grid-row')
    //     for (let index = 0; index < grid_rows.length; index++) {
    //         let row = grid_rows[index]
    //         let items_per_row = Number(getComputedStyle(row).getPropertyValue('--ytd-rich-grid-items-per-row'))
    //         let row_contents = row.querySelector('#contents')
    //         let row_length = 0
    //         for (let v of row.getElementsByTagName('ytd-rich-item-renderer')) {
    //             if (!v.classList.contains('hidden'))
    //                 row_length++
    //         }
    //         if (row_length < items_per_row) {
    //             for (let i = index+1; i < grid_rows.length; i++) {
    //                 let next_row_contents = grid_rows[i].querySelector('#contents')
    //                 while (row_length != items_per_row && next_row_contents.children.length != 0) {
    //                     let first_child = next_row_contents.firstElementChild
    //                     row_contents.appendChild(first_child)
    //                     if (!first_child.classList.contains('hidden'))
    //                         row_length++
    //                 }
    //             }
    //         } else if (row_length > items_per_row) {
    //             let next_row_contents = grid_rows[index+1].querySelector('#contents')
    //             while (row_length != items_per_row) {
    //                 let last_child = row_contents.lastElementChild
    //                 next_row_contents.prepend(last_child)
    //                 if (!last_child.classList.contains('hidden'))
    //                     row_length--
    //             }
    //         }
    //     }
    // } else {
        for (let vid of subs_dom.getElementsByTagName('ytd-rich-item-renderer')) {
            if (!vid.hasAttribute('is-slim-media'))
                vid.style.width = width + 'px'
        }
        for (let row of subs_dom.getElementsByTagName('ytd-rich-grid-row')) {
            let items_per_row = Number(getComputedStyle(row).getPropertyValue('--ytd-rich-grid-items-per-row'))
            let count = 0
            for (let vid of row.getElementsByTagName('ytd-rich-item-renderer')) {
                if (!vid.classList.contains('hidden'))
                    count++
            }
            if (count != 0)
                row.style.width = (100 * (count / items_per_row)) + '%'
            else
                row.style.width = 0 + '%'
        }
    //}
}

function removeDuplicates() {
    let vids = subs_dom.getElementsByTagName('ytd-rich-item-renderer')
    let duplicates = []
    for (let i = vids.length-1; i >= 0; i--) {
        for (let j = 0; j < i; j++) {
            if (vids[i].querySelector('a').href == vids[j].querySelector('a').href)
                duplicates.push(vids[j])
        }
    }
    for (let v of duplicates)
        v.remove()
}

function passesWhiteList(channel, title) {
    let isChannelInWhiteList = false
    for (let obj of white_list) {
        if (channel == obj.channel.toLowerCase()) {
            isChannelInWhiteList = true
            if (title.includes(obj.title.toLowerCase())) 
                return true
        }
    }
    return !isChannelInWhiteList
}

function passesBlackList(channel, title) {
    for (let obj of black_list)
        if (channel == obj.channel.toLowerCase() && title.includes(obj.title.toLowerCase())) 
            return false
    return true
}

function applyChannelFilters() {
    let vids = subs_dom.getElementsByTagName('ytd-rich-item-renderer')
    let to_remove = []
    for (let v of vids) {
        if (!v.hasAttribute('is-slim-media')) {
            let channel = v.querySelector('#channel-name').querySelector('a').innerText.toLowerCase()
            let title = v.querySelector('#video-title').innerText.toLowerCase()
            if (!(passesWhiteList(channel, title) && passesBlackList(channel, title))) {
                to_remove.push(v)
            }
        }
    }
    for (let v of to_remove)
        v.remove()
}