gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline();

// tl.to(".box", { x: 500, duration: 5 })
//     .to(".box", { y: 500, duration: 5 })
//     .to(".box", { rotate: 90, repeat: 2, ease: 'back' })

// to see the result of different eases in the above tl code, we have to wait for the previous animations to complete first
// to directly see the end animation, add a label before it and play it
tl.to(".box", { x: 500, duration: 5 })
    .to(".box", { y: 500, duration: 5 })
    .addLabel("rotateLabel")
    .to(".box", { rotate: 90, repeat: 2, ease: 'elastic' })

// tl.addLabel("rotateLabel", 3) // position the label after 3 seconds
tl.play("rotateLabel")

ScrollTrigger.create({
    animation: tl,
    trigger: ".box",
    start: "top center"
})