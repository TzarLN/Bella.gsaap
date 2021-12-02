gsap.registerPlugin(ScrollTrigger);

function initImageParallax(params) {
  //Select all sections with parallax class

  gsap.utils.toArray(".with-parallax").forEach((section) => {
    //get the image
    const image = section.querySelector("img");
    //Create the tween for the img
    gsap.to(image, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        scrub: true,
      },
    });
  });
}

function initPinSteps() {
  ScrollTrigger.create({
    trigger: ".fixed-nav",
    start: "top center",
    endTrigger: "#stage4",
    end: "center center",
    pin: true,
  });

  const getVh = () => {
    const vh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );
    return vh;
  };

  const updateBodyColor = (color) => {
   gsap.to('.fill-background', {backgroundColor: color, ease: 'none'});
     
  }

  gsap.utils.toArray(".stage").forEach((stage, index) => {
    const navLinks = gsap.utils.toArray(".fixed-nav li");
    ScrollTrigger.create({
      trigger: stage,
      start: "top center",
      end: () => `+=${stage.clientHeight + getVh() / 10}`,
      toggleClass: {
        targets: navLinks[index],
        className: "is-active",
      },
      onEnter: () => updateBodyColor(stage.dataset.color),
      onEnterBack: () => updateBodyColor(stage.dataset.color)
    });
  });
}

function init() {
  initImageParallax();
  initPinSteps();
}

window.addEventListener("load", function () {
  init();
});
