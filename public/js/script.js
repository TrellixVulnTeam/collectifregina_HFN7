'use strict';
const navSlide = function () {
  const burger = document.querySelector('.nav__burger');
  const nav = document.querySelector('.nav__menu');
  const navItems = document.querySelectorAll('.nav__item');

  // Toggle nav
  burger.addEventListener('click', function () {
    nav.classList.toggle('nav--active');

    navItems.forEach((item, i) => {
      if (item.style.animation) {
        item.style.animation = '';
      } else {
        item.style.animation = `navLinkFade 0.5s ease forwards ${i / 13 + 0.3}s`;
      }
    })
    // Burger animation
    burger.classList.toggle('toggle');
  });

}

  navSlide();