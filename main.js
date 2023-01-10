const videoPlayer = document.querySelector("#player")
const canvasElement = document.querySelector("#canvas")
const captureButton = document.querySelector("#capture-btn")
const imagePicker = document.querySelector("#image-picker")
const imagePickerArea = document.querySelector("#pick-image")
const newImages = document.querySelector("#newImages")


const videoSelect = document.querySelector("select#videoSource")
const selectors = [videoSelect];

canvasElement.style.display = "none"

const createImage = (src, alt, width, height, className) => {
    let newImg = document.createElement("img")

    if (src !== null) newImg.setAttribute("src", src)
    if (alt !== null) newImg.setAttribute("alt", alt)
    if (title !== null) newImg.setAttribute("title", title)
    if (width !== null) newImg.setAttribute("width", width)
    if (height !== null) newImg.setAttribute("height", height)
    if (className !== null) newImg.setAttribute("class", className)

    return newImg;
};

function gotDevices(deviceInfos) {

    const values = selectors.map(select => select.value)
    selectors.forEach(select => {
        while (select.firstChild) {
            select.removeChild(select.firstChild)
        }
    })

    for (let i = 0; i !== deviceInfos.length; i++) {
        const deviceInfo = deviceInfos[i]
        const option = document.createElement('option')
        option.value = deviceInfo.deviceId
        if (deviceInfo.kind == 'videoinput') {
            option.text = deviceInfo.label || `camera ${videoSelect.length+1}`
            videoSelect.appendChild(option)
        } else {
            console.log('Some other kind of source/device', deviceInfo)
        }
    }

    selectors.forEach((select, selectorIndex) => {
        if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
            select.value = values[selectorIndex]
        }
    })
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(console.error)


function gotStream(stream) {
    window.stream = stream
    videoPlayer.srcObject = stream
    return navigator.mediaDevices.enumerateDevices()
}


function start() {
    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop()
        })
    }
    const videoSource = videoSelect.value
    const constrains = {
        video: { deviceId: videoSource ? { exact: videoSource } : undefined }
    }
    navigator.mediaDevices.getUserMedia(constrains).then(gotStream).then(gotDevices)
}


captureButton.addEventListener("click", event => {
    canvasElement.style.display = "none"
    const context = canvasElement.getContext("2d")
    context.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height)
    videoPlayer.srcObject.getVideoTracks().forEach(track => {})

    let picture = canvasElement.toDataURL();

    fetch("save_image.php", {
        method: "post",
        body: JSON.stringify({ data: picture })

    })

    .then(res => res.json())

    .then(data => {

            if (data.success) {

                let newImage = createImage(

                    data.path,
                    "new image",
                    "new image",
                    width,
                    height,
                    "masked"
                );
                console.log(newImage);
                newImages.appendChild(newImage);
                canavasElement.classList.add("masked");
            }
        })
        .catch(error => console.error(error));
})



videoSelect.onchange = start()
window.onload = function() {
    start();
}