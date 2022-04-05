let subs_dom
let is_setup = false
let videos = true
let live_streams = true
let unwatched = true
let continue_watching = true
let finished = true
let grid_mode = true
let white_list = []
let black_list = []

window.addEventListener('yt-navigate-finish', () => {
    if (window.location.pathname == '/feed/subscriptions') {
        if(!is_setup) 
            setup()
        else {
            if (subs_dom.querySelector('[aria-label="Switch to grid view"]').querySelector('path').getAttribute('d') == 
                'M2,4h6v7H2V4z M2,20h6v-7H2V20z M9,11h6V4H9V11z M9,20h6v-7H9V20z M16,4v7h6V4H16z M16,20h6v-7h-6V20z')
                grid_mode = true
            else
                grid_mode = false
            setTimeout(() => {
                applyFilters()
                applyChannelFilters()
            }, 1000)
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
        }
        new MutationObserver((mutations) => {
            let nodes = mutations[0].addedNodes
            for (let node of nodes) {
                if (node.tagName == 'YTD-CONTINUATION-ITEM-RENDERER') {
                    setTimeout(() => {
                        applyFilters()
                        applyChannelFilters()
                    }, 1000)
                }
            }
        }).observe(subs_dom.querySelector('#contents'), {childList: true})
    })

    let show = document.createElement('div')

    let show_btn = document.createElement('div')
    show_btn.innerText = 'SHOW'
    show_btn.classList.add('btn')
    show_btn.onclick = () => {
        show_dropdown.classList.toggle('hidden')
        type_dropdown.classList.add('hidden')
    }

    let show_dropdown = document.createElement('div')
    show_dropdown.classList.add('dropdown_content')
    show_dropdown.classList.add('hidden')

    let show_all = document.createElement('div')
    show_all.innerText = 'All'
    show_all.onclick = () => {
        unwatched = true
        continue_watching = true
        finished = true
        show_status.innerText = ''
        applyFilters()
    }

    let show_unwatched = document.createElement('div')
    show_unwatched.innerText = 'Unwatched'
    show_unwatched.onclick = () => {
        unwatched = true
        continue_watching = false
        finished = false
        show_status.innerText = 'UNWATCHED'
        applyFilters()
    }

    let show_continue_watching = document.createElement('div')
    show_continue_watching.innerText = 'Continue Watching'
    show_continue_watching.onclick = () => {
        unwatched = false
        continue_watching = true
        finished = false
        show_status.innerText = 'CONTINUE WATCHING'
        applyFilters()
    }

    let show_finished = document.createElement('div')
    show_finished.innerText = 'Finished'
    show_finished.onclick = () => {
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
    type_btn.onclick = () => {
        type_dropdown.classList.toggle('hidden')
        show_dropdown.classList.add('hidden')
    }

    let type_dropdown = document.createElement('div')
    type_dropdown.classList.add('dropdown_content')
    type_dropdown.classList.add('hidden')

    let type_all = document.createElement('div')
    type_all.innerText = 'All'
    type_all.onclick = () => {
        videos = true
        live_streams = true
        type_status.innerText = ''
        applyFilters()
    }

    let type_videos = document.createElement('div')
    type_videos.innerText = 'Videos'
    type_videos.onclick = () => {
        videos = true
        live_streams = false
        type_status.innerText = 'VIDEOS'
        applyFilters()
    }

    let type_live = document.createElement('div')
    type_live.innerText = 'Live Streams'
    type_live.onclick = () => {
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

    let favorite = document.createElement('button')
    favorite.onclick = () => {
        videos = true
        live_streams = false
        unwatched = true
        continue_watching = false
        finished = false
        type_status.innerText = 'VIDEOS'
        show_status.innerText = 'UNWATCHED'
        applyFilters()
    }
    favorite.innerText = '★'

    let status = document.createElement('div')
    status.classList.add('status')

    let show_status = document.createElement('div')
    show_status.classList.add('show_status')

    let type_status = document.createElement('div')
    type_status.classList.add('type_status')
    
    status.appendChild(show_status)
    status.appendChild(type_status)

    let title_container = subs_dom.querySelector('#title-container')
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
    let vids = grid_mode ? subs_dom.getElementsByTagName('ytd-grid-video-renderer') : subs_dom.getElementsByTagName('ytd-video-renderer')
    for (let vid of vids) {
        let progress = vid.querySelector('#progress')
        try {progress = progress.style.width.slice(0, -1)}
        catch(err) {progress = 0}
        let is_live = (vid.querySelector('#metadata-line').textContent.search('Streamed') != -1 || 
                        vid.querySelector('#overlays').textContent.search('LIVE') != -1 || 
                        (grid_mode ? vid.querySelector('#video-badges').textContent.search('LIVE NOW') != -1 : vid.querySelector('#badges').textContent.search('LIVE NOW') != -1))
        if (((videos && !is_live) || (live_streams && is_live)) && ((unwatched && progress < 15) || (continue_watching && progress >= 15 && progress <= 80) || (finished && progress > 80))) {
            if (grid_mode)
                vid.style.display = 'inline-block'
            else {
                let item_section_renderer = vid.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                if (item_section_renderer.isSameNode(item_section_renderer.parentNode.firstChild)){
                    vid.parentNode.parentNode.style.display = 'block'
                    item_section_renderer.querySelector('#image-container').style.display = 'flex'
                } else {
                    vid.parentNode.parentNode.style.display = 'block'
                    item_section_renderer.style.display = 'block'
                }
            }
        }
        else {
            if (grid_mode)
                vid.style.display = 'none'
            else {
                let item_section_renderer = vid.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                if (item_section_renderer.isSameNode(item_section_renderer.parentNode.firstChild)) {
                    vid.parentNode.parentNode.style.display = 'none'
                    item_section_renderer.querySelector('#image-container').style.display = 'none'
                } else
                    item_section_renderer.style.display = 'none'
            }
        }
    }
    let cont_item_rend = subs_dom.querySelector('ytd-continuation-item-renderer')
    cont_item_rend.style.height = '1000px'
    window.scrollBy(0, 1)
    window.scrollBy(0,-1)
    cont_item_rend.style.height = 'initial'
}

function passesWhiteList(channel, title) {
    let isChannelInWhiteList = false
    for (let obj of white_list) {
        if (channel == obj.channel.toLowerCase()) {
            isChannelInWhiteList = true
            if (title.search(obj.title.toLowerCase()) != -1) 
                return true
        }
    }
    return !isChannelInWhiteList
}

function passesBlackList(channel, title) {
    for (let obj of black_list)
        if (channel == obj.channel.toLowerCase() && title.search(obj.title.toLowerCase()) != -1) 
            return false
    return true
}

function applyChannelFilters() {
    let vids = grid_mode ? subs_dom.getElementsByTagName('ytd-grid-video-renderer') : subs_dom.getElementsByTagName('ytd-video-renderer')
    for (let i = 0; i < vids.length; i++) {
        let channel = vids[i].querySelector('#channel-name').querySelector('a').innerText.toLowerCase()
        let title = vids[i].querySelector('#video-title').innerText.toLowerCase()
        if (!(passesWhiteList(channel, title) && passesBlackList(channel, title))) {
            if (grid_mode)
                vids[i].remove()
            else {
                let item_section_renderer = vids[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                if (item_section_renderer.isSameNode(item_section_renderer.parentNode.firstChild)) {
                    vids[i].parentNode.parentNode.remove()
                    item_section_renderer.querySelector('#image-container').remove()
                } else
                    item_section_renderer.querySelector('#contents').remove()
            }
            i--
        }
    }
}