'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { collection, addDoc, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function Checkout() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    city: '',
    phone: ''
  })

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser)
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)
    return () => unsubscribe()
  }, [])

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // 1. Save order to Firestore
      const orderRef = await addDoc(collection(db, 'orders'), {
        userId: user?.uid || 'guest',
        userEmail: user?.email || 'guest',
        userName: form.name,
        city: form.city,
        phone: form.phone,
        items: cart,
        total: calculateTotal(),
        status: 'pending',
        createdAt: serverTimestamp()
      })

      // 2. Reduce stock for each purchased item
      for (const item of cart) {
        const productRef = doc(db, 'products', item.id)
        await updateDoc(productRef, {
          stock: increment(-item.quantity)
        })
      }

      // 3. Clear cart and show success
      alert(`✅ Order #${orderRef.id.slice(0, 8).toUpperCase()} placed successfully!\nWe'll contact you on ${form.phone} for delivery to ${form.city}`)
      localStorage.removeItem('cart')
      window.dispatchEvent(new Event('cartUpdated'))
      router.push('/')
      
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Error placing order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <button 
          onClick={() => router.push('/')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {/* Order Summary */}
      <div className="mb-8 bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-3 p-3 bg-white rounded-lg">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
              </div>
            </div>
            <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg mt-6 pt-6 border-t">
          <span>Total</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Full Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">City *</label>
            <input
              type="text"
              required
              value={form.city}
              onChange={(e) => setForm({...form, city: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Your city for delivery"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Phone Number *</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({...form, phone: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Your contact number"
            />
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm">
            📞 <strong>Delivery Info:</strong> We'll contact you on {form.phone || 'your number'} for delivery to {form.city || 'your city'}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? '⏳ Processing Order...' : `Place Order - $${calculateTotal().toFixed(2)}`}
        </button>
      </form>
    </div>
  )
}