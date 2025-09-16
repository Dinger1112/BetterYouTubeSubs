let subs_dom
let is_setup = false

let type = 'All'
let show = 'All'
let type_prev = 'All'
let show_prev = 'All'

let white_list = []
let black_list = []
let fav_type = "Videos"
let fav_show = "Unwatched"

let WAIT_TIME = 1500
let num_of_vids_on_page = 0

//Runs setup if the window starts on the subs page 
setTimeout(() => {
    if (window.location.pathname == '/feed/subscriptions' && !is_setup)
        setup()
}, 2000);

//Adds an event listener to run setup when the window goes to the subs page for the first time
window.addEventListener('yt-navigate-finish', () => {
    setTimeout(() => {
        if (window.location.pathname == '/feed/subscriptions' && !is_setup)
            setup()
    }, 2000);
})

//Removes video preview on hover cause i don't like them
document.querySelector('#video-preview').remove()

function setup() {
    subs_dom = document.querySelector('ytd-browse[page-subtype="subscriptions"]')
    
    //Loads the black/white list and favorites from the options page
    browser.storage.sync.get().then((storage) => {
        if (storage.white_list != undefined) {
            white_list = storage.white_list
            black_list = storage.black_list
            setTimeout(() => {
                applyChannelFilters()
            }, 500);
        }
        if (storage.type != undefined) 
            fav_type = storage.type
        if (storage.show != undefined)
            fav_show = storage.show
    })

    // Creates a tall div so the user always has to scroll down to load more videos
    let block = document.createElement('div')
    block.style.marginTop = window.innerHeight + 'px'
    block.style.width = '100%'
    setTimeout(() => {
        let continue_element = subs_dom.querySelector('ytd-continuation-item-renderer')
        continue_element.insertAdjacentElement('beforebegin', block)
        num_of_vids_on_page = subs_dom.querySelector('#contents').childNodes.length
        //Runs the filters whenever new videos are loaded in
        new MutationObserver(() => {
            let n = subs_dom.querySelector('#contents').childNodes.length
            if (n > num_of_vids_on_page) {
                setTimeout(() => {
                    applyChannelFilters()
                    applyFilters()
                    let continue_element = subs_dom.querySelector('ytd-continuation-item-renderer')
                    continue_element.insertAdjacentElement('beforebegin', block)
                    window.scrollTo(0,0)
                }, WAIT_TIME)
                num_of_vids_on_page = n
            }
        }).observe(subs_dom.querySelector('#contents'), {childList: true})
    }, 1000);

    //Runs the filters whenever the user navigates to the subs page
    window.addEventListener('yt-navigate-finish', () => {
        if (window.location.pathname == '/feed/subscriptions' && is_setup) {
            setTimeout(() => {
                applyChannelFilters()
                applyFilters()
                let continue_element = subs_dom.querySelector('ytd-continuation-item-renderer')
                continue_element.insertAdjacentElement('beforebegin', block)
            }, WAIT_TIME);
        }
    })

    //Runs the filters whenever the window is resized
    window.addEventListener('resize', () => {
        if (window.location.pathname == '/feed/subscriptions' && is_setup) {
            setTimeout(() => {
                applyChannelFilters()
                applyFilters()
                removeDuplicates()
                let continue_element = subs_dom.querySelector('ytd-continuation-item-renderer')
                continue_element.insertAdjacentElement('beforebegin', block)
            }, WAIT_TIME);
        }
    })

    //Creates all the buttons for the user to apply filters 
    let show_element = document.createElement('div')

    let show_btn = document.createElement('div')
    show_btn.innerText = 'SHOW'
    show_btn.classList.add('btn')
    show_btn.onclick = () => {
        if (type != 'Shorts') {
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
        show = 'All'
        show_status.innerText = ''
    }

    let show_unwatched = document.createElement('div')
    show_unwatched.innerText = 'Unwatched'
    show_unwatched.onclick = () => {
        show = 'Unwatched'
        show_status.innerText = 'UNWATCHED'
    }

    let show_continue_watching = document.createElement('div')
    show_continue_watching.innerText = 'Continue Watching'
    show_continue_watching.onclick = () => {
        show = 'Continue Watching'
        show_status.innerText = 'CONTINUE WATCHING'
    }

    let show_finished = document.createElement('div')
    show_finished.innerText = 'Finished'
    show_finished.onclick = () => {
        show = 'Finished'
        show_status.innerText = 'FINISHED'
    }

    show_dropdown.appendChild(show_all)
    show_dropdown.appendChild(show_unwatched)
    show_dropdown.appendChild(show_continue_watching)
    show_dropdown.appendChild(show_finished)
    show_element.appendChild(show_btn)
    show_element.appendChild(show_dropdown)

    let type_element = document.createElement('div')

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
        type = 'All'
        type_status.innerText = ''
    }

    let type_videos = document.createElement('div')
    type_videos.innerText = 'Videos'
    type_videos.onclick = () => {
        type = 'Videos'
        type_status.innerText = 'VIDEOS'
    }

    let type_shorts = document.createElement('div')
    type_shorts.innerText = 'Shorts'
    type_shorts.onclick = () => {
        type = 'Shorts'
        type_status.innerText = 'SHORTS'
        show = 'All'
        show_status.innerText = ''
    }

    let type_live = document.createElement('div')
    type_live.innerText = 'Live Streams'
    type_live.onclick = () => {
        type = 'Live Streams'
        type_status.innerText = 'LIVE STREAMS'
    }

    type_dropdown.appendChild(type_all)
    type_dropdown.appendChild(type_videos)
    type_dropdown.appendChild(type_shorts)
    type_dropdown.appendChild(type_live)
    type_element.appendChild(type_btn)
    type_element.appendChild(type_dropdown)

    let favorite = document.createElement('button')
    favorite.classList.add('fav_btn')
    favorite.innerText = '☆'
    favorite.onclick = () => {
        if (favorite.innerText == '★') {
            type = type_prev
            show = show_prev
            type_status.innerText = (type == 'All') ? '' : type.toUpperCase()
            show_status.innerText = (show == 'All') ? '' : show.toUpperCase()
            favorite.innerText = '☆'
        } else {
            type_prev = type
            show_prev = show
            type = fav_type
            type_status.innerText = (fav_type == 'All') ? '' : type.toUpperCase()
            show = fav_show
            show_status.innerText = (fav_show == 'All') ? '' : show.toUpperCase()
            favorite.innerText = '★'
        }
        applyFilters()
    }

    let status_element = document.createElement('div')
    status_element.classList.add('status')

    let show_status = document.createElement('div')
    show_status.classList.add('show_status')

    let type_status = document.createElement('div')
    type_status.classList.add('type_status')
    
    status_element.appendChild(show_status)
    status_element.appendChild(type_status)

    let title_container = subs_dom.querySelector('ytd-rich-section-renderer').querySelector('#title-container')
    title_container.insertBefore(show_element, title_container.childNodes[5])
    title_container.insertBefore(type_element, title_container.childNodes[5])
    title_container.insertBefore(favorite, title_container.childNodes[5])
    title_container.insertBefore(status_element, title_container.childNodes[5])

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
            let progress = vid.querySelector('.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment')
            try {progress = progress.style.width.slice(0, -1)}
            catch(err) {progress = 0} //Sets to 0 if the progress bar doesn't exist on a video
            vid_meta_data = vid.querySelector('yt-content-metadata-view-model').textContent
            let is_live = (vid_meta_data.includes('Streamed') || vid_meta_data.includes('Scheduled') || 
                            (vid.querySelector('.yt-badge-shape--thumbnail-live') != null && vid.querySelector('.yt-badge-shape--thumbnail-live').textContent == 'LIVE')
                        )
            if (((type == 'Videos' && !is_live) || (type == 'Live Streams' && is_live) || type == 'All') && ((show == 'Unwatched' && progress < 15) || (show == 'Continue Watching' && progress >= 15 && progress <= 80) || (show == 'Finished' && progress > 80) || show == 'All'))
                vid.classList.remove('hidden')
            else
                vid.classList.add('hidden')
        }
    }
    if ((type == 'Shorts' || type == 'All') && (show == 'Unwatched' || show == 'All'))
        subs_dom.getElementsByTagName('ytd-rich-section-renderer')[1].classList.remove('hidden')
    else
        subs_dom.getElementsByTagName('ytd-rich-section-renderer')[1].classList.add('hidden')
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
    for (let v of duplicates) {
        v.remove()
    }
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
    let to_remove = [] //To not mess up JS going through the list of vids, removal is done after all the vids are found
    for (let v of vids) {
        if (!v.hasAttribute('is-slim-media')) {
            let channel = v.querySelector('yt-content-metadata-view-model').querySelector('a').innerText.toLowerCase()
            let title = v.querySelector('yt-lockup-metadata-view-model').innerText.toLowerCase()
            if (!(passesWhiteList(channel, title) && passesBlackList(channel, title))) {
                to_remove.push(v)
            }
        }
    }
    for (let v of to_remove)
        v.remove()
}