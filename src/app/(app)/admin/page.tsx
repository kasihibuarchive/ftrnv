'use client'

import AdminPage from '@/components/AdminPage'
import { useRouter } from 'next/navigation'

export default function AdminRoute() {
  const router = useRouter()
  const handleBack = () => router.push('/beranda')
  return <AdminPage onBack={handleBack} />
}
