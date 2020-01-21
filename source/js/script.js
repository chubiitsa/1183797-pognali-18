var navMain = document.querySelector(".page-header__menu-wrapper");
var navToggle = document.querySelector(".main-menu__toggle");
var navToggleIcon = navToggle.querySelector(".main-menu__toggle-icon");
var catalogToggle = document.querySelector(".catalog-filter__toggle");
var catalogFilter = document.querySelector(".catalog-filter__container");
var popup = document.querySelector(".modal");

navToggle.addEventListener("click", function () {
  navMain.classList.toggle("main-menu--opened");
  navToggleIcon.classList.toggle("main-menu__toggle-icon--close");
});

catalogToggle.addEventListener("click", function () {
  catalogFilter.classList.toggle("catalog-filter__container--opened");
});


svg4everybody();
