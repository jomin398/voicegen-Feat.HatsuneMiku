import WaveSurfer from "wavesurfer.js";
import crunker from 'crunker';
import { createSilentAudio } from 'createSilentAudio';
import { formSubmitAsync } from './formSubmitAsync.js';
import { formParse } from './formParse.js';
import 'wavesurfer/plugin/wavesurfer.timeline.min.js';

await new Promise(r => { window.onload = () => r(true) });
const voiceSelect = document.getElementById("voiceSelect");
const audioPreview = document.getElementById("audioPreview");
const previewButton = document.getElementById("previewButton");
const addButton = document.getElementById("addButton");
const audiolistBox = document.getElementById("audiolist");
const listPreviewButton = document.getElementById("listPreviewButton");
const addSilentButton = document.getElementById("addSilent");
const pauseButton = document.querySelector('.music.play');
const resumeButton = document.querySelector('.music.resume');
const dispElem = document.querySelector('.music-box-wrap');
const voiceRootPath = "./voice/";
const TimelinePlugin = window.WaveSurfer.timeline;
function getDocRootVal(propName) {
    return getComputedStyle(document.body).getPropertyValue(propName);
}
const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    minPxPerSec: 500,
    scrollParent: true,
    mediaControls: false,
    backend: 'MediaElement',
    hideScrollbar: true,
    waveColor: "#00000010",
    progressColor: getDocRootVal('--miku-dark'),
    plugins: [
        TimelinePlugin.create({
            container: "#timeline",
            fontSize: 14
        })
    ]
});
// wavesurfer.load(audioPreview);
// // wavesurfer.init();
function changeAudioSource(e) {
    e.preventDefault();
    let selectedOption = voiceSelect.value;
    audioPreview.src = selectedOption;
    audioPreview.load();
}
function playPreview(e) {
    e.preventDefault();
    if (audioPreview) audioPreview.play();
}
function addList(e) {
    e.preventDefault();
    let selectedOption = voiceSelect.value;
    audiolistBox.value += `${selectedOption},\n`;
}
// "ended" 이벤트 리스너
const ended = () => new Promise((resolve) => {
    audioPreview.addEventListener("ended", () => resolve(true));
    // audioPreview.play();
});
async function playAudio(path, index, notisPreview) {
    audioPreview.src = path;
    wavesurfer.load(audioPreview);
    audioPreview.play();
    return await ended();
}

function addSilent() {
    const v = document.querySelector('#sec')?.value;
    const time = (v == '' ? 0 : parseInt(v) ?? 0) ?? 0;
    if (time > 0) audiolistBox.value += `Sil_${time},\n`;
}
async function renderSound(isPreview) {
    const filter = arr => arr.filter(e => {
        if (e == " ") return;
        return e;
    }).map(e => e.replace('\n', '').trim()).filter(e => e).map(e => e.replace('\n', '').trim());
    const processSLient = arr => arr.map(e => {
        if (!e.startsWith("Sil_")) return e;
        e = createSilentAudio(e.replace("Sil_", ""));
        return e;
    });
    const getPlayList = processSLient(filter(audiolistBox.value.split(',')));
    //console.log(getPlayList)

    async function playAudioList(pathList) {
        pauseButton.style.opacity = 1;
        if (!resumeButton.classList.contains('hide')) resumeButton.classList.add('hide');
        if (pauseButton.classList.contains('hide')) pauseButton.classList.remove('hide');
        // pauseButton.addEventListener('click', play);
        // guiToggle(pauseButton)
        for (let index = 0; index < pathList.length; index++) {
            const path = pathList[index];
            await playAudio(path, index);
        }
        pauseButton.style.opacity = 0;
        // resumeButton.classList.remove('hide');

        // resumeButton.addEventListener('click', () => renderSound(true))

    }
    await playAudioList(getPlayList, !isPreview);
    //pauseButton.removeEventListener('click', play)
    // pauseButton.addEventListener('click', () => renderSound(true))
}
function guiToggle(elm) {

    if (elm.classList.contains('pause')) {
        elm.children[0].innerText = "play_arrow";
        elm.children[1].innerText = "play";
    } else {
        elm.classList.toggle('pause');
        elm.children[0].innerText = "pause";
        elm.children[1].innerText = "pause";
    }
}
function play() {
    // guiToggle(pauseButton)
    wavesurfer.playPause()
}
function siteOnload() {
    for (let index = 1; index < 690; index++) {
        const item = document.createElement('option');
        const name = `KSK2_${Number(index).toString().padStart(4, '0')}`;
        const value = `${voiceRootPath}${name}.mp3`;

        item.value = value;
        item.innerText = name;
        voiceSelect.appendChild(item);
    }

    voiceSelect.addEventListener('change', changeAudioSource);
    previewButton.addEventListener('click', playPreview);
    addButton.addEventListener('click', addList);
    listPreviewButton.addEventListener('click', () => {
        dispElem.classList.remove('hide');
        renderSound(true)
    });
    addSilentButton.addEventListener('click', addSilent);

    pauseButton.addEventListener('click', play)
    // wavesurfer.on('finish', () => {
    //     guiToggle(pauseButton);
    // })
    formSubmitAsync().then(f => {
        console.log(f)
        console.log(formParse(f))
    })
}

siteOnload();
// let crunker = new Crunker();

// crunker
//   .fetchAudio('/voice.mp3', '/background.mp3')
//   .then((buffers) => crunker.concatAudio(buffers))
//   .then((merged) => crunker.export(merged, 'audio/mp3'))
//   .then((output) => crunker.download(output.blob))
//   .catch((error) => {
//     throw new Error(error);
//   });

// crunker.notSupported(() => {
//     window.alert('Browser unsupported!');

//     Array.from(document.querySelectorAll('input[type=button]')).forEach((elem) => (elem.disabled = true));
// });