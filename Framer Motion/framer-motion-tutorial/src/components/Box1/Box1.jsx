import React, { useState } from 'react'
import { motion } from "framer-motion"

function Box1() {
    const [isAnimating, setIsAnimating] = useState(false)
    return (
        <div className='box-container'>
            <motion.div
                className='box'
                animate={{
                    //x: "100vw"
                    x: isAnimating ? 700 : 0, // in px 
                    opacity: isAnimating ? 1 : 0.5,
                    // backgroundColor: 'red',
                    // scale: 1.5
                    rotate: isAnimating ? 360 : 0
                }}
                initial={{
                    opacity: 0.1
                }}
                transition={{
                    // type: "tween" -> no springy effect
                    // duration: 2 // 2sec

                    type: "spring",
                    // for spring, we use stiffness instead of duration
                    stiffness: 60,
                    //damping: 50 // slows even further
                }}

                onClick={() => setIsAnimating(!isAnimating )}
            >
            </motion.div>
        </div>
    )
}

export default Box1