// Fetch data
const mainUrl = "https://api.themoviedb.org/3/";
const apiKey = "50885572f509c83eb26eff90e8dbe3c3";
const imgUrl = "https://image.tmdb.org/t/p/original";

const configBannerList = {
  type: "loop",
  fixedWidth: 200,
  // height: 200,
  // perPage: 8,
  // perMove: 1,
  gap: 5,
  cover: true,
  isNavigation: true,
  // focus: 'center',
  breakpoints: {
    600: {
      // fixedWidth: 66,
      // height: 40,
      perPage: 1,
    },
  },
  autoplay: true,
  interval: 2000,
  pagination: false,
  // rewind: true,
  pauseOnHover: false, // must be false
  pauseOnFocus: false, // must be false
  classes: {
    // Add classes for arrows.
    arrows: "splide__arrows my-class-arrows",
    arrow: "splide__arrow my-class-arrow",
    prev: "splide__arrow--prev my-class-prev",
    next: "splide__arrow--next my-class-next",
  },
};

const configBannerCover = {
  type: "fade",
  heightRatio: 0.5,
  pagination: false,
  arrows: false,
  cover: true,
  height: 600,
};

function splitDate(date) {
  return date.split("-")[0];
}

function subString(str) {
  return str.substring(0, 150);
}

function checkHeight() {
  return window.scrollY > 34;
}

function fetchMovie(url) {
  return fetch(`${url}?api_key=${apiKey}`)
    .then((response) => response.json())
    .then((movies) => movies.results);
}

function fetchGenre(url) {
  return fetch(`${url}?api_key=${apiKey}`)
    .then((response) => response.json())
    .then((movies) => movies.genres);
}

function checkAutoPlay(button, bannerList) {
  if (button) {
    const pausedClass = "is-paused";

    // Remove the paused class and change the label to "Pause".
    bannerList.on("autoplay:play", function () {
      button.classList.remove(pausedClass);
      button.innerHTML = '<i class="fas fa-pause fa-sm"></i>';
      button.setAttribute("aria-label", "Pause Autoplay");
    });

    // Add the paused class and change the label to "Play".
    bannerList.on("autoplay:pause", function () {
      button.classList.add(pausedClass);
      button.innerHTML = '<i class="fas fa-caret-right fa-lg"></i>';
      button.setAttribute("aria-label", "Start Autoplay");
    });

    // Toggle play/pause when the button is clicked.
    bannerList.on(
      "click",
      function () {
        const flag = 99;
        const Autoplay = bannerList.Components.Autoplay;

        if (button.classList.contains(pausedClass)) {
          Autoplay.play(flag);
        } else {
          Autoplay.pause(flag);
        }
      },
      button
    );
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  let url = mainUrl + "trending/movie/week";
  const movies = await fetchMovie(url);
  updateBanner(movies);

  let moviesTrend = movies.map((movie) => movie.title);

  let urlMovies = mainUrl + "discover/movie";
  const moviesCards = await fetchMovie(urlMovies);
  updateMovie(moviesCards, moviesTrend);

  let urlGenre = mainUrl + "genre/movie/list";
  const moviesGenre = await fetchGenre(urlGenre);
  let genreList = "";
  let genreNavList = "";
  moviesGenre.forEach((genre) => {
    genreNavList += `<a class="dropdown-item text-white" href="#${genre.id}">${genre.name}</a>`;
  });

  const genreNav = document.querySelector(".genreNav");
  genreNav.innerHTML = genreNavList;
  // genreBody.innerHTML = genreList;

  let urlActor = mainUrl + "trending/person/week";
  const actors = await fetchMovie(urlActor);
  updateActor(actors);

  const bannerList = new Splide("#bannerList-slider", configBannerList).mount();
  const bannerCover = new Splide("#bannerCover-slider", configBannerCover); // do not call mount() here.

  bannerCover.sync(bannerList).mount();

  const button = document.querySelector(".splide__play-pause");
  checkAutoPlay(button, bannerList);
});

window.addEventListener("scroll", function () {
  let height = checkHeight();
  const myNavbar = document.querySelector(".my__navbar");
  const dropdown = document.querySelector(".genreNav");
  if (height) {
    myNavbar.classList.add("bg-light");
    myNavbar.classList.add("d-none");
    dropdown.classList.remove("show");
    // myNavbar.classList.remove("fixed-top");
  } else {
    // myNavbar.classList.add("fixed-top");
    myNavbar.classList.remove("bg-light");
    myNavbar.classList.remove("d-none");
  }
});

function showBanner(movie) {
  return `
    <li class="splide__slide">
        <div class="banner__wrapper">
            <img src="${imgUrl}${movie.backdrop_path}" alt="">
            <div class="banner__information">
                <h1 class="banner__title text-ellipsis-2">
                ${movie.title}
                </h1>
                <div class="banner__reviews" style="margin: 15px 0;">
                    <span class="my-text"><i class="fas fa-star"></i>${
                      movie.vote_count
                    } Reviews</span>
                    <span class="my-text">TheMovieDB ${
                      movie.vote_average
                    }</span>
                    <span class="my-text">${splitDate(
                      movie.release_date
                    )}</span>
                </div>
                <p class="my-text text-ellipsis-3" style="margin: 15px 0;">${
                  movie.overview
                }</p>
                <a href="#${
                  movie.id
                }" class="btn my__btnPrimary d-flex">Watch Now <span class="ml-2"><i
                            class="fas fa-caret-right fa-2x"></i></span></a>
            </div>
        </div>
    </li>
    `;
}

function showList(movie) {
  return `
    <li class="splide__slide mt-3">
        <div class="card border-0">
            <img src="${imgUrl}${movie.poster_path}">
            <div class="card-body">
            <h5 class="card-title text-ellipsis my-card-title">${
              movie.title
            }</h5>
            <p class="card-text " style="font-size:13px;">${splitDate(
              movie.release_date
            )}.</p>
            </div>
        </div>
    </li>
    `;
}

function updateBanner(movies) {
  let listBanner = "";
  let listBody = "";
  movies.forEach((movie) => {
    listBanner += showBanner(movie);
    listBody += showList(movie);
  });
  const bannerBody = document.querySelector(".my__bannerBody");
  const bodyList = document.querySelector(".my__listBody");
  bannerBody.innerHTML = listBanner;
  bodyList.innerHTML = listBody;
}

function updateMovie(moviesCards, moviesTrend) {
  let contentCards = "";
  moviesCards.forEach((card) => {
    if (!moviesTrend.includes(card.title)) {
      contentCards += showCards(card);
    }
  });
  const myContentCard = document.querySelector(".my__contentCard");
  myContentCard.innerHTML = contentCards;
  // console.log(moviesCards);
}

function showCards(card) {
  return `<div class="my__cardContent">
  <div class="card border-0 pt-3 pl-3 bg-crem">
  <a href="#${card.id}" class="wrapper__cardList ">
      <div class="img__wrapper">
        <img src="${imgUrl}${
    card.poster_path
  }" class="card-img-top my__imgContent" >
      </div>
      <h5 class="card-title mb-0 text-ellipsis my-card-title" >${card.title}
      </h5>
      <p class="card-text" style="font-size:13px;">${splitDate(
        card.release_date
      )}.</p>
      </a>
  </div>
</div>`;
}

function updateActor(actors) {
  let actorList = "";
  actors.forEach((actor) => {
    actorList += showActorCard(actor);
  });

  const actorBody = document.querySelector(".my__actorCard");
  actorBody.innerHTML = actorList;
}

function showActorCard(actor) {
  return `
    <div class="my__cardContent">
      <div class="card border-0 pt-3 pl-3 bg-crem">
          <a href="#${actor.id}" class="wrapper__cardList" style="text-decoration:none;color:#212529;">
              <div class="img__wrapper rounded-circle">
                  <img src="${imgUrl}${actor.profile_path}"
                      class="card-img-top rounded-circle my__imgContent" style="height: 150px;">
              </div>
              <h5 class="card-title mb-0 text-ellipsis text-center my-card-title"
                  >${actor.name}
              </h5>
          </a>
      </div>
    </div>
    `;
}
