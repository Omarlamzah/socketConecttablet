// collect DOMs


var blob
const display = document.querySelector('.display')
const controllerWrapper = document.querySelector('.controllers')

const State = ['Initial', 'Record', 'Download']
let stateIndex = 0
let mediaRecorder, chunks = [], audioURL = ''

// mediaRecorder setup for audio
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    console.log('mediaDevices supported..')
    alert("medisported")

    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(stream => {
        mediaRecorder = new MediaRecorder(stream)

        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data)
        }

        mediaRecorder.onstop = () => {
             blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'})
            chunks = []
            audioURL = window.URL.createObjectURL(blob)
            document.querySelector('audio').src = audioURL
            document.querySelector('audio').id="audiouser"

            

        }
    }).catch(error => {
        console.log('Following error has occured : ',error)
        alert("reeeeeerr")
    })
}else{
    stateIndex = ''
    application(stateIndex)
}

const clearDisplay = () => {
    display.textContent = ''
   
   

 
}

const clearControls = () => {
    controllerWrapper.textContent = ''
}

const record = () => {
    setTimeout(function(){
          stateIndex = 1
    mediaRecorder.start()
    application(stateIndex)
    },1000)
  
   
    
}

const stopRecording = () => {
    stateIndex = 2
    mediaRecorder.stop()
    application(stateIndex)
}

const downloadAudio = () => {
    const downloadLink = document.createElement('a')
    downloadLink.href = audioURL
    downloadLink.setAttribute('download', 'audio')
    downloadLink.click()
}

const addButton = (id, funString, text) => {
    const btn = document.createElement('button')
    btn.id = id
    btn.setAttribute('onclick', funString)
    btn.textContent = text
    controllerWrapper.append(btn)
    controllerWrapper.append(btn)
    btn.innerHTML="<i onclick='displaytrash()' class='fa-solid fa-microphone   text-black'></i>"

     
}

const addMessage = (text) => {
    const msg = document.createElement('p')
    msg.textContent = text
    display.append(msg)
}

const addAudio = () => {
    const audio = document.createElement('audio')
    audio.controls = true
    audio.src = audioURL
    audio.id="audiouser"
   
    
    display.append(audio)
  
}

const application = (index) => {
    switch (State[index]) {
        case 'Initial':
            clearDisplay()
            clearControls()

            addButton('record', 'record()', 'Start Recording')//wwwwwwwwwwwwwwww
            break;

        case 'Record':
            clearDisplay()
            clearControls()

            addMessage('جاري التشجيل')
            addButton('stop', 'stopRecording()', 'Stop Recording')
            break

        case 'Download':
            clearControls()
            clearDisplay()

            addAudio()
            addButton('record', 'record()', 'Record Again')
            break

        default:
            clearControls()
            clearDisplay()

            addMessage('Your browser does not support mediaDevices')
            break;
    }

}

application(stateIndex)







