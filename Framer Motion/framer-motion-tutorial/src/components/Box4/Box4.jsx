import React, { useState } from 'react'
import { motion } from "framer-motion"

function Box4() {
  return (
    <div className='box-container'>
      <motion.div
        className='box'
        animate={{
          scale: [1, 1.4, 1.4, 1, 1], // each scale stays for 0.4 secs as duration for transition is 2sec (2/5= 0.4sec)
          borderRadius: ["20%", "20%", "50%", "50%", "20%"],
          rotate: [0, 0, 270, 270, 0]
        }}
        transition={{
          duration: 2
        }}
      >
      </motion.div>
    </div>
  )
}

export default Box4