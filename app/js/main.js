import {bindScrollToLinks} from './gsap.js';
import {bindShareLinks} from './copy.js';

bindScrollToLinks();
bindShareLinks();

new Swiper('.prizes__swiper', {
  loop: false,
  slidesPerView: 4,
  slidesPerGroup: 2,
  speed: 800,
  spaceBetween: 16,
  navigation: {
    prevEl: '.prizes__btn--prev',
    nextEl: '.prizes__btn--next'
  },
  keyboard: {
    enabled: true
  },
});

new Swiper('.jury__swiper', {
  loop: false,
  slidesPerView: 4,
  slidesPerGroup: 2,
  speed: 800,
  spaceBetween: 16,
  navigation: {
    prevEl: '.jury__btn--prev',
    nextEl: '.jury__btn--next'
  },
  keyboard: {
    enabled: true
  },
});

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