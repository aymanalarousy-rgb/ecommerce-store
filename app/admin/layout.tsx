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
  const [isLoading, setIsLoading] = useState(true) // More explicit loading state

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log('Auth State Changed:', currentUser?.email); // ADD THIS FOR DEBUGGING
      setUser(currentUser)
      setIsLoading(false)
      
      // Only allow YOUR email (aymanalarousy@gmail.com)
      // Check AFTER loading is complete
      if (!currentUser) {
        console.log('No user, redirecting to home');
        router.push('/');
        return;
      }
      
      if (currentUser.email !== 'aymanalarousy@gmail.com') {
        console.log('Wrong email, redirecting. Email was:', currentUser.email);
        router.push('/');
        return;
      }
      // If email is correct, page will render children
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, [router]);

  // Show a clear loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking admin permissions...</p>
          <p className="text-sm text-gray-400 mt-2">(Authenticated as: {user?.email || 'Not signed in'})</p>
        </div>
      </div>
    );
  }

  // If not loading but user is null (should have redirected), show nothing
  if (!user) {
    return null;
  }

  // At this point, user is authenticated with the correct email
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