gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".box",
        markers: true,
        start: "top 80%",
        end: "top 30%",
        scrub: 1
    }
})

tl.to(".box", {x:200, duration: 5}) // move right
  .to(".box", {y:200, duration: 4}) // move down
  .to(".box", {x:0, duration:3}) // move left
  .to(".box", {y:0, duration:2}) // move up (back to initial positon)