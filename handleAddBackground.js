// Could get google user info in case you want to save based on user

// let user;

// chrome.extension.sendMessage({}, function (response) {
//     user = response.email
// });

// Sets image when new tab is opened
// Grabs images from localstorage named backgrounds that has an array of image urls and picks one randomly
window.addEventListener('load', async () => {
    const backgrounds = JSON.parse(localStorage.getItem('backgrounds'))
    if (backgrounds) {
        const background = backgrounds.backgrounds[Math.floor(Math.random() * backgrounds.backgrounds.length)]
        document.body.style.backgroundImage = `url("${background}")`
    }

});



// Event listener to open popup for adding or removing images
document.getElementById('add-background-container').addEventListener('click', async () => {

    const boxEle = document.getElementById('addBox')
    if (boxEle) {
        document.getElementById('root').removeChild(boxEle)
    } else {
        //Extra html (popup box)
        document.getElementById('root').insertAdjacentHTML('beforeend', `
        <div id="add-outside-container">
        <div id="addBox" class="add-background-box">
        <div id="currentTab"><span id="currentTab-span">Backgrounds</span></div>
        <div id="current-backgrounds-container">

        </div>
        </div>
        <div id="add-with-url-container">
        <input autocomplete="off" spellcheck="false" id="add-image-url-input" placeholder="Image url"></input>
        <button id="add-image-url-button">Add</button>
        <div>
        </div>`)
        // Handle enter key for submitting image url
        document.getElementById('add-image-url-input').addEventListener('keyup', (e) => {
            if (e.code === 'Enter') {
                document.getElementById('add-image-url-button').click()
            }
        })
        // Adds image url to list of backgrounds
        document.getElementById('add-image-url-button').addEventListener('click', async () => {
            if (document.getElementById('err-box')) {
                document.getElementById('err-box').remove()
            }
            const url = document.getElementById('add-image-url-input').value
            const res = await fetch(url)
            document.getElementById('add-image-url-input').value = ""
            if (!res.headers.get('content-type').includes('image')) {
                const newEle = document.createElement('div')
                newEle.id = "err-box"
                newEle.innerHTML = "Invalid Image"
                document.getElementById('add-outside-container').appendChild(newEle)
            } else {
                const oldBackgrounds = JSON.parse(localStorage.getItem('backgrounds'))
                if (oldBackgrounds) {
                    localStorage.setItem('backgrounds', JSON.stringify({ backgrounds: [...oldBackgrounds.backgrounds, url] }))
                } else {
                    localStorage.setItem('backgrounds', JSON.stringify({ backgrounds: [url] }))
                }
                checkCurrentBackgrounds()
                document.getElementById('root').style.backgroundImage = `url(${url})`
            }
        })


        checkCurrentBackgrounds()




        // Removes popup window
        document.getElementById('add-outside-container').addEventListener('mousedown', (e) => {
            if (e.target.id === 'add-outside-container') {
                document.getElementById('add-outside-container').remove()
            }
        })



    }




})

// Handles upload button file from device
function checkCurrentBackgrounds(){
    document.getElementById('current-backgrounds-container').innerHTML = ""
    const newEle = document.createElement('div')
    newEle.classList = "backgrounds-container-boxes"
    // Extra html
    newEle.insertAdjacentHTML("beforeend", '<img id="uploadimg" src="./defaultImages/upload.svg"/><label>Upload from device</label><input name="inputFile" id="file-input" type="file" accept="image/png, image/jpeg, image/jpg" style="display:none"></input>')

    document.getElementById('current-backgrounds-container').append(newEle)

    // Get all current backends and adds the option to remove background from list
    let allBackgrounds = JSON.parse(localStorage.getItem('backgrounds'))
    if (allBackgrounds) {
        allBackgrounds.backgrounds.map((item, i) => {
            const newEle = document.createElement('div')
            newEle.classList = "backgrounds-container-boxes"
            newEle.insertAdjacentHTML("beforeend", `<div elenum=${i} class="remove-span-container"><span elenum=${i} class="remove-span">Remove</span></div><img class="backImages" src="${item}"/>`)

            document.getElementById('current-backgrounds-container').append(newEle)
            newEle.addEventListener('click', (e) => {
                const localBack = JSON.parse(localStorage.getItem('backgrounds'))
                const newBacks = localBack.backgrounds.filter((item, i) => {
                    return i !== parseInt(e.target.getAttribute('elenum'))
                })
                localStorage.setItem('backgrounds', JSON.stringify({ backgrounds: newBacks }))
                checkCurrentBackgrounds()
                
            })
        })
    }
    // Click event listener for uploading images
    document.getElementsByClassName('backgrounds-container-boxes')[0].addEventListener('click', async () => {
        document.getElementById('file-input').click()
    })
    // Stops the default click operation because even was firing two click events
    document.getElementById('file-input').addEventListener("click", function (e) {
        e.stopPropagation();
        e.target.value = null
    });

    // File uploaded sends request to server and res returns the url to image (read more in the readme)
    document.getElementById('file-input').addEventListener('change', async (e) => {

        const file = document.getElementById('file-input').files[0]
        const fileForm = new FormData()
        fileForm.append('myfile', file)
        /*  fileForm.append('email', user) */
        const res = await fetch('http://localhost:8000/api/upload-wallpaper', { method: 'POST', body: fileForm })
        if (res.status === 200) {
            const newBack = await res.json()
            const oldBackgrounds = JSON.parse(localStorage.getItem('backgrounds'))
            if (oldBackgrounds) {
                localStorage.setItem('backgrounds', JSON.stringify({ backgrounds: [...oldBackgrounds.backgrounds, newBack.wallpaper] }))
            } else {
                localStorage.setItem('backgrounds', JSON.stringify({ backgrounds: [newBack.wallpaper] }))
            }

            checkCurrentBackgrounds()
            document.getElementById('root').style.backgroundImage = `url(${newBack.wallpaper})`
        }

    })
}