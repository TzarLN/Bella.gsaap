gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
//Navigation

function initNavigation() {
  const mainNavLinks = gsap.utils.toArray(".main-nav a");
  const mainNavLinksRev = gsap.utils.toArray(".main-nav a").reverse();
  mainNavLinks.forEach((link) => {
    link.addEventListener("mouseleave", (e) => {
      //add class
      link.classList.add("animate-out");
      setTimeout(() => {
        //remove class
        link.classList.remove("animate-out");
      }, 300);
    });
  });

  function navAnimation(direction) {
    const scrollingDown = direction === 1;
    const links = scrollingDown ? mainNavLinks : mainNavLinksRev;
    return gsap.to(links, {
      duration: 0.3,
      stagger: 0.05,
      autoAlpha: () => (scrollingDown ? 0 : 1),
      y: () => (scrollingDown ? 20 : 0),
      ease: "Power4.out",
    });
  }

  ScrollTrigger.create({
    start: 100,
    end: "bottom bottom-=20",
    toggleClass: {
      targets: "body",
      className: "has-scrolled",
    },
    onEnter: ({ direction }) => navAnimation(direction),
    onLeaveBack: ({ direction }) => navAnimation(direction),
  });
}

//header
function initHeaderTilt() {
  document.querySelector("header").addEventListener("mousemove", moveImages);
}

function moveImages(e) {
  const { offsetX, offsetY, target } = e;
  const { clientWidth, clientHeight } = target;
  // console.log(offsetX, offsetY, clientWidth, clientHeight);

  //get o o in the center
  const xPos = offsetX / clientWidth - 0.5;
  const yPos = offsetY / clientHeight - 0.5;

  const leftImages = gsap.utils.toArray(".hg__left .hg__image");
  const rightImages = gsap.utils.toArray(".hg__right .hg__image");

  const modifier = (index) => index * 1.2 + 0.5;
  //move left 3 images
  leftImages.forEach((image, index) => {
    gsap.to(image, {
      duration: 1.2,
      x: xPos * 20 * modifier(index),
      y: yPos * 30 * modifier(index),
      rotationY: yPos * 40,
      rotationX: xPos * 10,
      ease: "Power4.out",
    });
  });

  rightImages.forEach((image, index) => {
    gsap.to(image, {
      duration: 1.2,
      x: xPos * 20 * modifier(index),
      y: -yPos * 30 * modifier(index),
      rotationY: xPos * 40,
      rotationX: yPos * 10,
      ease: "Power4.out",
    });
  });

  gsap.to(".decor__circle", {
    duration: 1.7,
    x: 100 * xPos,
    y: 120 * yPos,
    ease: "Power4.out",
  });
}

const sections = document.querySelectorAll(".rg__column");

function initHoverReveal() {
  sections.forEach((section) => {
    //get components to animate
    section.imageBlock = section.querySelector(".rg__image");
    section.image = section.querySelector(".rg__image img");
    section.mask = section.querySelector(".rg__image--mask");
    section.text = section.querySelector(".rg__text");
    section.textCopy = section.querySelector(".rg__text--copy");
    section.textMask = section.querySelector(".rg__text--mask");
    section.textP = section.querySelector(".rg__text--copy p");

    //resret the initial position
    gsap.set([section.imageBlock, section.textMask], {
      yPercent: -101,
    });

    gsap.set(section.image, {
      scale: 1.2,
    });

    //Add event listenrs to each section

    section.addEventListener("mouseenter", createHoverReveal);
    section.addEventListener("mouseleave", createHoverReveal);
  });
}

function getTextHeight(textCopy) {
  return textCopy.clientHeight;
}

function createHoverReveal(e) {
  const { imageBlock, mask, text, textCopy, textMask, textP, image } = e.target;
  let tl = gsap.timeline({
    defaults: {
      duration: 0.7,
      ease: "Power4.out",
    },
  });

  if (e.type === "mouseenter") {
    tl.to([mask, imageBlock, textMask, textP], { yPercent: 0 })
      .to(text, { y: () => -getTextHeight(textCopy) / 2 }, 0)
      .to(image, { duration: 1.1, scale: 1 }, 0);
  } else if (e.type === "mouseleave") {
    tl.to([mask, textP], { yPercent: 100 })
      .to([imageBlock, textMask], { yPercent: -101 }, 0)
      .to(text, { y: 0 }, 0)
      .to(image, { scale: 1.2 }, 0);
  }
  return tl;
}

// function init() {
//   initHoverReveal();
// }
//  window.addEventListener("load", function () {
//   init();
// });

//Define breakpoint
const mq = window.matchMedia("(min-width: 768px)");

//add change listener to breakpoint
mq.addListener(handleWidthChange);

//firstPageLoad
handleWidthChange(mq);

//reset all props

function resetProps(elements) {
  console.log(elements);
  //stop all tweens
  gsap.killTweensOf("*");
  if (elements.length) {
    elements.forEach((el) => {
      el && gsap.set(el, { clearProps: "all" });
    });
  }
}

//media query change
function handleWidthChange(mq) {
  if (mq.matches) {
    initHoverReveal();
  } else {
    //remove event listener for all sections
    sections.forEach((section) => {
      section.removeEventListener("mouseenter", createHoverReveal);
      section.removeEventListener("mouseleave", createHoverReveal);

      const {
        imageBlock,
        mask,
        text,
        textCopy,
        textMask,
        textP,
        image,
      } = section;
      resetProps([imageBlock, mask, text, textCopy, textMask, textP, image]);
    });
  }
}
//Portfolio

//create hover effect for each portfolio navigation item
const allLinks = gsap.utils.toArray(".portfolio__categories a");
const pageBackground = document.querySelector(".fill-background");
const largeImage = document.querySelector(".portfolio__image--l");
const smallImage = document.querySelector(".portfolio__image--s");
const lInside = document.querySelector(".portfolio__image--l .image_inside");
const sInside = document.querySelector(".portfolio__image--s .image_inside");

function initPortfolioHover() {
  allLinks.forEach((link) => {
    link.addEventListener("mouseenter", createPortfolioHover);
    link.addEventListener("mouseleave", createPortfolioHover);
    link.addEventListener("mousemove", createPortfolioMove);
  });
}

function createPortfolioHover(e) {
  if (e.type === "mouseenter") {
    //change images to the right url
    const { color, imagelarge, imagesmall } = e.target.dataset;
    const allSiblings = allLinks.filter((item) => item !== e.target);
    const tl = gsap.timeline();
    tl.set(lInside, { backgroundImage: `url(${imagelarge})` })
      .set(sInside, { backgroundImage: `url(${imagesmall})` })
      .to([largeImage, smallImage], { autoAlpha: 1 })
      .to(allSiblings, { color: "#fff", autoAlpha: 0.2 }, 0)
      .to(e.target, { color: "#fff", autoAlpha: 1 }, 0.2)
      .to(pageBackground, { backgroundColor: color, ease: "none" }, 0);
  } else if (e.type === "mouseleave") {
    const tl = gsap.timeline();
    tl.to([largeImage, smallImage], { autoAlpha: 0 })
      .to(allLinks, { color: "#000000", autoAlpha: 1 }, 0)
      .to(pageBackground, { backgroundColor: "#ACB7AB", ease: "none" }, 0);
  }
}

function createPortfolioMove(e) {
  const { clientY } = e;

  gsap.to(largeImage, {
    duration: 1.2,
    y: getPortfolioOffset(clientY) / 6,
    ease: "Power3.out",
  });
  gsap.to(smallImage, {
    duration: 1.5,
    y: getPortfolioOffset(clientY) / 3,
    ease: "Power3.out",
  });
}

function getPortfolioOffset(clientY) {
  return -(
    document.querySelector(".portfolio__categories").clientHeight - clientY
  );
}

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
    gsap.to(".fill-background", { backgroundColor: color, ease: "none" });
  };

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
      onEnterBack: () => updateBodyColor(stage.dataset.color),
    });
  });
}

function initScrollTo() {
  //find all links and animate to right position

  gsap.utils.toArray('.fixed-nav a').forEach(link => {
    const target = link.getAttribute('href');

    link.addEventListener('click', (e) => {
      e.preventDefault();
      gsap.to(window, {duration: 1.5, scrollTo: target, ease: 'Power2.out'});
    })
  })
}

function init() {
  initNavigation();
  initHeaderTilt();
  initPortfolioHover();
  initImageParallax();
  initPinSteps();
  initScrollTo();
}

window.addEventListener("load", function () {
  init();
});
