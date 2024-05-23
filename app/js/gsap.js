const menuLinks = document.querySelectorAll('.desktop');

menuLinks.forEach(function (menuLink) {
  menuLink.addEventListener('click', function (event) {
    event.preventDefault();

    const targetId = menuLink.getAttribute('href').slice(1);
    const targetElement = document.getElementById(targetId);
    const headerHeight = document.querySelector('.header').offsetHeight;
    let targetOffset;

    if (targetId === "community") {
      const targetRect = targetElement.getBoundingClientRect();
      const sectionBottom = targetRect.top + targetRect.height;
      const windowHeight = window.innerHeight;
      targetOffset = sectionBottom - windowHeight + headerHeight + 20;
    } else {
      targetOffset = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight + 20;
    }

    window.scrollTo({top: targetOffset, behavior: 'smooth'});
  });
});