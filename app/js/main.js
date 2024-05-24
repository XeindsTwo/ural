import {bindScrollToLinks} from './gsap.js';
import {bindShareLinks} from './copy.js';
import {animateCompetitionSection} from './animateCompetitionSection.js';

bindScrollToLinks();
bindShareLinks();
animateCompetitionSection();

new Swiper('.prizes__swiper', {
  loop: false,
  speed: 800,
  navigation: {
    prevEl: '.prizes__btn--prev',
    nextEl: '.prizes__btn--next'
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
    555: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 12
    },
    320: {
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
    320: {
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

const html = document.documentElement;
const menuBtn = document.querySelector('.menu-btn');
const headerMobile = document.querySelector('.header__mobile');
const anchors = document.querySelectorAll('a.header__link.mobile');

menuBtn.addEventListener('click', () => {
  menuBtn.blur();
  html.classList.toggle('active');
  menuBtn.classList.toggle('active');
  headerMobile.classList.toggle('active');
});

function scrollToTarget(targetId) {
  const targetSection = document.querySelector(targetId);
  if (targetSection) {
    html.classList.remove('active');
    headerMobile.classList.remove('active');
    menuBtn.classList.remove('active');
    setTimeout(() => {
      const targetOffset = targetSection.offsetTop - 25;
      window.scrollTo({top: targetOffset, behavior: 'smooth'});
    }, 700);
  }
}

function handleAnchorClick(event) {
  event.preventDefault();
  const href = this.getAttribute('href');
  const hrefParts = href.split('#');
  if (hrefParts.length === 2) {
    const targetId = '#' + hrefParts[1];
    scrollToTarget(targetId);
  }
}

for (const anchor of anchors) {
  anchor.addEventListener('click', handleAnchorClick);
  anchor.addEventListener('touchstart', handleAnchorClick, {passive: true});
}