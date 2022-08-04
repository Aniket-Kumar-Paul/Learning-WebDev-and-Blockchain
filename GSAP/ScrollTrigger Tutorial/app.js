// this animation will play when page loads
// gsap.to(".square", {
//     x: 700,
//     duration: 3
// })

// to play animation only when we scroll to the element, we use scrollTrigger
gsap.registerPlugin(ScrollTrigger);

gsap.to(".square1", { // animate .square1
    x: 700,
    duration: 3,
    scrollTrigger: '.square2' // play only when .square2 element comes in viewport
})