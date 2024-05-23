export function scrollToSection(event) {
  event.preventDefault();
  const targetId = event.target.getAttribute('href').slice(1);
  const targetElement = document.getElementById(targetId);
  const targetOffset = targetElement.getBoundingClientRect().top + window.scrollY - 30;
  window.scrollTo({top: targetOffset, behavior: 'smooth'});
}

export function bindScrollToLinks() {
  const menuLinks = document.querySelectorAll('.desktop');

  menuLinks.forEach((menuLink) => {
    menuLink.addEventListener('click', scrollToSection);
  });
}