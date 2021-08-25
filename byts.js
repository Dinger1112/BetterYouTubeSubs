var styles = `
    #show_button {
        color: rgb(62, 166, 255);
        cursor: pointer;
        font-family: Roboto, Arial, sans-serif;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0.5px;
    }
`
var styleSheet = document.createElement("style")
styleSheet.innerText = styles
document.head.appendChild(styleSheet)


let show_button = document.createElement('DIV')
show_button.id = "show_button"
show_button.textContent = "SHOW"

let title_container = document.getElementById('title-container')
title_container.insertBefore(show_button, title_container.childNodes[5])
