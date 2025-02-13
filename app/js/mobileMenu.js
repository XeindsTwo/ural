export function setupMobileMenu() {
  const html = document.documentElement;
  const menuBtn = document.querySelector('.menu-btn');
  const headerMobile = document.querySelector('.header__mobile');
  const anchors = document.querySelectorAll('a.mobile');

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
}