import React from 'react'
import { motion } from "framer-motion"

function Box3() {
  const boxVariant = {
    hidden: {
      x: "-100vw"
    },
    visible: {
      x: 0,
      transition: {
        delay: 0.5,
        staggerChildren: 0.5, // each child box will have a delay of 0.5 sec
        when: "beforeChildren" // children animation will run only after parent completes
      }
    }
  }

  const listVariant = {
    hidden: {
      x: -10,
      opacity: 0
    },
    visible: {
      x: 0,
      opacity: 1,
    }
  }

  return (
    <div className='box-container'>
      <motion.div
        className='box'
        variants={boxVariant}
        animate="visible"
        initial="hidden"
      >
        {[1, 2, 3].map(box => {
          return ( // child already includes parents variants
            <motion.li
              key={box}
              className='boxItem'
              variants={listVariant}
              transition={{
                staggerChildren: 0.5
              }}
            // it will automatically apply visible and hidden of listVariant here
            >
            </motion.li>)
        })}
      </motion.div>
    </div>
  )
}

export default Box3