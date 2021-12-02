gsap.registerPlugin(ScrollTrigger);

const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);
const loader = select(".loader");
const loaderInner = select(".loader .inner");
const progressBar = select(".loader .progress");
const loaderMask = select(".loader__mask");

//show loader on page load
gsap.set(loader, { autoAlpha: 1 });

//scale loader down
gsap.set(loaderInner, { scaleY: 0.005, transformOrigin: "bottom" });

//make a tween that scales the loader
const progressTween = gsap.to(progressBar, {
  paused: true,
  scaleX: 0,
  ease: "none",
  transformOrigin: "right",
});

//setup variables

let loadedImageCount = 0,
  imageCount;
const container = select("#main");

//setup Images loaded

const imgLoad = imagesLoaded(container);
imageCount = imgLoad.images.length;

//set the initial progress to 0
updateProgress(0);

//triggered after each image is loaded
imgLoad.on("progress", function () {
  //increase number of loaded images
  loadedImageCount++;
  //update progress
  updateProgress(loadedImageCount);
});

//update the progress of our progressBar tween

function updateProgress(value) {
  //tween progress bar tween to the right value
  gsap.to(progressTween, {
    progress: value / imageCount,
    duration: 0.3,
    ease: "power1.out",
  });
}

//do whatever you want when all images are loded

imgLoad.on("done", function (instance) {
  //we will simply init our loader animation onComplete
  gsap.set(progressBar, { autoAlpha: 0, onComplete: initPageTransition });
});

function initLoader() {
  const tlLoaderIn = gsap.timeline({
    defaults: {
      duration: 1.1,
      ease: "power2.out",
    },
    onComplete: () => {
      select("body").classList.remove("is-loading");
    },
  });

  const image = select(".loader__image img");
  const mask = select(".loader__image--mask");
  const line1 = select(".loader__title--mask:nth-child(1) span");
  const line2 = select(".loader__title--mask:nth-child(2) span");
  const lines = selectAll(".loader__title--mask");
  const loaderContent = select(".loader__content");

  tlLoaderIn
    .set(loaderContent, { autoAlpha: 1 })
    .to(loaderInner, {
      scaleY: 1,
      transformOrigin: "bottom",
      ease: "power1.inOut",
    })
    .addLabel("revealImage")
    .from(mask, { yPercent: 100 }, "revealImage-=0.6")
    .from(image, { yPercent: -80 }, "revealImage-=0.6")
    .from([line1, line2], { yPercent: 100, stagger: 0.1 }, "revealImage-=0.4");

  const tlLoaderOut = gsap.timeline({
    defaults: {
      duration: 1.2,
      ease: "power2.inOut",
    },
    delay: 1,
  });
  tlLoaderOut
    .to(lines, { yPercent: -500, stagger: 0.2 }, 0)
    .to([loader, loaderContent], { yPercent: -100 }, 0.2)
    .from("#main", { y: 150 }, 0.2);

  const tlLoader = gsap.timeline();
  tlLoader.add(tlLoaderIn).add(tlLoaderOut);
}

function pageTransitionIn({container}) {
  //Timeline to strech the loader over the whole sreen
  const tl = gsap.timeline({
    defaults: {
      duration: 0.7,
      ease: "power1.inOut",
    },
  });
  tl.set(loaderInner, { autoAlpha: 0 })
    .fromTo(
      loader,
      {
        yPercent: -100,
      },
      {
        yPercent: 0,
      }
    )
    .fromTo(loaderMask, { yPercent: 80 }, { yPercent: 0 }, 0)
    .to(container, { y: 150 }, 0);
  return tl;
}

function pageTransitionOut({container}) {
  //Timeline to move the loader away
  const tl = gsap.timeline({
    defaults: {
      duration: 0.8,
      ease: "power1.inOut",
    },
  });
  tl.to(loader, {
    yPercent: 100,
  }).to(loaderMask, { yPercent: -80 }, 0)
  .from(container, { y: -150 }, 0);
  return tl;
}

function initPageTransition(paams) {
  barba.hooks.before(() => {
    document.querySelector('html').classList.add('is-transitioning')
  });
  barba.hooks.after(() => {
    document.querySelector('html').classList.remove('is-transitioning')
  });

  barba.hooks.enter(() => {
    window.scrollTo(0, 0);
  });



  barba.init({
    transitions: [
      {
        once() {
          //do something when initial page load
          initLoader();
        },
        async leave({current}) {
          //animate the loading screen in
          await pageTransitionIn(current);
        },
        enter({next}) {
          //animate loading screen away
          pageTransitionOut(next);
        },
      },
    ],
  });
}

// function init() {
//   initLoader();
// }

// window.addEventListener("load", function () {
//   init();
// });
