const global = { currentPage: window.location.pathname };

function HightlightActiveLink(e) {
  const activeLink = document.querySelectorAll(".nav-link");
  activeLink.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage)
      link.classList.add("active");
  });
}
async function FetchAPIData(endpoint) {
  const API_KEY = KEY;
  const API_URL = "https://api.themoviedb.org/3/";

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = response.json();
  return data;
}

async function DisplayPopularShowsToDOM() {
  const { results } = await FetchAPIData("tv/popular");
  console.log(results);
  const list = document.querySelector("#popular-shows");
  results.forEach((show, x) => {
    console.log(show.name);
    div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
       ${
         show.poster_path
           ? ` <img
       src="https://image.tmdb.org/t/p/w500${show.poster_path}"
       class="card-img-top"
       alt="${show.title}"
     />`
           : `<img
     src="images/no-image.jpg"
     class="card-img-top"
     alt="${show.title}"
   />`
       }
      </a>
      <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${show.first_air_date}</small>
        </p>
      </div>
    `;
    console.log(div);
    list.appendChild(div);
  });
}

async function DisplayPopularMoviesToDOM() {
  const { results } = await FetchAPIData("movie/popular");
  console.log(results);
  const list = document.querySelector("#popular-movies");
  results.forEach((movie, x) => {
    div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
     ${
       movie.poster_path
         ? ` <img
     src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
     class="card-img-top"
     alt="${movie.title}"
   />`
         : `<img
   src="images/no-image.jpg"
   class="card-img-top"
   alt="${movie.title}"
 />`
     }
    </a>
    <div class="card-body">
      <h5 class="card-title">${movie.title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${movie.release_date}</small>
      </p>
    </div>
  `;
    console.log(div);
    list.appendChild(div);
  });
}

function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      DisplayPopularMoviesToDOM();
      break;
    case "/shows.html":
      DisplayPopularShowsToDOM();
      break;
    case "/movie-details.html":
      console.log("movie details");
      break;
    case "/tv-details.html":
      console.log("tv details");
      break;
    case "/search.html":
      console.log("search");
      break;
  }
  HightlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
