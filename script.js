"use strict";

const searchbar = document.getElementById("searchbar");
const word = document.getElementById("word");
const wordContainer = document.getElementById("word-container");
const phonetic = document.getElementById("phonetic");
const source = document.getElementById("source");
const meaning = document.getElementById("meaning");
const def = document.querySelectorAll("definition");
const fonts = document.getElementById('fonts');
const colorScheme = document.getElementsByTagName("input").namedItem('check')
let audioSource = null;
const colorSwitch = document.querySelector('.color-switch');
async function queryApi(data, method = "GET") {
  const query = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${data}`,
    {
      method,
    }
  );
  const result = query.json();
  return result;
}

function removeN(parent) {
  for (const element of Array.from(parent.childNodes)) {
    parent.removeChild(element);
  }
}
function removeLastChild(parent) {
  for (const index of Array.from(parent.childNodes)) {
        console.log(index)
  }
}

searchbar.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    if(searchbar.value[0].toUpperCase() + searchbar.value.slice(1) == word.innerText){
        if(!audioSource && (wordContainer.lastElementChild.nodeName == 'BUTTON' || wordContainer.lastElementChild.nextElementSibling == 'AUDIO')){
            for(const element of Array.from(wordContainer.childNodes)){
                if(element.nodeName == 'BUTTON' || element.nodeName == 'AUDIO'){
                    wordContainer.removeChild(element)
                }
            }
        }
        return

    }
    removeN(meaning)
    // removeLastChild(wordContainer)
    const r = () => queryApi(searchbar.value);
    r().then((value) => {
      if (value) {
        if (e.key == "Enter") {
            audioSource = value[0]?.phonetics[0]?.audio
            if(audioSource){
                if(wordContainer.lastElementChild.nodeName == 'BUTTON' || wordContainer.lastElementChild.nodeName == 'AUDIO'){
                    for(const element of Array.from(wordContainer.childNodes)){
                        if(element.nodeName == 'BUTTON' || element.nodeName == 'AUDIO'){
                            wordContainer.removeChild(element)
                        }
                    }
                }
                if(wordContainer.lastElementChild.nodeName == 'DIV'){
                    const btn = document.createElement('button')
                    btn.innerHTML = "<img src='./assets/images/icon-play.svg'/>"
                    btn.setAttribute('id','butt')
                    wordContainer.append(btn)
                    btn.addEventListener('click', (e)=>{
                        const audio = document.createElement('audio')
                        audio.src = audioSource
                        audio.autoplay = true
                        wordContainer.append(audio)
                    })
                }
            }
            if(!audioSource && (wordContainer.lastElementChild.nodeName == 'BUTTON' || wordContainer.lastElementChild.nextElementSibling == 'AUDIO')){
                for(const element of Array.from(wordContainer.childNodes)){
                    if(element.nodeName == 'BUTTON' || element.nodeName == 'AUDIO'){
                        wordContainer.removeChild(element)
                    }
                }
            }
            meaning.style.textAlign = 'unset'
            word.innerText = value[0].word[0].toUpperCase() + value[0].word.slice(1);
            phonetic.innerText = value[0].phonetic || (value[0].phonetics[1]?.text || '')
            source.innerHTML = `<span id="source">Source </span><a href="${value[0].sourceUrls[0]}" target="__blank">${value[0].sourceUrls[0]}</a> <span id='window'><img src='./assets/images/icon-new-window.svg'/></span>`;
            for (const element of value[0].meanings) {
              const { antonyms, definitions, partOfSpeech, synonyms } = element;
              const div = document.createElement("div");
              div.setAttribute("class", "definition");
              const pos = document.createElement("div");
              const meantext = document.createElement("div")
              const ul = document.createElement("ul");
              pos.setAttribute("id", "pos");
              pos.innerText = partOfSpeech;
              meantext.innerText = "Meaning"
              meantext.setAttribute("id", "meantext");
              for (const element of definitions) {
                const li = document.createElement("li");
                li.innerText = element.definition;
                ul.appendChild(li);
              }
              div.appendChild(pos);
              div.append(meantext)
              div.appendChild(ul);
              meaning.appendChild(div);
            }
          }
       
      }
     
    }).catch((e)=>{
        word.innerText = ''
        source.innerText = ''
        phonetic.innerText = ''
        meaning.style.textAlign = 'center'
        meaning.innerHTML = "No Definitions Found <br> <div id='error'>Sorry pal, we couldn't find the definitions for the word you were looking for. You can try the search again at another time or search on Google. </div>"
        for(const element of Array.from(wordContainer.childNodes)){
            if(element.nodeName == 'BUTTON' || element.nodeName == 'AUDIO'){
                wordContainer.removeChild(element)
            }
        }
    })
  }
});


fonts.addEventListener('change',(e)=>{
    document.body.style.fontFamily = fonts.value
})

colorScheme.addEventListener('click',(e)=>{
    if(colorScheme.checked){
        document.body.style.backgroundColor = '#050505'
        document.body.style.color = '#FFF'
        searchbar.style.background = '#757575'
        searchbar.style.color='white'
        fonts.style.color = 'white'
        Array.from(fonts.children).forEach(el => el.style.color = 'black')
    }else{
        document.body.style.backgroundColor = '#FFF';
        document.body.style.color = '#000'
        searchbar.style.background = '#E9E9E9'
        searchbar.style.color='black'
        fonts.style.color = 'black'
    }
})

