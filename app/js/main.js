import {bindScrollToLinks} from './scroll.js';
import {bindShareLinks} from './copy.js';
import {setupMobileMenu} from "./mobileMenu.js";

bindScrollToLinks();
bindShareLinks();
setupMobileMenu();

Fancybox.bind("[data-fancybox]", {});

document.addEventListener('DOMContentLoaded', function () {
  const offer = document.querySelector('.offer');
  const closeButton = document.querySelector('.offer__close');

  if (!localStorage.getItem('offerClosed')) {
    setTimeout(() => {
      offer.classList.add('active');
    }, Math.random() * (10000 - 7000) + 7000);
  }

  closeButton.addEventListener('click', () => {
    offer.classList.remove('active');
    offer.classList.add('disactive');

    localStorage.setItem('offerClosed', 'true');

    setTimeout(() => {
      offer.style.display = 'none';
    }, 500);
  });
});