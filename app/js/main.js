import {bindScrollToLinks} from './scroll.js';
import {bindShareLinks} from './copy.js';
import {setupMobileMenu} from "./mobileMenu.js";

bindScrollToLinks();
bindShareLinks();
setupMobileMenu();

Fancybox.bind("[data-fancybox]", {});

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: ".price",
  start: "top center",
  once: true,
  onEnter: () => {
    gsap.to(".price", {
      maxWidth: "100%",
      duration: 1.3,
      onComplete: () => {
        ScrollTrigger.update();
      }
    });
  },
  onLeave: () => {
    gsap.to(".price", {
      maxWidth: "100%",
      duration: 0.1,
      onComplete: () => {
        ScrollTrigger.update();
      }
    });
  }
});

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