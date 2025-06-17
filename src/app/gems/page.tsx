"use client"
import React, { useState } from 'react'
import products from '@/components/global/data.json'

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

// Define category type
type Category = 'all' | 'bastu' | 'gems' | string

// Props interface for ProductCard
interface ProductCardProps {
  product: Product
}

const ProductComponent: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<Category>('gems')
    const [wishlist, setWishlist] = useState<number[]>([])
    const [cart, setCart] = useState<number[]>([]) // Fixed: was <number>([])
    
    // Type assertion for imported products data
    const typedProducts = products as Product[]
    
    // Filter products based on selected category
    const filteredProducts: Product[] = selectedCategory === 'all' 
        ? typedProducts 
        : typedProducts.filter(product => product.category === selectedCategory)

    // Wishlist functions
    const toggleWishlist = (productId: number): void => {
        setWishlist(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        )
    }

    // Cart functions
    const addToCart = (productId: number): void => {
        setCart(prev => [...prev, productId])
        // You can add a toast notification here
    }
    
    // Product Card Component
    const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
            {/* Image Container */}
            <div className="relative overflow-hidden">
                <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Discount Badge */}
                {product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                        -{product.discount}%
                    </div>
                )}
                
                {/* Stock Status */}
                {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Out of Stock</span>
                    </div>
                )}
                
                {/* Wishlist Button */}
                <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
                    aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <svg 
                        className={`w-5 h-5 ${wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {product.features.slice(0, 2).map((feature: string, index: number) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {feature}
                        </span>
                    ))}
                </div>

                {/* Rating */}
                <div className="flex items-center mb-3">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i: number) => (
                            <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-gray-600 text-sm ml-2">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-brand">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                    </div>
                </div>

                {/* Add to Cart Button */}
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
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors duration-200">
                    Load More Products
                </button>
            </div>
        </div>
    )
}

export default ProductComponent