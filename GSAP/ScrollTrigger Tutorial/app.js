gsap.registerPlugin(ScrollTrigger);

gsap.to(".square", {
    x: 700,
    duration: 90,
    scrollTrigger: {
        trigger: '.square', 
        start: "top 60%",
        end: "top 30%",
        markers: true,
        toggleActions: "restart reverse none none",
        scrub: 5,

        // pin the element at its position(animation will still happen) until the scrolling area ends(area between start and end)
        pin: true,
        // pin: ".square2" // the pinned element can be different from the trigger element

        pinSpacing: true // adds padding to the bottom of the pinned element so that overlapping doesn't happen between the trigger and pin element or the pinned element and element below it
    }
})