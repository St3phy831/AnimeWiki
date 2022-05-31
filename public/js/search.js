// created separate script file because on search view can't have the other
// references to elements that don't exist there

let searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener("click", displaySearch);
let searchResults = document.querySelector('#searchResults');
let searchTitle = document.querySelector('#searchTitle');

searchTitle.style.display = "none";

async function displaySearch(){
  let search = document.querySelector('#animeSearch');
  // Resets search results
  searchResults.innerHTML = "";
  // Displays Results Title
  searchTitle.style.display = "block";
  if (search.value == ""){
    searchResults.innerHTML = "No Results";
  }else{
    // API for Anime Shows Info
    let url = `https://api.jikan.moe/v4/anime?q=${search.value}&order_by=popularity`;
    let results = await fetchData(url);
    let numberOfResults = results.pagination.items.count;
    let resultsArr = [];
    // Checks whether there's any shows found
    if (numberOfResults){
      // limits it to 6 results
      for (let i = 0; i < 6; i++){
        // It should break if there are no other shows
        if (i >= numberOfResults){
            break;
          }
        if (results.data[i].synopsis == null){
          continue;
        }
        resultsArr.push(results.data[i]);
      }
      formatSeachResults(resultsArr);
    }else{
      searchResults.innerHTML = "No Results";
    }
  }
}
async function formatSeachResults(resultsArr){
  let userId = document.querySelector("#userId").value;
  // After adding no more than 6 shows, this function will create the card views
  // for each
  for (let i = 0; i < resultsArr.length; i+=2){
    // Creates a div element to display two shows side by side
    newElem = document.createElement('div');
    newElem.setAttribute("class", "animeCard");
    for(let j = i; j < i+2; j++){
      // It should break if there are no other shows
      if (j >= resultsArr.length){
        break;
      }
      // get quote API for anime show if applicable
      // NOTE: Commented out because exceeded rate limit of requests
      let quoteUrl = `https://animechan.vercel.app/api/quotes/anime?title=${resultsArr[j].title}`;
      let data = await fetchData(quoteUrl);
      let quote, character;
      if (data.error){
        quote = "No Quote Available";
        character = "";
      }else{
        quote = '"' + data[0].quote + '"';
        character = "<b>Character:</b> " + data[0].character;
      }
      // Adds content about each show
      // And has form to send data about show user wants to add
      newElem.innerHTML += 
      `<div class="card text-light bg-info w-75">
        <div class="card-body">
          <form method="POST" action="/addToWatchlist">
            <input type="hidden" name="title" value="${resultsArr[j].title}">
            <input type="hidden" name="imgUrl" value="${resultsArr[j].images.jpg.small_image_url}">
            <input type="hidden" name="id" value="${userId}">
            <div class="add"><button class="btn btn-success">✓</button></div>
          </form>
          <h5 class="card-title">${resultsArr[j].title}</h5>
          <br>
          <div class="animeInfo">
            <img class="card-img-top" src="${resultsArr[j].images.jpg.large_image_url}" alt="${resultsArr[j].title} image">
            <div>
              <p><b>Synopsis:</b> ${resultsArr[j].synopsis.length < 350 ? resultsArr[j].synopsis : (resultsArr[j].synopsis.substring(0, 350) + '...')}</p>
              <p><b>Rating:</b> ${resultsArr[j].rating}</p>
              <p><b>Popularity:</b> ${resultsArr[j].popularity}</p>
            </div>
          </div>
          <br>
          <div class="container">
            <button type="button" class="btn btn-primary" data-toggle="collapse" data-target="#search${j}">Get Quote</button>
            <div id="search${j}" class="collapse">
              ${character}
              <br>
              ${quote}
            </div>
          </div>
        </div>
      </div>`;
    }
    searchResults.appendChild(newElem);
  }
}
async function fetchData(url){
  let response = await fetch(url);
  let data = await response.json();
  return data;
}