// https://greensock.com/docs/v3/Eases
// without using timeline
// gsap.from('.header',
//     { duration: 1, y: '-100%', ease: 'bounce' }
// )
// gsap.from('.link',
//     { duration: 1, opacity: 0, delay: 1, stagger: .5 }
// )
// gsap.from('.right',
//     { duration: 1, x: '-100vw', delay: 1, ease: 'power2.in' }
// )
// gsap.from('.left',
//     { duration: 1, delay: 1.5, x: '-100%' }
// )
// gsap.to('.footer',
//     { duration: 1, y: 0, ease: 'elastic', delay: 2.5 }
// )
// gsap.fromTo('.button',
//     { opacity: 0, scale: 0, rotation: 720 },
//     { duration: 1, delay: 3.5, opacity: 1, scale: 1, rotation: 0 }
// )

// using timeline -> usefull for doing animations one after the other
const timeline = gsap.timeline({ defaults: { duration: 1 } })
timeline
    .from('.header',
        { y: '-100%', ease: 'bounce' }
    )
    .from('.link', // link animation happens only after animation above it(header) completes
        { opacity: 0, stagger: .5 } // no need to put delay 
    )
    .from('.right',
        { x: '-100vw', ease: 'power2.in' },
        1 // 1 is absolute delay (to start right after header instead of link)
    )
    .from('.left',
        { x: '-100%' },
        // < means previous animation 
        // <.5 means a delay of 0.5sec after previous animation(.right) finishes
        '<.5'
    )
    .to('.footer',
        { y: 0, ease: 'elastic' }
    )
    .fromTo('.button',
        { opacity: 0, scale: 0, rotation: 720 },
        { opacity: 1, scale: 1, rotation: 0 }
    )

const button = document.querySelector(".button")
button.addEventListener('click', () => {
    timeline.timeScale(3) // reverse 3 times faster than base animation speed  
    timeline.reverse()
})

// we can also use gsap in any object apart from html elements
const obj = { x: 0 }
gsap.to(obj,
    { duration: 2, x: 100, onUpdate: () => console.log(obj.x) }
)