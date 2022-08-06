gsap.registerPlugin(ScrollTrigger);

gsap.to(".square", {
    x: 700,
    duration: 3,
    scrollTrigger: {
        trigger: '.square', 
        start: "top 60%",
        end: "top 40%",
        markers: true,

        // toggleActions: "play     none     none         none", // default actions for below events
        // Events -->      onEnter  onLeave  onEnterBack  onLeaveBack
        // Actions --> play, reverse, pause, resume, reset(initial position), complete(final animation positon), none etc..
        toggleActions: "restart reverse none none"
    }
})