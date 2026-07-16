'use client'

import KontakPage from '@/components/KontakPage'
import { useState, useEffect } from 'react'

export default function KontakRoute() {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])
  return <KontakPage isDark={isDark} />
}
