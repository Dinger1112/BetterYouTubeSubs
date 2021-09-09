//style sheet
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
        z-index: 1;
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

//creates show button
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
    show_all.style.color = 'green'
}

let show_unwatched = document.createElement('div')
show_unwatched.innerText = 'Unwatched'
show_unwatched.onclick = function(){
    show_unwatched.style.color = 'green'
}

let show_continue_watching = document.createElement('div')
show_continue_watching.innerText = 'Continue Watching'
show_continue_watching.onclick = function(){
    show_continue_watching.style.color = 'green'
}

show_dropdown.appendChild(show_all)
show_dropdown.appendChild(show_unwatched)
show_dropdown.appendChild(show_continue_watching)
show.appendChild(show_btn)
show.appendChild(show_dropdown)

//creates type button
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
    let videos = document.getElementsByTagName('ytd-grid-video-renderer')
    for (let i = 0; i < videos.length; i++) {
        videos[i].style.display = 'inline-block'
    }
}

let type_videos = document.createElement('div')
type_videos.innerText = 'Videos'
type_videos.onclick = function(){
    let videos = document.getElementsByTagName('ytd-grid-video-renderer')
    for (let i = 0; i < videos.length; i++) {
        if(isLive(videos[i])) {
            videos[i].style.display = 'none'
        } else {
            videos[i].style.display = 'inline-block'
        }
    }
}

let type_live = document.createElement('div')
type_live.innerText = 'Live Streams'
type_live.onclick = function(){
    let videos = document.getElementsByTagName('ytd-grid-video-renderer')
    for (let i = 0; i < videos.length; i++) {
        if(isLive(videos[i])) {
            videos[i].style.display = 'inline-block'
        } else {
            videos[i].style.display = 'none'
        }
    }
}

type_dropdown.appendChild(type_all)
type_dropdown.appendChild(type_videos)
type_dropdown.appendChild(type_live)
type.appendChild(type_btn)
type.appendChild(type_dropdown)

//adds buttons to subs page
let title_container = document.getElementById('title-container')
title_container.insertBefore(show, title_container.childNodes[5])
title_container.insertBefore(type, title_container.childNodes[5])

//closes dropdown when clikcing outside of dropdown
window.onclick = function(event) {
    if (!event.target.matches('.btn')) {
        show_dropdown.classList.add('hidden')
        type_dropdown.classList.add('hidden')
    }
}

function isLive(v) {
    let video = new DOMParser().parseFromString(v.innerHTML, 'text/html')
    if (video.getElementById('meta').textContent.search('Streamed') != -1 ||
        video.getElementById('buttons').textContent == 'Set reminder' ||
        video.getElementById('video-badges').textContent.search('LIVE NOW') != -1) {
            return true
    } else {
        return false
    }
}

