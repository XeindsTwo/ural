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