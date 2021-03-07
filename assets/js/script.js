// Fetch data
const mainUrl = "https://api.themoviedb.org/3/";
const apiKey = "50885572f509c83eb26eff90e8dbe3c3";
const imgUrl = "https://image.tmdb.org/t/p/original";

let bodyActors, bodyContent, bodyBanner;

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

function runTime(timer) {
  let time = timer;
  let jam = 0,
    menit = 0;
  if (time > 60) {
    jam = Math.floor(time / 60);
    time = time - jam * 60;
  }
  menit = time;
  let runtime = `${jam != 0 ? `${jam}h ` : ""}${menit != 0 ? `${menit}m` : ""}`;
  return runtime;
}
function fetchMovie(url) {
  return fetch(`${url}?api_key=${apiKey}`)
    .then((response) => response.json())
    .then((response) => response.results);
}

function fetchMovieDetail(url) {
  return fetch(`${url}?api_key=${apiKey}`)
    .then((response) => response.json())
    .then((response) => response);
}

function fetchGenre(url) {
  return fetch(`${url}?api_key=${apiKey}`)
    .then((response) => response.json())
    .then((response) => response.genres);
}

function fetchActor(url) {
  return fetch(`${url}?api_key=${apiKey}`)
    .then((response) => response.json())
    .then((results) => results.cast);
}
function scrollTop() {
  return scroll({
    top: 0,
    behavior: "smooth",
  });
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

async function getContent(pageId = "home") {
  if (pageId == "home") {
    let url = mainUrl + "trending/movie/week";
    const movies = await fetchMovie(url);
    updateBanner(movies);

    let moviesTrend = movies.map((movie) => movie.title);

    let urlMovies = mainUrl + "discover/movie";
    const moviesCards = await fetchMovie(urlMovies);
    updateMovie(moviesCards, moviesTrend);

    let urlGenre = mainUrl + "genre/movie/list";
    const moviesGenre = await fetchGenre(urlGenre);
    let genreNavList = "";
    moviesGenre.forEach((genre) => {
      genreNavList += `<a class="dropdown-item text-white my__navLink" id="${genre.id}">${genre.name}</a>`;
    });

    const genreNav = document.querySelector(".genreNav");
    genreNav.innerHTML = genreNavList;
    // genreBody.innerHTML = genreList;

    let urlActor = mainUrl + "trending/person/week";
    const actors = await fetchMovie(urlActor);
    updateActor(actors);

    const bannerList = new Splide(
      "#bannerList-slider",
      configBannerList
    ).mount();
    const bannerCover = new Splide("#bannerCover-slider", configBannerCover); // do not call mount() here.

    bannerCover.sync(bannerList).mount();

    const button = document.querySelector(".splide__play-pause");
    checkAutoPlay(button, bannerList);
  } else if (pageId == "all-movies") {
    // tampilkan seluruh film
    console.log("haii");
  } else {
    console.log("bai");
    // tampilkan film berdasarkan genre
  }

  // link di klik
  const myLinks = document.querySelectorAll(".my-link");
  // console.log(myLinks);
  myLinks.forEach((link) => {
    link.addEventListener("click", async function (e) {
      const pageId = link.getAttribute("id");
      // console.log(pageId);
      scrollTop();
      let navLink = document.querySelector(".my__navLink.active");
      // navLink.classList.remove("active");
      console.log(navLink);
      // navLink.classList.replace("active", "");
      // console.log(navLink);
      let urlActor = `${mainUrl}movie/${pageId}/credits`;
      let actors = await fetchActor(urlActor);
      actors = actors.sort((a, b) => a.popularity - b.popularity).reverse();

      // gender 1 = cewek
      // gender 2 = cowok
      // console.log(actors);
      let actorsCard = "";
      let director = "";
      let index;
      actors.forEach((actor, i) => {
        if (i < 20 && actor.known_for_department == "Acting") {
          actorsCard += showActorCard(actor, true);
        }
        if (i > 20 && actor.known_for_department == "Acting") {
          index = 20;
        }
        if (actor.known_for_department == "Directing") {
          director += `<p class="mb-0">${actor.name}</p>`;
        }
      });

      const actorBody = `
      <div class="container">
          <div class="card border-0 bg-crem ">
              <div
                  class="card-header d-flex justify-content-between align-content-center align-items-center bg-transparent">
                  <h3 class="content-title">Top Cast</h3>
                  <a href="#">${index == 20 ? "Explore All" : ""}</a>
              </div>
              <div class="card-body pl-3 pt-0">
                  <div class="row my__actorCard scrolling-wrapper-flexbox ">
                    ${actorsCard}
                  </div>
              </div>
          </div>
      </div>
      `;
      bodyContent.innerHTML = actorBody;

      let url = `${mainUrl}movie/${pageId}`;
      const movies = await fetchMovieDetail(url);
      let listGenre = "";
      movies.genres.forEach((genre, i) => {
        i == movies.genres.length - 1
          ? (listGenre += genre.name)
          : (listGenre += genre.name + ", ");
      });

      let urlVideo = `${mainUrl}movie/${pageId}/videos`;
      let videoList = "";
      const videos = await fetchMovie(urlVideo);
      videos.forEach((video) => {
        videoList += `<div class="col">
<iframe width="100%" height="500px" src="https://www.youtube.com/embed/${video.key}">
</iframe>
</div>`;
      });
      // console.log(movies);

      bodyBanner.innerHTML = `
      <img src="${imgUrl}${
        movies.backdrop_path
      }" alt="" style="position:absolute;width:100%;height:670px;"/>
      <div class="container py-4">
        <ul class="nav nav-pills mt-5 mb-3" id="pills-tab" role="tablist" style="position:absolute;z-index:1;left:40%;">
          <li class="nav-item" role="presentation">
            <a class="nav-link active" id="pills-overview-tab" data-toggle="pill" href="#pills-overview" role="tab" aria-controls="pills-overview" aria-selected="true">Overview</a>
          </li>
          <li class="nav-item ml-3" role="presentation">
            <a class="nav-link" id="pills-trailer-tab" data-toggle="pill" href="#pills-trailer" role="tab" aria-controls="pills-trailer" aria-selected="false">Trailer</a>
          </li>
        </ul>
        <div class="tab-content" id="pills-tabContent">
          <div class="tab-pane fade show active" id="pills-overview" role="tabpanel" aria-labelledby="pills-overview-tab">
            <div class="row" style="margin-top:110px;">

              <div class="col-4">
                <div class="card card-featured">
                  <div class="img__wrapper">
                    <img src="${imgUrl}${
        movies.poster_path
      }" class="card-img-top" alt="" height="400"/>
                  </div>
                  <div class="card-body">
                    <h5 class="card-title text-center">${movies.title}</h5>
                  </div>
                </div>
              </div>

              <div class="col-7 offset-1 d-flex align-items-center">
                <div class="banner__description w-100 " >
                <h1 class="banner__title">${movies.title} (${splitDate(
        movies.release_date
      )})</h1>
      <p >
        <span class="genres my-text">${listGenre}</span>
        <span class="runtime my-text">${runTime(movies.runtime)}</span>
      </p>

      <span class="my-text" style="font-style:italic">${
        movies.tagline == "" ? "" : movies.tagline
      }</span>
                <h4>Overview</h4>
                  <span class="my-text" >${movies.overview}
                  </span>
                  ${
                    director != ""
                      ? `<h4 class="mt-2">Director</h4>
                  ${director}`
                      : ""
                  }
                </div>
              </div>

            </div>

          </div>

          <div class="tab-pane fade" id="pills-trailer" role="tabpanel" aria-labelledby="pills-trailer-tab">
            
<div class="row" style="margin-top:110px">
  ${videoList}
</div>
            </div>

          </div>
          </div>
        </div>
      </div>`;

      // Related Movie
      let urlMovie = `${mainUrl}movie/${pageId}/similar`;
      const relatedMovie = await fetchMovie(urlMovie);
      let listMovie = "";
      relatedMovie.forEach((movie) => {
        listMovie += showCards(movie);
      });
      const myMoviesCard = `${
        listMovie != ""
          ? `<div class="container">
          <div class="card border-0 bg-crem ">
              <div
                  class="card-header d-flex justify-content-between align-content-center align-items-center bg-transparent">
                  <h3 class="content-title">Related Movies</h3>
                  <a href="#" class="my-link" id="movies">Explore All</a>
              </div>
              <div class="card-body pl-3 pt-0">
                  <div class="row my__contentCard scrolling-wrapper-flexbox">
                    ${listMovie}
                  </div>
              </div>
          </div>
      </div>`
          : ""
      }
  
  `;
      bodyActors.innerHTML = myMoviesCard;

      // https://api.themoviedb.org/3/movie/484718/similar?api_key=50885572f509c83eb26eff90e8dbe3c3&language=en-US&page=1

      // console.log(pageId);
      // fetch data id movie
      // https://api.themoviedb.org/3/movie/649087?api_key=50885572f509c83eb26eff90e8dbe3c3&language=en-US
      // masukkan data ke tampilan detail
    });
  });

  // actor di klik
  const actorLinks = document.querySelectorAll(".actor-link");
  actorLinks.forEach((link) => {
    link.addEventListener("click", async function (e) {
      const pageId = link.getAttribute("id");
      document.querySelector(".navbar-nav a.active").classList.remove("active");
      // ambil data diri orang
      // https://api.themoviedb.org/3/person/{person_id}?api_key=<<api_key>>&language=en-US
      // ambil data film yang pernah dimainkan
      // https://api.themoviedb.org/3/person/{person_id}/movie_credits?api_key=<<api_key>>
      console.log(pageId);
    });
  });

  // Search
  // https://api.themoviedb.org/3/search/movie?api_key=<<api_key>>&language=en-US&page=1&include_adult=false&query=
}

function showBanner(movie) {
  return `
    <li class="splide__slide">
        <div class="banner__wrapper">
        ${
          movie.backdrop_path != null
            ? `<img src="${imgUrl}${movie.backdrop_path}" alt="">`
            : ""
        }
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
                <p class="my-text text-ellipsis-3" >${movie.overview}</p>
                <a id="${
                  movie.id
                }" class="btn my__btnPrimary d-flex my-link">Watch Now <span class="ml-2"><i
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
            <img src="${
              movie.poster_path == null
                ? `assets/images/no-image.jpg`
                : `${imgUrl}${movie.poster_path}`
            }" style="border-radius:.25rem">
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
  const bannerBody = `
  <div id="bannerCover-slider" class="splide">
    <div class="splide__track">
        <ul class="splide__list my__bannerBody">
          ${listBanner}
        </ul>
    </div>
  </div>
  <div id="bannerList-slider" class="splide container" style="margin-top: -150px;">
    <h3 class="content-title text-white">Trending Movies</h3>
    <div class="splide__track ">
        <ul class="splide__list my__listBody ">
          ${listBody}
        </ul>
    </div>
    <div class="splide__optional-button-container ">
        <button class="splide__play-pause text-center" aria-controls="splide-track"><i
                class="fas fa-pause fa-sm"></i></button>
    </div> 
  </div>`;
  bodyBanner = document.querySelector("#banner");
  bodyBanner.innerHTML = bannerBody;
}

function updateMovie(moviesCards, moviesTrend) {
  let contentCards = "";
  moviesCards.forEach((card) => {
    if (!moviesTrend.includes(card.title)) {
      contentCards += showCards(card);
    }
  });
  const myContentCard = `
  <div class="container">
      <div class="card border-0 bg-crem ">
          <div
              class="card-header d-flex justify-content-between align-content-center align-items-center bg-transparent">
              <h3 class="content-title">New Movies</h3>
              <a href="#" class="my-link" id="movies">Explore All</a>
          </div>
          <div class="card-body pl-3 pt-0">
              <div class="row my__contentCard scrolling-wrapper-flexbox">
                ${contentCards}
              </div>
          </div>
      </div>
  </div>
  `;
  bodyContent = document.querySelector("#content");
  bodyContent.innerHTML = myContentCard;
  // myContentCard.innerHTML = contentCards;
  // console.log(moviesCards);
}

function showCards(card) {
  return `<div class="my__cardContent">
  <div class="card border-0 pt-3 pl-3 bg-crem">
  <a  class="wrapper__cardList my-link movie" id="${card.id}">
      <div class="img__wrapper">
        <img src="${
          card.poster_path == null
            ? "assets/images/no-image.jpg"
            : `${imgUrl}${card.poster_path}`
        }" class="card-img-top my__imgContent" >
      </div>
      <h5 class="card-title mb-0 text-ellipsis my-card-title" >${card.title}
      </h5>
      <p class="card-text" style="font-size:13px;">${
        card.release_date != null ? `${splitDate(card.release_date)}.` : ""
      }</p>
      </a>
  </div>
</div>`;
}

function updateActor(actors) {
  let actorList = "";
  actors.forEach((actor) => {
    actorList += showActorCard(actor);
  });

  const actorBody = `
  <div class="container">
      <div class="card border-0 bg-crem ">
          <div
              class="card-header d-flex justify-content-between align-content-center align-items-center bg-transparent">
              <h3 class="content-title">Famous Actors</h3>
              
          </div>
          <div class="card-body pl-3 pt-0">
              <div class="row my__actorCard scrolling-wrapper-flexbox ">
                ${actorList}
              </div>
          </div>
      </div>
  </div>
  `;
  bodyActors = document.querySelector("#actors");
  bodyActors.innerHTML = actorBody;
}

function showActorCard(actor, detail = false) {
  return `
    <div class="my__cardContent" style="width:170px;">
      <div class="card border-0 pt-3 pl-3 bg-crem">
          <a  class="wrapper__cardList actor-link" id="${
            actor.id
          }" style="text-decoration:none;color:#212529;">
              <div class="img__wrapper rounded-circle" style="width:150px;">
                  <img src="${
                    actor.profile_path == null
                      ? "assets/images/default.jpg"
                      : `${imgUrl}${actor.profile_path}`
                  } "
                      class="card-img-top rounded-circle my__imgContent" style="height: 150px;">
              </div>
              <h5 class="card-title mb-0 text-center my-card-title" style="font-weight:600;color:black;"
                  >${actor.name}
              </h5>
              ${
                detail ? `<center><span>${actor.character}</span></center>` : ""
              }
          </a>
      </div>
    </div>
    `;
}

window.addEventListener("scroll", function () {
  let height = checkHeight();
  const myNavbar = document.querySelector(".my__navbar");
  const dropdown = document.querySelector(".genreNav");
  if (height) {
    // myNavbar.classList.add("bg-light");
    // myNavbar.classList.add("d-none");
    myNavbar.classList.add("go-up");
    dropdown.classList.remove("show");
    // myNavbar.classList.remove("fixed-top");
  } else {
    // myNavbar.classList.add("fixed-top");
    myNavbar.classList.remove("go-up");
    // myNavbar.classList.remove("bg-light");
    // myNavbar.classList.remove("d-none");
  }
});
