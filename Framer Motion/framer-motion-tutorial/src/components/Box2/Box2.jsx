import React, { useState } from 'react'
import { motion } from "framer-motion"

function Box2() {
  return (
    <div className='box-container'>
      <motion.div
        className='box'
        // drag -> free range dragging, stays where dragged
        // drag="x" -> drag only in x axis
        drag
        dragConstraints={{
          right: 20,
          left: 0,
          top: 5,
          bottom: 5
        }}
        whileHover={{
          scale: 1.1
        }}
        whileTap={{
          scale: 0.9
        }}
      >
      </motion.div>
    </div>
  )
}

export default Box2