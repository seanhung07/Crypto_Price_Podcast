const textarea = document.getElementById("price"),
voiceList = document.getElementById("outer"),
speechBtn = document.querySelector("button");
let synth = speechSynthesis
let ws = ""
function getPrice(coin){
    search = coin.toLowerCase()
    ws = new WebSocket(`wss://stream.binance.com:9443/ws/${search}@trade`)
    let price = document.getElementById('price')
    ws.onmessage = (event) =>{
    let priceObj = JSON.parse(event.data)
    price.innerText = parseFloat(priceObj.p).toFixed(4)
    }
}
voices();
function voices(){
    for(let voice of synth.getVoices()){
        let selected = voice.name === "Samantha" ? "selected" : "";
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        voiceList.insertAdjacentHTML("beforeend", option);
    }
}

synth.addEventListener("voiceschanged", voices);

function textToSpeech(text){
    let utterance = new SpeechSynthesisUtterance(text);
    for(let voice of synth.getVoices()){
        if(voice.name === voiceList.value){
            utterance.voice = voice;
        }
    }
    synth.speak(utterance);
}
function update() {
    let select = document.getElementById('tick');
    let value = select.options[select.selectedIndex].value;
    return value
}
function remove(sockets){
    for(s in sockets)
        sockets[s].close();
}
let start = 0
let sockets = [];
speechBtn.addEventListener("click", e =>{
    e.preventDefault();
    const coin = update()
    search = coin.toLowerCase()
    ws = new WebSocket(`wss://stream.binance.com:9443/ws/${search}@trade`)
    sockets.push(ws);
    let price = document.getElementById('price')
    ws.onmessage = (event) =>{
        let priceObj = JSON.parse(event.data)
        price.innerText = parseFloat(priceObj.p).toFixed(4)
    }
    let sec = document.getElementById('interval').value
    start == 0 ? start = 1 : start =0
    let buttonvalue = document.querySelector("button")
    const interval = setInterval(function() {
        if(start == 1){
            buttonvalue.innerText = "Stop"
            if(textarea.textContent !== ""){
                console.log(textarea.textContent)
                if(!synth.speaking){
                    textToSpeech(textarea.textContent);
                }
            }
        }else{
            clearInterval(interval)
            remove(sockets)
            buttonvalue.innerText = "Start"
        }
        }, sec*1000);
});