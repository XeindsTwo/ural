import {bindScrollToLinks} from './gsap.js';
import {bindShareLinks} from './copy.js';
import {setupMobileMenu} from "./mobileMenu.js";
import {modalJury} from "./modalJury.js";
import {setupFAQ} from "./faq.js";
import {animateCompetitionSection} from './animateCompetitionSection.js';

bindScrollToLinks();
bindShareLinks();
setupMobileMenu();
modalJury();
setupFAQ();
animateCompetitionSection();

new Swiper('.command__swiper', {
  loop: false,
  speed: 800,
  navigation: {
    prevEl: '.command--prev',
    nextEl: '.command--next'
  },
  keyboard: {
    enabled: true
  },
  breakpoints: {
    1260: {
      slidesPerView: 4,
      slidesPerGroup: 2,
      spaceBetween: 16,
    },
    992: {
      slidesPerView: 4,
      slidesPerGroup: 2,
      spaceBetween: 12
    },
    860: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 12
    },
    515: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 12
    },
    300: {
      slidesPerView: 'auto',
      spaceBetween: 12,
      freeMode: {
        enabled: true
      },
    }
  }
});

new Swiper('.jury__swiper', {
  loop: false,
  speed: 800,
  navigation: {
    prevEl: '.jury__btn--prev',
    nextEl: '.jury__btn--next'
  },
  keyboard: {
    enabled: true
  },
  breakpoints: {
    1260: {
      slidesPerView: 4,
      slidesPerGroup: 2,
      spaceBetween: 16,
    },
    992: {
      slidesPerView: 4,
      slidesPerGroup: 2,
      spaceBetween: 12
    },
    860: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 12
    },
    515: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 12
    },
    300: {
      slidesPerView: 'auto',
      spaceBetween: 12,
      freeMode: {
        enabled: true
      },
    }
  }
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