'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { auth } from '@/lib/firebase'

export default function CheckoutPage() {
  const router = useRouter()
  const [form, setForm] = useState({ city: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Check if user is signed in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setAuthLoading(false)
    })
    
    return () => unsubscribe()
  }, [])

  // Redirect if not signed in
  useEffect(() => {
    if (!authLoading && !user) {
      alert('Please sign in to checkout')
      router.push('/')
    }
  }, [user, authLoading, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert('Please sign in to place an order')
      return
    }
    
    setLoading(true)
    
    // Simulate order processing
    setTimeout(() => {
      alert(`Order placed successfully!\nOrder ID: ORD-${Date.now()}\nEmail: ${user.email}`)
      localStorage.removeItem('cart')
      window.dispatchEvent(new Event('cartUpdated'))
      router.push('/')
    }, 1500)
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Checking authentication...</p>
      </div>
    )
  }

  // Show message if not signed in (though redirect should happen)
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Sign In Required</h2>
          <p className="text-yellow-700 mb-6">
            Please sign in with Google to proceed to checkout.
          </p>
          <Link 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cart" className="flex items-center text-blue-600 mb-4">
        <ArrowLeft className="mr-2" /> Back to Cart
      </Link>

      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-gray-600 mb-8">
        Signed in as: <span className="font-semibold">{user.email}</span>
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">City *</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({...form, city: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your city"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">Phone Number *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !form.city || !form.phone}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Items</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>$0.00</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-6">
              * This is a demonstration. Your cart will be cleared, but no actual order will be placed.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-2">Order Security</h3>
            <p className="text-blue-700 text-sm">
              Your order is protected. Signed in as: <span className="font-medium">{user.email}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}