export function animateCompetitionSection() {
  const content = document.querySelector(".competition__inner");
  const competitionTopImg = document.querySelector(".competition__top .competition__img");

  if (window.innerWidth >= 992) {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".competition",
        pin: true,
        start: "0 top",
        end: () => "+=" + content.clientHeight,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: self => {
          const topPosition = self.start;
          const topHeight = document.querySelector('.competition__top').offsetHeight;
          const scrollY = window.scrollY || window.pageYOffset;
          const endPosition = topPosition + topHeight;
          if (scrollY > endPosition) {
            gsap.to(competitionTopImg, {y: -200, duration: 0.5, ease: "power2.out"});
          } else {
            gsap.to(competitionTopImg, {y: 0, duration: 0.5, ease: "power2.out"});
          }
        }
      }
    });

    tl
      .to('.fromLeft', {height: '100vh', ease: "power2.out", duration: 1,})
      .to(content, {
        y: () => window.innerHeight - content.clientHeight - 40,
        duration: 1.5,
        ease: "none"
      });
  }
}