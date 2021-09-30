let subs_dom
let is_setup = false

let videos = true
let live_streams = true
let unwatched = true
let continue_watching = true
let finished = true

let white_list = []
let black_list = []

window.addEventListener('yt-navigate-finish', function() {
    if (window.location.pathname == '/feed/subscriptions') {
        if(!is_setup) {
            setup()
        } else {
            setTimeout(() => {
                applyFilters()
                applyChannelFilters()
            }, 1000);
        }
    }
})

if (!is_setup && window.location.pathname == '/feed/subscriptions') {
    setup()
}

function setup() {
    let ytd_browse_list = document.getElementById('page-manager').getElementsByTagName('ytd-browse')
    for (ytd_browse of ytd_browse_list) {
        if (ytd_browse.getAttribute('page-subtype') == 'subscriptions') {
            subs_dom = ytd_browse
            break
        }
    }
    
    browser.storage.sync.get().then(function(value) {
        if (value.white_list != undefined){
            white_list = value.white_list
            black_list = value.black_list
            applyChannelFilters()
        }
    })

    let show = document.createElement('div')

    let show_btn = document.createElement('div')
    show_btn.innerText = 'SHOW'
    show_btn.classList.add('btn')
    show_btn.onclick = function(){
        show_dropdown.classList.toggle('hidden')
        type_dropdown.classList.add('hidden')
    }

    let show_dropdown = document.createElement('div')
    show_dropdown.classList.add('dropdown_content')
    show_dropdown.classList.add('hidden')

    let show_all = document.createElement('div')
    show_all.innerText = 'All'
    show_all.onclick = function(){
        unwatched = true
        continue_watching = true
        finished = true
        show_status.innerText = ''
        applyFilters()
    }

    let show_unwatched = document.createElement('div')
    show_unwatched.innerText = 'Unwatched'
    show_unwatched.onclick = function(){
        unwatched = true
        continue_watching = false
        finished = false
        show_status.innerText = 'UNWATCHED'
        applyFilters()
    }

    let show_continue_watching = document.createElement('div')
    show_continue_watching.innerText = 'Continue Watching'
    show_continue_watching.onclick = function(){
        unwatched = false
        continue_watching = true
        finished = false
        show_status.innerText = 'CONTINUE WATCHING'
        applyFilters()
    }

    let show_finished = document.createElement('div')
    show_finished.innerText = 'Finished'
    show_finished.onclick = function(){
        unwatched = false
        continue_watching = false
        finished = true
        show_status.innerText = 'FINISHED'
        applyFilters()
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
    type_btn.onclick = function(){
        type_dropdown.classList.toggle('hidden')
        show_dropdown.classList.add('hidden')
    }

    let type_dropdown = document.createElement('div')
    type_dropdown.classList.add('dropdown_content')
    type_dropdown.classList.add('hidden')

    let type_all = document.createElement('div')
    type_all.innerText = 'All'
    type_all.onclick = function(){
        videos = true
        live_streams = true
        type_status.innerText = ''
        applyFilters()
    }

    let type_videos = document.createElement('div')
    type_videos.innerText = 'Videos'
    type_videos.onclick = function(){
        videos = true
        live_streams = false
        type_status.innerText = 'VIDEOS'
        applyFilters()
    }

    let type_live = document.createElement('div')
    type_live.innerText = 'Live Streams'
    type_live.onclick = function(){
        videos = false
        live_streams = true
        type_status.innerText = 'LIVE STREAMS'
        applyFilters()
    }

    type_dropdown.appendChild(type_all)
    type_dropdown.appendChild(type_videos)
    type_dropdown.appendChild(type_live)
    type.appendChild(type_btn)
    type.appendChild(type_dropdown)

    let status = document.createElement('div')
    status.classList.add('status')

    let show_status = document.createElement('div')
    show_status.classList.add('show_status')

    let type_status = document.createElement('div')
    type_status.classList.add('type_status')
    
    status.appendChild(show_status)
    status.appendChild(type_status)

    let title_container 
    let divs = subs_dom.getElementsByTagName('div')
    for (let div of divs) {
        if(div.id == 'title-container') {
            title_container = div
            break
        }
    }
    title_container.insertBefore(show, title_container.childNodes[5])
    title_container.insertBefore(type, title_container.childNodes[5])
    title_container.insertBefore(status, title_container.childNodes[5])

    window.onclick = function(event) {
        if (!event.target.matches('.btn')) {
            show_dropdown.classList.add('hidden')
            type_dropdown.classList.add('hidden')
        }
    }

    for (let div of divs) {
        if(div.id == 'contents') {
            new MutationObserver(function () {
                setTimeout(() => {
                    applyFilters()
                    applyChannelFilters()
                }, 1500);
            }).observe(div, {childList: true})
            break
        }
    }

    is_setup = true
}

function applyFilters() {
    let vids = subs_dom.getElementsByTagName('ytd-grid-video-renderer')
    for (let vid of vids) {
        let vid_dom = new DOMParser().parseFromString(vid.innerHTML, 'text/html')
        let progress = vid_dom.getElementById('progress')
        try {
            progress = progress.style.width.slice(0, -1)
        } catch(err) {
            progress = 0
        }
        let is_live = (vid_dom.getElementById('meta').textContent.search('Streamed') != -1 || 
                        vid_dom.getElementById('overlays').textContent.search('LIVE') != -1 || 
                        vid_dom.getElementById('video-badges').textContent.search('LIVE NOW') != -1)
        if ((
                (videos && !is_live) ||
                (live_streams && is_live)
            ) && (
                (unwatched && progress < 15) ||
                (continue_watching && progress >= 15 && progress <= 85) ||
                (finished && progress > 85)
            )
        ) {
            vid.style.display = 'inline-block'
        } else {
            vid.style.display = 'none'
        }
    }
}

function passesWhiteList(channel, title) {
    let isChannelInWhiteList = false
    for (obj of white_list) {
        if (channel == obj.channel.toLowerCase()) {
            isChannelInWhiteList = true
            if (title.search(obj.title.toLowerCase()) != -1) {
                return true
            }
        }
    }
    return !isChannelInWhiteList
}

function passesBlackList(channel, title) {
    for (obj of black_list) {
        if (channel == obj.channel.toLowerCase() && title.search(obj.title.toLowerCase()) != -1) {
            return false
        }
    }
    return true
}

function applyChannelFilters() {
    let vids = subs_dom.getElementsByTagName('ytd-grid-video-renderer')
    for (let vid of vids) {
        let vid_dom = new DOMParser().parseFromString(vid.innerHTML, 'text/html')
        let channel = vid_dom.getElementById('channel-name').getElementsByTagName('a')[0].textContent.toLowerCase()
        let title = vid_dom.getElementById('video-title').textContent.toLowerCase()
        if (!(passesWhiteList(channel, title) && passesBlackList(channel, title))) {
            vid.remove()
        }
    }
}