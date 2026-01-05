// app/page.tsx - COMPLETE FILE (CLEANED VERSION)
'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import Link from 'next/link'

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
  
  // Fetch products from Firestore ONLY
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
          Premium products with unbeatable quality and prices.
        </p>
        
        {/* Store Stats */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{products.length}</div>
            <div className="text-gray-600">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {products.length > 0 ? "4.8★" : "New!"}
            </div>
            <div className="text-gray-600">Customer Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">🌍</div>
            <div className="text-gray-600">Worldwide</div>
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
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <div className="text-5xl mb-6">🛒</div>
            <p className="text-gray-700 text-xl mb-4">
              {products.length === 0 
                ? "Your store is ready for products!"
                : `No products found in "${selectedCategory}"`}
            </p>
            {products.length === 0 && (
              <div>
                <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                  Add your first product using the admin panel.
                </p>
                <Link 
                  href="/admin" 
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700"
                >
                  Go to Admin Panel
                </Link>
              </div>
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

      {/* Call to Action - SIMPLIFIED */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-gray-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Start Shopping Today</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Browse our collection of premium products with quality you can trust.
        </p>
        {products.length > 0 && (
          <Link 
            href="#products" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            View All Products
          </Link>
        )}
      </div>
    </div>
  )
}