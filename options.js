let white_list
let black_list

const ul_white = document.getElementById('white_list')
const ul_black = document.getElementById('black_list')
const white_btn = document.getElementById('white_btn')
const black_btn = document.getElementById('black_btn')

white_btn.addEventListener('click', addWhiteItem)
black_btn.addEventListener('click', addBlackItem)

browser.storage.sync.get().then(function(value) {
    if (value.white_list != undefined){
        white_list = value.white_list
        black_list = value.black_list
    } else {
        browser.storage.sync.set({
            white_list: [],
            black_list: []
        })
    }
}).then(function() {
    for (let i of white_list) {
        ul_white.appendChild(createLI(i.channel, i.title))
    }
    for (let i of black_list) {
        ul_black.appendChild(createLI(i.channel, i.title))
    }
})

function createLI(channel, title) {
    let li = document.createElement('li')
    li.innerText = channel + ' : ' + title

    let btn = document.createElement('button')
    btn.innerText = 'X'
    btn.addEventListener('click', function() {
        let ul = li.parentNode
        ul_children = ul.childNodes
        let i
        for (i in ul_children) {
            if (ul_children[i].isSameNode(li)) {break}
        }
        ul.removeChild(li)
        if (ul.id == 'white_list') {
            white_list.splice(i, 1)
            browser.storage.sync.set({white_list: white_list})
        } else {
            black_list.splice(i, 1)
            browser.storage.sync.set({black_list: black_list})
        }
    })
    li.appendChild(btn)
    return li
}

function addWhiteItem() {
    let channel_input = document.getElementById('white_channel_input')
    let title_input = document.getElementById('white_title_input')

    let channel = channel_input.value.trim()
    let title = title_input.value.trim()

    if(channel != '' && title != '') {
        channel_input.value = ''
        title_input.value = ''

        ul_white.appendChild(createLI(channel, title))

        white_list.push({'channel':channel, 'title':title})
        browser.storage.sync.set({white_list: white_list})
    }
}

function addBlackItem() {
    let channel_input = document.getElementById('black_channel_input')
    let title_input = document.getElementById('black_title_input')

    let channel = channel_input.value.trim()
    let title = title_input.value.trim()

    if(channel != '' && title != ''){
        channel_input.value = ''
        title_input.value = ''

        ul_black.appendChild(createLI(channel, title))

        black_list.push({'channel':channel, 'title':title})
        browser.storage.sync.set({black_list: black_list})
    }
}