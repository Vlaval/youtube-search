const search = document.getElementById('search');
const input = document.getElementById('search-input');
const searchResults = document.getElementById('results');

function getQueryString (queryObj = {}) {
  const queryStr = Object.keys(queryObj).reduce((acc, item) => {
    return acc += `${item}=${queryObj[item]}&`
  }, '');
  
  return queryStr.slice(0,-1);
}

function getFilteredRes (res) {
  const items = res.items;
  
  return items.map((item) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    imageUrl: item.snippet.thumbnails.default.url
  }));
}

function createHTMLString (resArr) {
  let str = '';
  
  resArr.forEach(item => {
    const { id, title, imageUrl } = item;

    str += (
      `<li class="row align-items-center">
        <img src=${imageUrl} class="img-fluid col-xs-3"/>
        <h3 class="col-xs-6">${title}</h3>
        <button class="btn btn-primary col-xs-3" data-video-id="${id}" data-img="${imageUrl}" data-title="${title}" data-history="true" onclick="loadVideo(event)">
          play
        </button>
      </li>`
    );
  });
  
  return str;
}

search.onsubmit = (e) => {
  e.preventDefault();
  
  const inputValue = input.value;
  const options = {
    part: 'snippet',
    q: inputValue,
    type: 'video',
    videoEmbeddable: 'true',
    key: 'AIzaSyBw01skNroHVuUroV1So3b1Ji4fLJUxtNI'
  }
  
  if (inputValue) {
    fetch(`https://www.googleapis.com/youtube/v3/search?${getQueryString(options)}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => getFilteredRes(res))
      .then(filtered => searchResults.innerHTML = createHTMLString(filtered))
      .catch(err => console.error(err)); 
  } else {
    console.error('empty search field');
  }
};

function deleteRecord (e) {
  const target = e.target;
  const id = target.dataset.id;
  const item = target.closest('li');
  
  fetch(`/${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(res => {
      console.log('res.message', res.message);
      if (res.message === 'ok') item.remove();
    })
    .catch(err => console.error(err));
}
