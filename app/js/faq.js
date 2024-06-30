export function setupFAQ() {
  let groups = gsap.utils.toArray(".faq__item");
  let menus = gsap.utils.toArray(".faq__head");
  let menuToggles = groups.map(createAnimation);

  menus.forEach((menu) => {
    menu.addEventListener("click", () => toggleMenu(menu));
  });

  function toggleMenu(clickedMenu) {
    menuToggles.forEach((toggleFn) => toggleFn(clickedMenu));
  }

  function createAnimation(element, index) {
    let menu = element.querySelector(".faq__head");
    let box = element.querySelector(".faq__text");

    gsap.set(box, { height: "auto", marginTop: 0 });

    let animation = gsap.timeline({
      paused: true,
      onStart: () => {
        gsap.to(box, { marginTop: 18, duration: 0.4, ease: "power1.inOut" });
      },
      onReverseComplete: () => {
        gsap.to(box, { marginTop: 0, duration: 0.4, ease: "power1.inOut" });
        gsap.set(box, { clearProps: "height" });
      }
    }).fromTo(
      box,
      { height: 0, marginTop: 0 },
      { height: "auto", marginTop: 18, duration: 0.4, ease: "power1.inOut" }
    );

    if (index === 0) {
      animation.play();
    }

    return function (clickedMenu) {
      if (clickedMenu === menu) {
        animation.reversed(!animation.reversed());
      } else {
        animation.reverse();
      }
    };
  }
}