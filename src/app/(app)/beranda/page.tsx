'use client'

import BerandaPage from '@/components/BerandaPage'
import { useState, useEffect } from 'react'

export default function BerandaRoute() {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])
  return <BerandaPage isDark={isDark} />
}
