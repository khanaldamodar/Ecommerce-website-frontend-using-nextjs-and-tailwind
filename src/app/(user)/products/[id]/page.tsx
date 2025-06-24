'use client'

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Cookies from 'js-cookie'
import {
  Heart,
  Share2,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Check,
  Loader2,
} from "lucide-react"

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
  brand?: string
  sku?: string
  stockCount?: number
  specifications?: { [key: string]: string }
}

export default function ProductDetailPage() {
  const params = useParams()
  const id = params?.id
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [cart, setCart] = useState<number[]>([])

  useEffect(() => {
    if (!id) return

    // Load wishlist and cart from cookies
    const savedWishlist = Cookies.get('wishlist')
    const savedCart = Cookies.get('cart')
    
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist)
        setWishlist(parsedWishlist)
        if (parsedWishlist.includes(parseInt(id))) {
          setIsWishlisted(true)
        }
      } catch {
        setWishlist([])
      }
    }

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch {
        setCart([])
      }
    }
  }, [id])

  useEffect(() => {
    if (!id) return
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const res = await fetch(`http://localhost:8000/api/products/${id}`)
        if (!res.ok) throw new Error("Product not found")
        const data = await res.json()

        const mappedProduct: Product = {
          id: data.id,
          name: data.name,
          description: data.description || 'No description',
          image: data.image_url || '',
          price: parseFloat(data.price) || 0,
          originalPrice: parseFloat(data.compare_price) || parseFloat(data.price) || 0,
          discount: data.compare_price
            ? Math.round(((parseFloat(data.compare_price) - parseFloat(data.price)) / parseFloat(data.compare_price)) * 100)
            : 0,
          category: data.category || 'uncategorized',
          inStock: data.stock > 0 && data.is_active,
          features: data.features || ['Feature 1', 'Feature 2'],
          rating: data.rating || 4.5,
          reviews: data.review_count || 0,
          brand: data.brand || 'Brand',
          sku: data.sku || `SKU-${data.id}`,
          stockCount: data.stock || 0,
          specifications: data.specifications || {}
        }
        setProduct(mappedProduct)
        setError(null)
      } catch (err: any) {
        setError(err.message || "Failed to load product")
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (!id) return (
    <div className="min-h-screen flex items-center justify-center">No product ID provided</div>
  )

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
      <p>{error}</p>
      <button
        onClick={() => window.history.back()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Back
      </button>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">No product found</div>
  )

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)
      } else {
        stars.push(<Star key={i} className="h-5 w-5 text-gray-300" />)
      }
    }
    return stars
  }

  const toggleWishlist = () => {
    if (!product) return

    let updatedWishlist: number[]
    if (isWishlisted) {
      updatedWishlist = wishlist.filter(wid => wid !== product.id)
      setIsWishlisted(false)
    } else {
      updatedWishlist = [...wishlist, product.id]
      setIsWishlisted(true)
    }

    setWishlist(updatedWishlist)
    Cookies.set('wishlist', JSON.stringify(updatedWishlist), { expires: 7 })
  }

  const addToCart = () => {
    if (!product) return

    const updatedCart = [...cart, ...Array(quantity).fill(product.id)]
    setCart(updatedCart)
    Cookies.set('cart', JSON.stringify(updatedCart), { expires: 7 })

    alert(`Added ${quantity} item(s) to cart!`)
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="text-blue-600 hover:underline">Home</a></li>
            <li className="text-gray-500">/</li>
            <li><a href="/products" className="text-blue-600 hover:underline">Products</a></li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-500">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.image ? `http://localhost:8000/${product.image}` : "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold">
                -{product.discount}%
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-bold text-xl">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">{product.brand}</span>
                {product.inStock ? (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    In Stock
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Out of Stock</span>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">{renderStars(product.rating)}</div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
                )}
                {product.discount > 0 && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    Save {product.discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Quantity</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-md">
                    <button
                      className="h-10 w-10 flex items-center justify-center hover:bg-gray-100"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 text-center min-w-[60px]">{quantity}</span>
                    <button
                      className="h-10 w-10 flex items-center justify-center hover:bg-gray-100"
                      onClick={() => setQuantity(Math.min(product.stockCount || 999, quantity + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">{product.stockCount || 0} available</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={addToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                    product.inStock
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                    isWishlisted ? "text-red-600 border-red-600 bg-red-50" : "border-gray-300"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Features */}
            {/* <div>
              <h3 className="text-lg font-medium mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Shipping & Returns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders over ₹500</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">7-Day Returns</p>
                  <p className="text-xs text-gray-600">Easy returns</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Warranty</p>
                  <p className="text-xs text-gray-600">Manufacturer warranty</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Product Details Tabs */}
        <div className="mb-12">
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button className="border-b-2 border-blue-500 py-2 px-1 text-blue-600 font-medium">
                Description
              </button>
            </nav>
          </div>

          {/* Description Content */}
          <div className="bg-white rounded-lg border p-6 px-30">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
              
              {/* {product.specifications && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">{key}</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
