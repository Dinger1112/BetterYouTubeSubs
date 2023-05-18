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

setTimeout(() => {
    if (window.location.pathname == '/feed/subscriptions' && !is_setup)
        setup()
}, 2000);

window.addEventListener('yt-navigate-finish', () => {
    if (window.location.pathname == '/feed/subscriptions') {
        if(!is_setup) 
            setup()
        else {
            setTimeout(() => {
                applyChannelFilters()
                applyFilters()
            }, 1500)
            setTimeout(() => {
                applyChannelFilters()
                applyFilters()
            }, 3000)
        }
    } else {
        for (let vid of document.getElementsByTagName('ytd-grid-video-renderer'))
            vid.style.display = 'inline-block'
    }
})

function setup() {
    subs_dom = document.querySelector('ytd-browse[page-subtype="subscriptions"]')
    
    browser.storage.sync.get().then((value) => {
        if (value.white_list != undefined) {
            white_list = value.white_list
            black_list = value.black_list
            applyChannelFilters()
            moveVideos()
        }
        if (value.type != undefined) 
            fav_type = value.type
        if (value.show != undefined)
            fav_show = value.show
        if (value.persist == 'Yes') {
            favorite.innerText = '★'
            //for some reason these switches don't work if i put it into a function, look into it in the future
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
        }
        new MutationObserver((mutations) => {
            setTimeout(() => {
                applyChannelFilters()
                applyFilters()
            }, 1500)
            setTimeout(() => {
                applyChannelFilters()
                applyFilters()
            }, 3000)
        }).observe(subs_dom.querySelector('#contents'), {childList: true})
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
    // let grid_mode = subs_dom.querySelector('[aria-label="Switch to grid view"]').querySelector('path').getAttribute('d') == 
    //     'M2,4h6v7H2V4z M2,20h6v-7H2V20z M9,11h6V4H9V11z M9,20h6v-7H9V20z M16,4v7h6V4H16z M16,20h6v-7h-6V20z' 
    // let vids = grid_mode ? subs_dom.getElementsByTagName('ytd-rich-item-renderer') : subs_dom.getElementsByTagName('ytd-video-renderer')
    let vids = subs_dom.getElementsByTagName('ytd-rich-item-renderer')
    for (let vid of vids) {
        let progress = vid.querySelector('#progress')
        try {progress = progress.style.width.slice(0, -1)}
        catch(err) {progress = 0}
        let is_live = (vid.querySelector('#metadata-line').textContent.search('Streamed') != -1 || 
                        vid.querySelector('#metadata-line').textContent.search('Scheduled') != -1 || 
                        //(grid_mode ? vid.querySelector('.badge-style-type-live-now-alternate') != null : vid.querySelector('#badges').textContent.search('LIVE') != -1)
                        vid.querySelector('.badge-style-type-live-now-alternate') != null
                    )
        let is_short = vid.querySelector('#overlays').firstChild.getAttribute('overlay-style') == 'SHORTS'
        if (((videos && !is_live && !is_short) || (shorts && is_short) || (live_streams && is_live)) && ((unwatched && progress < 15) || (continue_watching && progress >= 15 && progress <= 80) || (finished && progress > 80))) {
            // if (grid_mode)
                vid.style.display = 'inline-block'
            // else {
            //     let item_section_renderer = vid.closest('ytd-item-section-renderer')
            //     if (item_section_renderer.isSameNode(item_section_renderer.parentNode.firstChild)){
            //         vid.parentNode.parentNode.style.display = 'block'
            //         item_section_renderer.querySelector('#image-container').style.display = 'flex'
            //     } else {
            //         vid.parentNode.parentNode.style.display = 'block'
            //         item_section_renderer.style.display = 'block'
            //     }
            // }
        }
        else {
            // if (grid_mode)
                vid.style.display = 'none'
            // else {
            //     let item_section_renderer = vid.closest('ytd-item-section-renderer')
            //     if (item_section_renderer.isSameNode(item_section_renderer.parentNode.firstChild)) {
            //         vid.parentNode.parentNode.style.display = 'none'
            //         item_section_renderer.querySelector('#image-container').style.display = 'none'
            //     } else
            //         item_section_renderer.style.display = 'none'
            // }
        }
    }
    moveVideos()
}

function moveVideos() {
    let grid_rows = subs_dom.getElementsByTagName('ytd-rich-grid-row')
    for (let index = 0; index < grid_rows.length; index++) {
        row = grid_rows[index]
        let items_per_row = Number(getComputedStyle(row).getPropertyValue('--ytd-rich-grid-items-per-row'))
        let row_contents = row.querySelector('#contents')
        let row_vids = []
        for (let v of row.getElementsByTagName('ytd-rich-item-renderer')) {
            if (v.style.display != 'none') {
                row_vids.push(v)
            }
        }
        let row_length = row_vids.length
        if (row_length < items_per_row) {
            for (let i = index+1; i < grid_rows.length; i++) {
                next_row_vids = grid_rows[i].getElementsByTagName('ytd-rich-item-renderer')
                for (let j = 0; j < next_row_vids.length; j++) {
                    if (next_row_vids[j].style.display != 'none') {
                        row_contents.appendChild(next_row_vids[j])
                        row_length++
                        j--
                    }
                    if (row_length == items_per_row)
                        break
                }
                if (row_length == items_per_row)
                    break
            }
        } else if (row_length > items_per_row) {
            for (let v of row_vids.slice(items_per_row).reverse()) {
                grid_rows[index+1].querySelector('#contents').prepend(v)
            }
        }
    }
}

function passesWhiteList(channel, title) {
    let isChannelInWhiteList = false
    for (let obj of white_list) {
        if (channel == obj.channel.toLowerCase()) {
            isChannelInWhiteList = true
            if (title.search('\\b' + obj.title.toLowerCase() + '\\b') != -1) 
                return true
        }
    }
    return !isChannelInWhiteList
}

function passesBlackList(channel, title) {
    for (let obj of black_list)
        if (channel == obj.channel.toLowerCase() && title.search('\\b' + obj.title.toLowerCase() + '\\b') != -1) 
            return false
    return true
}

function applyChannelFilters() {
    // let grid_mode = subs_dom.querySelector('[aria-label="Switch to grid view"]').querySelector('path').getAttribute('d') == 
    //     'M2,4h6v7H2V4z M2,20h6v-7H2V20z M9,11h6V4H9V11z M9,20h6v-7H9V20z M16,4v7h6V4H16z M16,20h6v-7h-6V20z'  
    //let vids = grid_mode ? subs_dom.getElementsByTagName('ytd-rich-item-renderer') : subs_dom.getElementsByTagName('ytd-video-renderer')
    let vids = subs_dom.getElementsByTagName('ytd-rich-item-renderer')
    for (let i = 0; i < vids.length; i++) {
        let channel = vids[i].querySelector('#channel-name').querySelector('a').innerText.toLowerCase()
        let title = vids[i].querySelector('#video-title').innerText.toLowerCase()
        if (!(passesWhiteList(channel, title) && passesBlackList(channel, title))) {
            // if (grid_mode)
                vids[i].remove()
            // else {
            //     let item_section_renderer = vids[i].closest('ytd-item-section-renderer')
            //     if (item_section_renderer.isSameNode(item_section_renderer.parentNode.firstChild)) {
            //         vids[i].parentNode.parentNode.remove()
            //         item_section_renderer.querySelector('#image-container').remove()
            //     } else
            //         item_section_renderer.querySelector('#contents').remove()
            // }
            i--
        }
    }
}