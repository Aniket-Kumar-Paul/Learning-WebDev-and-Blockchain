gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
    trigger: ".box",
    start: "top 80%",
    end: "top 50%",
    markers: true,
    toggleClass: "box-red",
    
    // using the toggleActions events directly
    onEnter: () => console.log("enter!"),
    onLeave: () => console.log("leave!"),
    onEnterBack: () => console.log("enterback!"),
    onLeaveBack: () => console.log("leaveback!"),

    // the ScrollTrigger instance (self) itself has properties/methods like progress, direction, isActive, and getVelocity()
    // Some other events: onRefresh, onUpdate, onScrubComplete etc..
    // onRefresh: ({progress, direction, isActive}) => console.log(progress, direction, isActive),
    onUpdate: (self) => console.log(self) // gets called every time the progress of the ScrollTrigger changes (meaning the scroll position changed)
})

// toggleClass can be used in changing colours of navbar for different sections
// Example - toggle class of nav(target) to nav-active, when top of panel section reaches 6% of viewport
// ScrollTrigger.create({
//     start: "top 6%",
//     trigger: ".panel",
//     toggleClass: { targets: "nav", className: "nav-active" }
// })
