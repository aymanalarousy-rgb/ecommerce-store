'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setLoading(false)
      
      // Only allow YOUR email (aymanalarousy@gmail.com)
      if (!currentUser || currentUser.email !== 'aymanalarousy@gmail.com') {
        router.push('/')
      }
    })
    
    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Checking admin access...</p>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Store
              </Link>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">Admin Panel</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Signed in as: <span className="font-medium">{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}