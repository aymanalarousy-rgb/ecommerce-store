'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'

interface Product {
  id?: string
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
}

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form state
  const [form, setForm] = useState<Product>({
    name: '',
    price: 0,
    description: '',
    image: '',
    category: 'Electronics',
    stock: 10
  })

  // Fetch products from Firestore
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, 'products'))
      const productsList: Product[] = []
      querySnapshot.forEach((doc) => {
        productsList.push({ id: doc.id, ...doc.data() } as Product)
      })
      setProducts(productsList)
    } catch (error) {
      console.error('Error fetching products:', error)
      alert('Error loading products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Add new product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'products'), {
        ...form,
        createdAt: new Date()
      })
      alert('Product added successfully!')
      setForm({
        name: '',
        price: 0,
        description: '',
        image: '',
        category: 'Electronics',
        stock: 10
      })
      fetchProducts() // Refresh list
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Error adding product')
    }
  }

  // Delete product
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id))
        alert('Product deleted!')
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Error deleting product')
      }
    }
  }

  // Start editing
  const startEdit = (product: Product) => {
    setEditingId(product.id!)
    setForm(product)
  }

  // Save edit
  const saveEdit = async () => {
    if (!editingId) return
    
    try {
      await updateDoc(doc(db, 'products', editingId), {
        name: form.name,
        price: form.price,
        description: form.description,
        image: form.image,
        category: form.category,
        stock: form.stock
      })
      alert('Product updated!')
      setEditingId(null)
      setForm({
        name: '',
        price: 0,
        description: '',
        image: '',
        category: 'Electronics',
        stock: 10
      })
      fetchProducts()
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Error updating product')
    }
  }

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null)
    setForm({
      name: '',
      price: 0,
      description: '',
      image: '',
      category: 'Electronics',
      stock: 10
    })
  }

  // Categories for dropdown
  const categories = [
    'Electronics',
    'Footwear',
    'Furniture',
    'Accessories',
    'Home',
    'Fitness',
    'Clothing'
  ]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading admin panel...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
      <p className="text-gray-600 mb-8">Manage your store products without coding</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Add/Edit Product Form */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-6">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          <form onSubmit={editingId ? (e) => { e.preventDefault(); saveEdit() } : handleAddProduct}>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Product Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Wireless Earbuds Pro"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm({...form, price: parseFloat(e.target.value) || 0})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="89.99"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({...form, stock: parseInt(e.target.value) || 0})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="25"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Image URL *</label>
                <input
                  type="url"
                  required
                  value={form.image}
                  onChange={(e) => setForm({...form, image: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="https://images.unsplash.com/photo-..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use Unsplash URLs for best results
                </p>
              </div>

              <div>
                <label className="block mb-2 font-medium">Description *</label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full p-3 border rounded-lg h-32"
                  placeholder="Describe your product..."
                />
              </div>

              <div className="flex gap-3">
                {editingId ? (
                  <>
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <Save className="h-5 w-5" />
                      Update Product
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 flex items-center gap-2"
                    >
                      <X className="h-5 w-5" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add Product
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Products List */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-6">All Products ({products.length})</h2>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products yet. Add your first product!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 flex items-start gap-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      {product.category} • Stock: {product.stock}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(product)}
                      className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id!)}
                      className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-xl">
        <h3 className="font-bold text-blue-900 mb-2">📝 How to Use This Admin Panel</h3>
        <ul className="text-blue-700 space-y-1 text-sm">
          <li>1. <strong>Add Product:</strong> Fill form → Click "Add Product"</li>
          <li>2. <strong>Edit Product:</strong> Click ✏️ button → Modify → "Update Product"</li>
          <li>3. <strong>Delete Product:</strong> Click 🗑️ button → Confirm</li>
          <li>4. <strong>Images:</strong> Use Unsplash URLs for best quality</li>
          <li>Changes appear instantly in your store!</li>
        </ul>
      </div>
    </div>
  )
}