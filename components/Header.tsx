'use client'

import { ShoppingCart, User, Search } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { auth, googleProvider, signInWithPopup, signOut } from '@/lib/firebase'

export default function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Track authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Track cart count
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
      setCartCount(count)
    }
    
    updateCartCount()
    window.addEventListener('storage', updateCartCount)
    window.addEventListener('cartUpdated', updateCartCount)
    
    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Error signing in:', error)
      alert('Error signing in. Please try again.')
    }
  }

  // Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      alert(`Searching for: "${searchQuery}"`)
      setSearchQuery('')
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center justify-between md:justify-start">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Ayman Store
            </Link>
            <div className="md:hidden flex items-center space-x-4">
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-grow max-w-xl mx-0 md:mx-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>

            {loading ? (
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium">Welcome back</p>
                  <p className="text-xs text-gray-500 truncate max-w-[120px]">
                    {user.displayName || user.email}
                  </p>
                </div>
                <div className="relative group">
                  <img 
                    src={user.photoURL || '/default-avatar.png'} 
                    alt={user.displayName || 'User'}
                    className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236b7280"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'
                    }}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible transition-all z-50 border">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleGoogleSignIn}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Auth Button */}
          <div className="md:hidden">
            {!loading && !user && (
              <button 
                onClick={handleGoogleSignIn}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full justify-center"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
            {user && (
              <button 
                onClick={handleSignOut}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition w-full"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}