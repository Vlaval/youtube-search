const history = document.getElementById('history');
const tag = document.createElement('script');
tag.src = "http://www.youtube.com/player_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let done = false;
let player;

function onYouTubePlayerAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'ivPEKaBHjYA',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(evt) {
  evt.target.playVideo();
}

function onPlayerStateChange(evt) {
  if (evt.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}

function stopVideo() {
  player.stopVideo();
}

function insertNewRecord (data) {
  const { _id, videoId, title, imageUrl } = data;
  let record = (
    `<li>
      <a data-video-id=${videoId} onclick="loadVideo(event)">${title}</a>
      <button class="btn btn-primary" data-id=${_id} onclick="deleteRecord(event)">delete</button>
    </li>`
  );

  history.innerHTML += record;
}

function loadVideo(e) {
  const target = e.currentTarget;
  const { videoId, img: imageUrl, title, history } = target.dataset;
  
  if (player) { 
    const videoInfo = { videoId, imageUrl, title };
    player.loadVideoById(videoId);
    
    if (history) {
      fetch('/save', {
        method: 'POST',
        body: JSON.stringify(videoInfo),
        headers: {
          'Content-type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(record => {
          console.log(record);
          insertNewRecord(record);
        })
        .catch(err => console.error(err)); 
    }
  }
}