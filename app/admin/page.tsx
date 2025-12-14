// app/page.tsx - COMPLETE FILE
'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
}

const categories = [
  { name: "All", count: 0 },
  { name: "Electronics", count: 0 },
  { name: "Footwear", count: 0 },
  { name: "Furniture", count: 0 },
  { name: "Accessories", count: 0 },
  { name: "Home", count: 0 },
  { name: "Fitness", count: 0 },
  { name: "Clothing", count: 0 }
]

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  
  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'))
        const productsList: Product[] = []
        querySnapshot.forEach((doc) => {
          productsList.push({ id: doc.id, ...doc.data() } as Product)
        })
        setProducts(productsList)
      } catch (error) {
        console.error('Error fetching products:', error)
        // Fallback to empty array if Firestore fails
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  // Update category counts
  const updatedCategories = categories.map(cat => {
    if (cat.name === "All") {
      return { ...cat, count: products.length }
    }
    return { 
      ...cat, 
      count: products.filter(p => p.category === cat.name).length 
    }
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-blue-600">Ayman Store</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Discover premium products with unbeatable quality and prices. Fast shipping and excellent customer service.
        </p>
        
        {/* Store Stats */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{products.length}</div>
            <div className="text-gray-600">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {products.length > 0 ? "4.7★" : "0★"}
            </div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-10" id="products">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
        <div className="flex flex-wrap gap-3">
          {updatedCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                selectedCategory === category.name
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow"
              }`}
            >
              {category.name} <span className="opacity-80">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedCategory === "All" ? "All Products" : selectedCategory}
            <span className="text-gray-600 text-lg font-normal ml-2">
              ({filteredProducts.length} products)
            </span>
          </h2>
          <div className="text-gray-600">
            Sort by: <select className="ml-2 border rounded px-3 py-1">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Customer Rating</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg mb-4">
              {products.length === 0 
                ? "No products yet. Add your first product from the Admin Panel!"
                : "No products found in this category."}
            </p>
            {products.length === 0 && (
              <a 
                href="/admin" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                Go to Admin Panel
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Store Features */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">Why Choose Ayman Store?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <div className="text-3xl mb-4">🚚</div>
            <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
            <p className="text-gray-600 text-sm">On all orders over $100</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <div className="text-3xl mb-4">↩️</div>
            <h3 className="text-lg font-semibold mb-2">30-Day Returns</h3>
            <p className="text-gray-600 text-sm">Hassle-free return policy</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
            <p className="text-gray-600 text-sm">100% secure encrypted checkout</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <div className="text-3xl mb-4">📞</div>
            <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm">Dedicated customer service team</p>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Stay Updated</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Subscribe to our newsletter for exclusive deals, new arrivals, and special offers.
        </p>
        <div className="max-w-md mx-auto flex gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  )
}