'use client'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

// Define the Product interface
interface Product {
  id: number
  name: string
  description: string
  image: string
  price: number
  originalPrice: number
  discount: number
  category: string
  inStock: boolean
  features: string[]
  rating: number
  reviews: number
}

type Category = 'all' | 'bastu' | 'gems' | string

interface ProductCardProps {
  product: Product
}

const ProductComponent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [cart, setCart] = useState<number[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/products')
        const data = await res.json()

        // Filter products where category.name === 'gems'
        const filtered = data.filter(
          (item: any) => item.category && item.category.name === 'gems'
        )

        const mapped: Product[] = filtered.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          image: `http://localhost:8000/${item.image_url}`,
          price: parseFloat(item.price) || 0,
          originalPrice:
            parseFloat(item.compare_price) || parseFloat(item.price) || 0,
          discount: item.compare_price
            ? Math.round(
                ((parseFloat(item.compare_price) - parseFloat(item.price)) /
                  parseFloat(item.compare_price)) *
                  100
              )
            : 0,
          category: item.category?.name || 'uncategorized',
          inStock: item.stock > 0 && item.is_active,
          features: ['Natural', 'Shiny'], // Example features
          rating: 4.3,
          reviews: 17,
        }))

        setProducts(mapped)
      } catch (err) {
        console.error('Failed to fetch gems:', err)
      }
    }

    const loadStoredData = () => {
      const storedCart = Cookies.get('cart')
      const storedWishlist = Cookies.get('wishlist')
      if (storedCart) setCart(JSON.parse(storedCart))
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist))
    }

    fetchProducts()
    loadStoredData()
  }, [])

  const toggleWishlist = (productId: number): void => {
    let updatedWishlist: number[]
    if (wishlist.includes(productId)) {
      updatedWishlist = wishlist.filter(id => id !== productId)
    } else {
      updatedWishlist = [...wishlist, productId]
    }
    setWishlist(updatedWishlist)
    Cookies.set('wishlist', JSON.stringify(updatedWishlist), { expires: 7 })
  }

  const addToCart = (productId: number): void => {
    // Prevent duplicates
    if (!cart.includes(productId)) {
      const updatedCart = [...cart, productId]
      setCart(updatedCart)
      Cookies.set('cart', JSON.stringify(updatedCart), { expires: 7 })
    }
  }

  const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            -{product.discount}%
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
          aria-label={
            wishlist.includes(product.id)
              ? 'Remove from wishlist'
              : 'Add to wishlist'
          }
        >
          <svg
            className={`w-5 h-5 ${
              wishlist.includes(product.id)
                ? 'text-red-500 fill-current'
                : 'text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {product.features.slice(0, 2).map((feature, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-gray-600 text-sm ml-2">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-brand">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => addToCart(product.id)}
          disabled={!product.inStock}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
            product.inStock
              ? 'bg-brand hover:bg-accent text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductComponent
