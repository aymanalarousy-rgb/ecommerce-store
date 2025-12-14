'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)
  }, [])

  const updateQuantity = (id: string, change: number) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + change
        return newQty > 0 ? { ...item, quantity: newQty } : null
      }
      return item
    }).filter(Boolean) as CartItem[]
    
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const removeItem = (id: string) => {
    const newCart = cart.filter(item => item.id !== id)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-blue-600 mb-4">
        <ArrowLeft className="mr-2" /> Continue Shopping
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">Your Cart ({cart.length} items)</h1>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow mb-4 flex items-center">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded mr-6" />
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-blue-600 font-bold text-lg mt-1">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-4">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-2 bg-gray-100 rounded">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="mx-4 font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-2 bg-gray-100 rounded">
                      <Plus className="h-4 w-4" />
                    </button>
                    <button onClick={() => removeItem(item.id)} className="ml-6 text-red-500">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="font-bold text-lg">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{total > 50 ? 'FREE' : '$5.99'}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(total + (total > 50 ? 0 : 5.99)).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link href="/checkout" className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-bold hover:bg-blue-700">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}