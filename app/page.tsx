'use client'

import { useState } from 'react'
import ProductCard from '@/components/ProductCard'

const sampleProducts = [
  {
    id: "1",
    name: "Wireless Earbuds Pro",
    price: 89.99,
    description: "True wireless earbuds with active noise cancellation, 30-hour battery life, and waterproof design.",
    image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e9?w=400&h=400&fit=crop",
    stock: 25,
    category: "Electronics",
    rating: 4.8,
    features: ["Noise Cancelling", "30hr Battery", "Waterproof"]
  },
  {
    id: "2",
    name: "Gaming Keyboard RGB",
    price: 129.99,
    description: "Mechanical gaming keyboard with customizable RGB lighting, programmable keys, and wrist rest.",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
    stock: 15,
    category: "Electronics",
    rating: 4.6,
    features: ["Mechanical Keys", "RGB Lighting", "Programmable"]
  },
  {
    id: "3",
    name: "Sports Running Shoes",
    price: 149.99,
    description: "Lightweight running shoes with air cushion technology, breathable mesh, and superior traction.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    stock: 30,
    category: "Footwear",
    rating: 4.7,
    features: ["Air Cushion", "Breathable", "Lightweight"]
  },
  {
    id: "4",
    name: "Leather Office Chair",
    price: 299.99,
    description: "Ergonomic leather office chair with adjustable lumbar support, headrest, and 360° rotation.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    stock: 8,
    category: "Furniture",
    rating: 4.9,
    features: ["Ergonomic", "Adjustable", "Premium Leather"]
  },
  {
    id: "5",
    name: "Smart Watch Series 5",
    price: 249.99,
    description: "Advanced smartwatch with heart rate monitor, GPS, sleep tracking, and smartphone notifications.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    stock: 12,
    category: "Electronics",
    rating: 4.5,
    features: ["Heart Rate Monitor", "GPS", "Sleep Tracking"]
  },
  {
    id: "6",
    name: "Bluetooth Speaker",
    price: 79.99,
    description: "Portable waterproof Bluetooth speaker with 20-hour battery, deep bass, and party lights.",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop",
    stock: 40,
    category: "Electronics",
    rating: 4.4,
    features: ["Waterproof", "20hr Battery", "Party Lights"]
  },
  {
    id: "7",
    name: "Laptop Backpack",
    price: 59.99,
    description: "Water-resistant laptop backpack with USB charging port, multiple compartments, and padded straps.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    stock: 35,
    category: "Accessories",
    rating: 4.6,
    features: ["Water Resistant", "USB Port", "Laptop Sleeve"]
  },
  {
    id: "8",
    name: "Coffee Maker Deluxe",
    price: 149.99,
    description: "Programmable coffee maker with thermal carafe, built-in grinder, and 12-cup capacity.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
    stock: 18,
    category: "Home",
    rating: 4.7,
    features: ["Programmable", "Built-in Grinder", "Thermal Carafe"]
  },
  {
    id: "9",
    name: "Yoga Mat Premium",
    price: 39.99,
    description: "Non-slip yoga mat with alignment lines, extra thick padding, and carrying strap included.",
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=400&fit=crop",
    stock: 50,
    category: "Fitness",
    rating: 4.8,
    features: ["Non-slip", "Extra Thick", "Carrying Strap"]
  }
]

const categories = [
  { name: "All", count: sampleProducts.length },
  { name: "Electronics", count: sampleProducts.filter(p => p.category === "Electronics").length },
  { name: "Footwear", count: sampleProducts.filter(p => p.category === "Footwear").length },
  { name: "Furniture", count: sampleProducts.filter(p => p.category === "Furniture").length },
  { name: "Accessories", count: sampleProducts.filter(p => p.category === "Accessories").length },
  { name: "Home", count: sampleProducts.filter(p => p.category === "Home").length },
  { name: "Fitness", count: sampleProducts.filter(p => p.category === "Fitness").length },
]

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  
  const filteredProducts = selectedCategory === "All" 
    ? sampleProducts 
    : sampleProducts.filter(product => product.category === selectedCategory)

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
            <div className="text-2xl font-bold text-blue-600">{sampleProducts.length}+</div>
            <div className="text-gray-600">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">4.7★</div>
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
          {categories.map((category) => (
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
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
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