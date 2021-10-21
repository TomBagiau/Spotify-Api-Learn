let isFetching = false;
let accessToken;
let cards = []
const cardsContainer = document.querySelector('.cards')
let tracksContainer = document.querySelector(".container");
let button = document.querySelector(".nextMusic");
let currentCardIndex

const btnPrev = document.querySelector('.fleche-left')
const btnNext = document.querySelector('.fleche-right')

const getUrlParameter = (sParam) => {
    let sPageURL = window.location.search.substring(1), ////substring will take everything after the https link and split the #/&
      sURLVariables =
        sPageURL != undefined && sPageURL.length > 0 ? sPageURL.split("#") : [],
      sParameterName,
      i;
    let split_str =
      window.location.href.length > 0 ? window.location.href.split("#") : [];
    sURLVariables =
      split_str != undefined && split_str.length > 1 && split_str[1].length > 0
        ? split_str[1].split("&")
        : [];
    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split("=");
      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined
          ? true
          : decodeURIComponent(sParameterName[1]);
      }
    }
  };


  const auth = () => {
    accessToken = getUrlParameter("access_token");
    let client_id = "";
    let redirect_uri = "http://localhost:5500/";
  
    const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;
    // Don't authorize if we have an access token already
    if (accessToken == null || accessToken == "" || accessToken == undefined) {
      window.location.replace(redirect);
    }
  };


const init = () => {
  currentCardIndex = 0
  const nbCards = cards.length - 1
  cards.forEach((card, i) => {
      
      const offsetX = `${i * spaceX}px`
      const offsetY = `${i * spaceY}px`
      
      card.style.setProperty('--offsetX', offsetX)
      card.style.setProperty('--offsetY', offsetY)
  
      const color = `rgb(0, ${255 - (i/30 * 255)}, 0)`
      card.style.setProperty('--color', color)
  
      const z = nbCards - i
      card.style.setProperty('--zIndex', z)

      card.innerHTML = ''
  
  })
}


  const getRecommandations = async () => {
    console.log("isFetching", isFetching);
    if (isFetching) return
    isFetching = true;
  
    //tracksContainer.innerHTML = "";
  
    const params = {
      params: {
        limit: 9,
        market: "FR",
        popularity: "90",
        seed_genres: "hip-hop",
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  
    const response = await axios.get(
      "https://api.spotify.com/v1/recommendations",
      params
    );
    const recommendations = response.data;
  
    isFetching = false;
  
    recommendations.tracks.forEach((track) => {
      createTrack(track);
    });
  };




  const createTrack = (track) => {
    const el = document.createElement("div");
    const img = document.createElement("img");
    
    const album = track.album;
    el.classList.add("track")
    img.classList.add("image")

    const artists = track.artists.map((artist) => {
      return artist.name;
    });
    
    const audio_player = track.preview_url
    ? `<audio class="track__audio" controls= "ture" src="${track.preview_url}">
  </audio>`
    : '';
    
    const inner = /*html*/ `
        <div class="track__album">
          <img src="${album.images[0].url}" alt="">
        </div>
        <div class="track__infos">
          <p class="name">${track.name}</p>
          <div class="artists">${artists}</div>
          <div class="audio">${audio_player}</div>
        </div>
    `;
    el.innerHTML = inner;
    img.src=album.images[0].url;
    cardsContainer.append(el)

    tracksContainer.append(el);
  el.addEventListener('click', () => {
    if(audio_player != '')
      playAudio(el)
  })
  };



function playAudio(el){
  const audioSelected = el.querySelector(".track__audio")
  audioSelected.volume = 0.1
  audioSelected.play()
  console.log(audioSelected);
}


const goNextCard = (isNext) => {
    console.log("click");
    if (currentCardIndex === cards.length) {
      init()
      return
    }
  
    const activeCard = cards[currentCardIndex]
  
    const left = isNext ? 80 : 20
    activeCard.style.setProperty('--left', `${left}%`)
  
    const mult = Math.random() > 0.5 ? 1 : -1
    const rotationX = Math.random() * 3 * mult 
    activeCard.style.setProperty('--rotationX', `${rotationX}deg`)
  
    currentCardIndex += 1
  
    activeCard.style.setProperty('--zIndex', cards.length + currentCardIndex)
    // setTimeout(() => {
    // }, 1000)
  }

  const addListeners = () => {
    btnPrev.addEventListener('click', () => {
        goNextCard(false)
    })
    btnNext.addEventListener('click', () => {
        goNextCard(true)
    })
  }


  auth()
  getRecommandations()
  addListeners()

  