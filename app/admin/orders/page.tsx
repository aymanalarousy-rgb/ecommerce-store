'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { Package, Phone, MapPin, User, ShoppingBag, Calendar } from 'lucide-react'

interface Order {
  id: string
  userId: string
  userEmail: string
  userName: string
  city: string
  phone: string
  items: any[]
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  createdAt: any
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'))
      const ordersList: Order[] = []
      querySnapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() } as Order)
      })
      // Sort by newest first
      ordersList.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
      setOrders(ordersList)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus })
      fetchOrders()
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Customer Orders</h1>
          <p className="text-gray-600">Manage and track all customer purchases</p>
        </div>
      </div>
      
      {/* Stats Banner */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">{orders.length}</div>
            <div className="text-gray-600">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'completed').length}
            </div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
            </div>
            <div className="text-gray-600">Total Revenue</div>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-700 mb-3">No Orders Yet</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            When customers place orders, they will appear here with their contact information.
          </p>
          <div className="mt-8 p-6 bg-blue-50 rounded-lg max-w-md mx-auto">
            <p className="text-blue-800 font-medium">📋 What You'll See Here:</p>
            <ul className="text-blue-700 text-sm text-left mt-2 space-y-1">
              <li>• Customer name, phone, and city</li>
              <li>• Ordered items and quantities</li>
              <li>• Order total and status</li>
              <li>• Contact customers for delivery</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow border hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                    {order.status === 'pending' && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">NEW</span>}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-gray-600 text-sm">
                    <Calendar className="h-4 w-4" />
                    {order.createdAt?.seconds 
                      ? new Date(order.createdAt.seconds * 1000).toLocaleString()
                      : 'Today'}
                  </div>
                </div>
                
                <select 
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                  className="border rounded-lg px-4 py-2 font-medium"
                >
                  <option value="pending" className="text-yellow-600">⏳ Pending</option>
                  <option value="processing" className="text-blue-600">🔄 Processing</option>
                  <option value="completed" className="text-green-600">✅ Completed</option>
                  <option value="cancelled" className="text-red-600">❌ Cancelled</option>
                </select>
              </div>

              {/* Customer Info */}
              <div className="grid md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-bold">{order.userName || 'Guest'}</p>
                    <p className="text-sm text-gray-600">{order.userEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-bold">{order.phone}</p>
                    <p className="text-sm text-gray-600">Contact Number</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-bold">{order.city}</p>
                    <p className="text-sm text-gray-600">Delivery City</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">Order Details</h4>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center font-bold text-lg mt-6 pt-6 border-t">
                  <span>Order Total</span>
                  <div className="text-right">
                    <div className="text-2xl text-blue-600">${order.total.toFixed(2)}</div>
                    <button
                      onClick={() => {
                        const message = `Hi ${order.userName}, this is Ayman Store. Your order #${order.id.slice(0, 8)} is confirmed. We'll deliver to ${order.city} and contact you on this number.`
                        navigator.clipboard.writeText(message);
                        alert(`Message copied to clipboard:\n\n"${message}"\n\nPaste it to WhatsApp or SMS for ${order.phone}`);
                      }}
                      className="mt-2 text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      📱 Copy Message for Customer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}