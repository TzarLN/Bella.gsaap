gsap.registerPlugin(ScrollTrigger);

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
