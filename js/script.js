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

  ShowSpinner();
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = response.json();

  HideSpinner();
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

async function DisplayMovieDetails() {
  const movieId = window.location.search.split("=")[1];

  const movie = await FetchAPIData(`movie/${movieId}`);
  console.log(movie);
  const div = document.createElement("div");
  movie.genres.forEach((genre) => console.log(genre.name));
  div.innerHTML = ` <div class="details-top">
  <div>
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
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>
      ${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href="${
      movie.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${AddCommasToNumber(
      movie.budget
    )}</li>
    <li><span class="text-secondary">Revenue:</span> $${AddCommasToNumber(
      movie.revenue
    )}</li>
    <li><span class="text-secondary">Runtime:</span> ${
      movie.runtime
    } minutes</li>
    <li><span class="text-secondary">Status:</span> ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group"> <span>  ${movie.production_companies.map(
    (company) => " " + company.name
  )}
  </span>
</div>`;

  document.querySelector("#movie-details").appendChild(div);
}

function AddCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

function ShowSpinner() {
  document.querySelector(".spinner").classList.add("show");
}
function HideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
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
      DisplayMovieDetails();
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
