'use client'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

interface Product {
  id: number
  name: string
  price: number
  image_url: string
  stock: number
}

interface CartItem {
  product: Product
  quantity: number
}

const CheckoutPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState<string>('0.00')
  const cookiesCart = Cookies.get("cart");


  useEffect(() => {
    const cart = localStorage.getItem('checkout_cart')
    const totalAmount = localStorage.getItem('checkout_total')

    if (cart) {
      setCartItems(JSON.parse(cart))
    }
    if (totalAmount) {
      setTotal(totalAmount)
    }
  }, [])

 const handleOrder = ()=>{
      Cookies.remove("cart");
 }
  if (cartItems.length === 0)
    return <div className="p-8 text-center text-gray-500">No items to checkout.</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>

      <div className="space-y-6 mb-10">
        {cartItems.map(({ product, quantity }) => (
          <div key={product.id} className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">
                  Qty: {quantity} × ₹{product.price}
                </p>
              </div>
            </div>
            <p className="font-semibold">₹{(product.price * quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="text-right text-xl font-bold mb-8">
        Total: ₹{total}
      </div>

      {/* Place Order Button */}
      <div className="text-right">
        <button
          className="bg-brand hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition duration-200"
          onClick={() => handleOrder()}
        >
          Place Order
        </button>
      </div>
    </div>
  )
}

export default CheckoutPage
