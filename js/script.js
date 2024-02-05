const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
};

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
async function SearchApiData() {
  const API_KEY = KEY;
  const API_URL = "https://api.themoviedb.org/3/";
  ShowSpinner();
  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}`
  );
  const data = await response.json();
  HideSpinner();
  return data;
}
async function Search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  if (global.search.term !== "" && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await SearchApiData();
    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      ShowAlert("No results found");
      return;
    }
    console.log(document.querySelector("#search-term").value);
    DisplaySearchResults(results);
    //document.querySelector("#search-term").value = "";
  } else {
    ShowAlert("Enter a search term");
  }
}

function DisplaySearchResults(results) {
  console.log(document.querySelector("#search-term").value);
  results.forEach((result, x) => {
    div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="${global.search.type}-details.html?id=${result.id}">
     ${
       result.poster_path
         ? ` <img
     src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
     class="card-img-top"
     alt="${global.search.type === "movie" ? result.title : result.name}"
   />`
         : `<img
   src="images/no-image.jpg"
   class="card-img-top"
   alt="${global.search.type === "movie" ? result.title : result.name}"
 />`
     }
    </a>
    <div class="card-body">
      <h5 class="card-title">${
        global.search.type === "movie" ? result.title : result.name
      }</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${
          global.search.type === "movie"
            ? result.release_date
            : result.first_air_date
        }</small>
      </p>
    </div>
  `;
    console.log(div);
    document.querySelector("#search-results-heading").innerHTML = `<h2>Found ${
      global.search.totalResults
    } results for the ${global.search.term} ${
      document.querySelector("#search-term").value
    } <\h2>`;
    document.querySelector("#search-results").appendChild(div);
  });
}

function ShowAlert(message, className = "error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
}

//Display slider movies
async function DisplaySlider() {
  const { results } = await FetchAPIData("movie/now_playing");
  console.log(results);

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
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
    </a>
    <h4 class="swiper-rating">
      <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
        1
      )} / 10
    </h4>
 `;
    document.querySelector(".swiper-wrapper").appendChild(div);
    InitSwiper();
  });
}

function InitSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

//display backdrop of details page for movies or shows
async function DisplayBackgroundImage(type, path) {
  const overlay = document.createElement("div");
  overlay.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${path})`;
  overlay.style.backgroundSize = "cover";
  overlay.style.backgroundPosition = "center";
  overlay.style.backgroundRepeat = "no-repeat";
  overlay.style.height = "100vh";
  overlay.style.width = "100vw";
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.zIndex = "-1";
  overlay.style.opacity = "0.1";

  if (type === "movie")
    document.querySelector("#movie-details").appendChild(overlay);
  else document.querySelector("#show-details").appendChild(overlay);
}

async function DisplayMovieDetails() {
  const movieId = window.location.search.split("=")[1];
  const movie = await FetchAPIData(`movie/${movieId}`);
  DisplayBackgroundImage("movie", movie.backdrop_path);
  const div = document.createElement("div");
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

async function DisplayShowDetails() {
  const showId = window.location.search.split("=")[1];
  const show = await FetchAPIData(`tv/${showId}`);
  DisplayBackgroundImage("tv", show.backdrop_path);
  console.log(show);
  const div = document.createElement("div");
  show.genres.forEach((genre) => console.log(genre.name));
  div.innerHTML = `    <div class="details-top">
  <div>
  ${
    show.poster_path
      ? ` <img
      src="https://image.tmdb.org/t/p/w500${show.poster_path}"
      class="card-img-top"
      alt="${show.name}"
      />`
      : `<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="${show.name}"
      />`
  }
  </div>
  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${show.first_air_date}</p>
    <p>
      ${show.overview}
    </p>
    <h5>Genres</h5>
 
    <ul class="list-group">
    ${show.genres.map((genre) => `<li> ${genre.name} <\li>`).join("")}
    

    </ul>
    <a href="${
      show.homepage
    }" target="_blank" class="btn">Visit Show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number Of Episodes:</span> ${
      show.number_of_episodes
    }</li>
    <li>
      <span class="text-secondary">Last Episode To Air:</span> ${
        show.last_episode_to_air.name
      }
    </li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group"><span>${show.production_companies.map(
    (company) => " " + company.name
  )}</span></div>
</div>`;

  document.querySelector("#show-details").appendChild(div);
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
      DisplaySlider();
      DisplayPopularMoviesToDOM();
      break;
    case "/shows.html":
      DisplayPopularShowsToDOM();
      break;
    case "/movie-details.html":
      DisplayMovieDetails();
      break;
    case "/tv-details.html":
      DisplayShowDetails();
      break;
    case "/search.html":
      Search();
      break;
  }
  HightlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
