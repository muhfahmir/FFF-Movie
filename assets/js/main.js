let loadContent;
document.addEventListener("DOMContentLoaded", async function () {
  function loadNav() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.querySelectorAll(".navbar-nav").forEach((elemen) => {
          elemen.innerHTML = xhttp.responseText;
        });

        document
          .querySelector(".navbar-brand")
          .addEventListener("click", () => {
            loadContent("home");
          });

        document.querySelectorAll(".navbar-nav a").forEach((elemen) => {
          elemen.addEventListener("click", (event) => {
            let pageId;
            if (elemen.classList.contains("dropdown-toggle")) {
              let genreLink = document.querySelectorAll(
                ".genreNav .my__navLink"
              );
              genreLink.forEach((link) => {
                pageId = link.getAttribute("id");
              });
            } else {
              pageId = elemen.getAttribute("id");
            }
            // console.log(pageId);

            document
              .querySelector("#navbarSupportedContent")
              .classList.remove("show");
            let current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            elemen.classList.add("active");
            loadContent(pageId);
          });
        });
      }
    };
    xhttp.open("GET", `parts/navbar.html`, true);
    xhttp.send();
  }

  loadContent = (pageId) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let content = document.querySelector("#bodyContent");
        content.innerHTML = this.responseText;
        getContent(pageId);
      }
    };
    xhttp.open("GET", `pages/content.html`, true);
    xhttp.send();
  };
  loadNav();
  loadContent("home");
});
