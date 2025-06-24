"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart product IDs from cookie, fetch product details and initialize quantities
  useEffect(() => {
    const loadCart = async () => {
      const storedCart = Cookies.get("cart");
      if (!storedCart) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        const productIds: number[] = JSON.parse(storedCart);
        if (productIds.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        // Fetch products by IDs (assuming your API supports filtering by IDs)
        // If your API doesn't support batch fetch by IDs, you can fetch all and filter client-side
        const res = await fetch(`http://localhost:8000/api/products`);
        const data = await res.json();

        // Filter products in cart
        const productsInCart = data.filter((p: any) =>
          productIds.includes(p.id)
        );

        // Map to CartItem with quantity default 1
        const initialCartItems: CartItem[] = productsInCart.map((p: any) => ({
          product: {
            id: p.id,
            name: p.name,
            price: parseFloat(p.price),
            image_url: `http://localhost:8000/${p.image_url}`,
            stock: p.stock,
          },
          quantity: 1,
        }));

        setCartItems(initialCartItems);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load cart items:", error);
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // Update cookie whenever cartItems change
  useEffect(() => {
    const ids = cartItems.map((item) => item.product.id);
    Cookies.set("cart", JSON.stringify(ids), { expires: 7 });
  }, [cartItems]);

  // Handle quantity change
  const updateQuantity = (productId: number, qty: number) => {
    if (qty < 1) return; // min 1 quantity
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(qty, item.product.stock) }
          : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (productId: number) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId)
    );
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  if (loading) return <div>Loading your cart...</div>;

  if (cartItems.length === 0)
    return (
      <div className="p-8 text-center text-gray-600">Your cart is empty.</div>
    );

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">Cart</h1>
      <div className="space-y-6">
        {cartItems.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex items-center gap-6 border-b pb-4 last:border-b-0"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h2 className="text-xl font-medium">{product.name}</h2>
              <p className="text-gray-600">
                Price: ₹{product.price.toFixed(2)}
              </p>
              <p className="text-gray-500 text-sm">
                Stock: {product.stock} items available
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) =>
                  updateQuantity(product.id, Number(e.target.value))
                }
                className="w-12 text-center border rounded"
              />
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>

            <div className="w-24 text-right font-semibold">
              ₹{(product.price * quantity).toFixed(2)}
            </div>

            <button
              onClick={() => removeFromCart(product.id)}
              className="text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end items-center space-x-6 text-xl font-bold">
        <span>Total:</span>
        <span>₹{totalPrice.toFixed(2)}</span>
      </div>
    
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => {
            // Save cart data to localStorage (could also use a global state)
            localStorage.setItem("checkout_cart", JSON.stringify(cartItems));
            localStorage.setItem("checkout_total", totalPrice.toFixed(2));
            window.location.href = "/checkout"; // Navigate to checkout page
          }}
          className="bg-brand hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition duration-200"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
