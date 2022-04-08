let white_list
let black_list

const ul_white = document.getElementById('white_list')
const ul_black = document.getElementById('black_list')
const white_btn = document.getElementById('white_btn')
const black_btn = document.getElementById('black_btn')
const export_btn = document.getElementById('export')
const import_btn = document.getElementById('import')
const type = document.getElementById('type')
const show = document.getElementById('show')

white_btn.addEventListener('click', () => {
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
})
black_btn.addEventListener('click', () => {
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
})
export_btn.addEventListener('click', () => {
    browser.storage.sync.get().then((value) => {
        let a = document.createElement("a");
        let file = new Blob([JSON.stringify(value)], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = 'byts_backup.json';
        a.click();
    })
})
import_btn.addEventListener('change', () => {
    import_btn.files[0].text().then((value) => {
        let data = JSON.parse(value)
        for (i of data.white_list) {
            let add = true
            for (j of white_list) {
                if (j.channel == i.channel && j.title == i.title) {
                    add = false
                    break
                }
            }
            if (add) {
                ul_white.appendChild(createLI(i.channel, i.title))
                white_list.push({'channel':i.channel, 'title':i.title})
            }
        }
        for (i of data.black_list) {
            let add = true
            for (j of black_list) {
                if (j.channel == i.channel && j.title == i.title) {
                    add = false
                    break
                }
            }
            if (add) {
                ul_black.appendChild(createLI(i.channel, i.title))
                black_list.push({'channel':i.channel, 'title':i.title})
            }
        }
        browser.storage.sync.set({
            white_list: white_list,
            black_list: black_list
        })
    })
})

type.addEventListener('change', () => {
    browser.storage.sync.set({type: type.value})
})

show.addEventListener('change', () => {
    browser.storage.sync.set({show: show.value})
})

browser.storage.sync.get().then((value) => {
    if (value.white_list != undefined){
        white_list = value.white_list
        black_list = value.black_list
    } else {
        browser.storage.sync.set({
            white_list: [],
            black_list: []
        })
    }
    if (value.type != undefined) {
        let t = value.type
        for (let i = 0; i < type.size; i++) {
            
        }
    } else {

    }
    if (value.show != undefined) {

    } else {
         
    }
}).then(() => {
    for (let i of white_list) 
        ul_white.appendChild(createLI(i.channel, i.title))
    for (let i of black_list) 
        ul_black.appendChild(createLI(i.channel, i.title))
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
            if (ul_children[i].isSameNode(li)) 
                break
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