let is_setup = false

let videos = true
let live_streams = true
let unwatched = true
let continue_watching = true
let finished = true

if (!is_setup) {
    setup()
}

function setup() {
    var styles = `
        .btn {
            color: rgb(62, 166, 255);
            padding: 16px;
            font-size: 14px;
            border: none;
            cursor: pointer;
            font-weight: 500;
            letter-spacing: 0.5px;
            user-select: none;
        }

        .dropdown_content {
            position: absolute;
            background-color: #f1f1f1;
            z-index: 2;
            cursor: pointer;
        }

        .dropdown_content div {
            color: black;
            padding: 12px 16px;
        }
    `
    var styleSheet = document.createElement('style')
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)

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
        applyFilters()
    }

    let show_unwatched = document.createElement('div')
    show_unwatched.innerText = 'Unwatched'
    show_unwatched.onclick = function(){
        unwatched = true
        continue_watching = false
        finished = false
        applyFilters()
    }

    let show_continue_watching = document.createElement('div')
    show_continue_watching.innerText = 'Continue Watching'
    show_continue_watching.onclick = function(){
        unwatched = false
        continue_watching = true
        finished = false
        applyFilters()
    }

    let show_finished = document.createElement('div')
    show_finished.innerText = 'Finished'
    show_finished.onclick = function(){
        unwatched = false
        continue_watching = false
        finished = true
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
        applyFilters()
    }

    let type_videos = document.createElement('div')
    type_videos.innerText = 'Videos'
    type_videos.onclick = function(){
        videos = true
        live_streams = false
        applyFilters()
    }

    let type_live = document.createElement('div')
    type_live.innerText = 'Live Streams'
    type_live.onclick = function(){
        videos = false
        live_streams = true
        applyFilters()
    }

    type_dropdown.appendChild(type_all)
    type_dropdown.appendChild(type_videos)
    type_dropdown.appendChild(type_live)
    type.appendChild(type_btn)
    type.appendChild(type_dropdown)

    let title_container = document.getElementById('title-container')
    title_container.insertBefore(show, title_container.childNodes[5])
    title_container.insertBefore(type, title_container.childNodes[5])

    window.onclick = function(event) {
        if (!event.target.matches('.btn')) {
            show_dropdown.classList.add('hidden')
            type_dropdown.classList.add('hidden')
        }
    }

    is_setup = true
}

function isLive(vid) {
    return (vid.getElementById('meta').textContent.search('Streamed') != -1 || 
            vid.getElementById('overlays').textContent.search('LIVE') != -1 || 
            vid.getElementById('video-badges').textContent.search('LIVE NOW') != -1)
}

function applyFilters() {
    let vids = document.getElementsByTagName('ytd-grid-video-renderer')
    for (let i = 0; i < vids.length; i++) {
        let vid = new DOMParser().parseFromString(vids[i].innerHTML, 'text/html')
        let progress_el = vid.getElementById('progress')
        let is_live = isLive(vid)
        if (
            (
                (videos && !is_live) ||
                (live_streams && is_live)
            ) && (
                (unwatched && (progress_el == null || progress_el.style.width.slice(0, -1) < 15)) ||
                (continue_watching && (progress_el != null && progress_el.style.width.slice(0, -1) >= 15 && progress_el.style.width.slice(0, -1) < 98)) ||
                (finished && (progress_el != null && progress_el.style.width.slice(0, -1) >= 98))
            )
        ) {
            vids[i].style.display = 'inline-block'
        } else {
            vids[i].style.display = 'none'
        }
    }
}
