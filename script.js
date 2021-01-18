const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

//Search by song or artist
//Using fetch
/* function searchSongs(therm) {
  fetch(`${apiURL}/suggest/${therm}`)
    .then(res => res.json())
    .then(data => console.log(data));
} */

//Using await
async function searchSongs(therm) {
  const res = await fetch(`${apiURL}/suggest/${therm}`)
  const data = await res.json();

 showData(data);
}

//Show song in DOM
function showData(data) {
// Using forEach
/*   let output = '';

  data.data.forEach(song => {
    output += `
      <li>
        <span>
          <strong>${song.artist.name}</strong>
        </span>
        <button 
          class="btn" 
          data-artist="${song.artist.name}"
          data-songtitle="${song.title}">
          Get Lyrics
        </button>
      </li>
    `
  });

  result.innerHTML = `
    <ul class='songs'>
      ${output}
    <ul>
  `; */

  // Using map
  result.innerHTML = `
  <ul class='songs'>
    ${data.data.map(song => 
     `
        <li>
        <span>
          <strong>${song.artist.name}</strong>
        </span>
        <button 
          class="btn" 
          data-artist="${song.artist.name}"
          data-songtitle="${song.title}">
          Get Lyrics
        </button>
        </li>`)
        .join('')}
  <ul> `

  if(data.prev || data.next) {
    more.innerHTML = `  
      ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
      ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
    `;
  } else {
    more.innerHTML = ''
  }
}

// Get prev next results
async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
  const data = await res.json();

 showData(data);
}

// Get Lirics for song

async function getLyrics(artist,songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
  

  result.innerHTML = `
    <h2><strong>${artist}</strong>-${songTitle}</h2>
    <span>${lyrics}</span>
  `
  more.innerHTML = ''
}

// Event listerners
form.addEventListener('submit', e=> {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert('Please type some word')
  } else {
    searchSongs(searchTerm)
  }
  
})

//Get lyrics button click

result.addEventListener('click', e => {
  const clickedEl = e.target;

  if(clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');

    getLyrics(artist,songTitle)
  }
})