// this animation will play when page loads
// gsap.to(".square", {
//     x: 700,
//     duration: 3
// })

// to play animation only when we scroll to the element, we use scrollTrigger
gsap.registerPlugin(ScrollTrigger);

gsap.to(".square", { // animate .square
    x: 700,
    duration: 3,
    scrollTrigger: {
        trigger: '.square', 

        // start/end: px,%,string,function etc..
        // start: 400, // start animation after 400px scrolling
        // start: "top center", // when top of trigger element meets center of the viewport, start the animation (top, center, bottom)
        start: "top 30%", // when top of trigger element meets 30% of the viewport, start the animation
        
        // end: "center 20%",
        end: () => `+=${document.querySelector(".square").offsetHeight}`, // end = height of square in px
        // .offsetHeight -> return height of element including padding and border as an interger px

        markers: true, // shows scroll start, end markers etc for development purpose
        // markers: {
        //     startColor: "purple",
        //     endColor: "fuchsia",
        //     fontSize: "4rem",
        //     indent: 200
        // }
        
        // when animation starts, it will toggle to this class(red), and toggles back to default when animation ends 
        toggleClass: "red" // [make red class in css file]
    }
})