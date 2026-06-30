'use client'

import React from 'react'

interface NatureBackgroundProps {
  children?: React.ReactNode
}

export default function NatureBackground({ children }: NatureBackgroundProps) {
  return (
    <div className="fixed inset-0 nature-bg overflow-hidden -z-10">
      {/* Animated organic blobs */}
      <div
        className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-20 animate-blob-1"
        style={{
          background: 'radial-gradient(circle, rgba(82, 183, 136, 0.4) 0%, rgba(45, 106, 79, 0.2) 50%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-15 animate-blob-2"
        style={{
          background: 'radial-gradient(circle, rgba(116, 198, 157, 0.3) 0%, rgba(64, 145, 108, 0.15) 50%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute bottom-[-5%] left-[20%] w-[450px] h-[450px] rounded-full opacity-20 animate-blob-3"
        style={{
          background: 'radial-gradient(circle, rgba(149, 213, 178, 0.3) 0%, rgba(82, 183, 136, 0.15) 50%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />
      <div
        className="absolute top-[60%] left-[50%] w-[350px] h-[350px] rounded-full opacity-10 animate-blob-1"
        style={{
          background: 'radial-gradient(circle, rgba(139, 115, 85, 0.3) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animationDelay: '-5s',
        }}
      />
      <div
        className="absolute top-[10%] right-[30%] w-[300px] h-[300px] rounded-full opacity-10 animate-blob-2"
        style={{
          background: 'radial-gradient(circle, rgba(250, 243, 224, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animationDelay: '-10s',
        }}
      />
      {children}
    </div>
  )
}
