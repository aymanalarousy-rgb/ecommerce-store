'use client'

import { useState } from 'react'
import { ShoppingCart, Plus, Minus } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    description: string
    image: string
    stock: number
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)

  const addToCart = () => {
    setAdding(true)
    
    // Get existing cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    
    // Check if product exists
    const existingIndex = cart.findIndex((item: any) => item.id === product.id)
    
    if (existingIndex > -1) {
      // Update quantity
      cart[existingIndex].quantity += quantity
    } else {
      // Add new item
      cart.push({
        ...product,
        quantity: quantity
      })
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart))
    
    // Trigger cart update
    window.dispatchEvent(new Event('cartUpdated'))
    window.dispatchEvent(new Event('storage'))
    
    // Show message
    alert(`${product.name} added to cart!`)
    
    setAdding(false)
    setQuantity(1)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
      <div className="h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
          <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-700">Quantity:</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
              disabled={quantity >= product.stock}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          onClick={addToCart}
          disabled={product.stock === 0 || adding}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>{adding ? 'Adding...' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  )
}