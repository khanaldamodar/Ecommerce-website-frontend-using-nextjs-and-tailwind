"use client"

import { useState } from "react"
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
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Types
interface ProductImage {
  id: string
  url: string
  alt: string
}

interface ProductVariant {
  id: string
  name: string
  value: string
  available: boolean
}

interface ProductReview {
  id: string
  user: {
    name: string
    avatar?: string
  }
  rating: number
  date: Date
  title: string
  content: string
  verified: boolean
}

interface Product {
  id: string
  name: string
  description: string
  shortDescription: string
  price: number
  originalPrice?: number
  images: ProductImage[]
  variants: {
    colors: ProductVariant[]
    sizes: ProductVariant[]
  }
  inStock: boolean
  stockCount: number
  rating: number
  reviewCount: number
  category: string
  brand: string
  sku: string
  features: string[]
  specifications: { [key: string]: string }
  reviews: ProductReview[]
}

// Sample product data
const product: Product = {
  id: "1",
  name: "Premium Wireless Headphones",
  description: `Experience exceptional sound quality with our Premium Wireless Headphones. Featuring advanced noise cancellation technology, these headphones deliver crystal-clear audio whether you're listening to music, taking calls, or enjoying your favorite podcasts.

Built with premium materials and engineered for comfort, these headphones are perfect for long listening sessions. The adjustable headband and soft ear cushions ensure a perfect fit for any head size.

With up to 30 hours of battery life and quick charge capability, you'll never be without your music. The intuitive touch controls make it easy to manage your audio experience without reaching for your device.`,
  shortDescription: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
  price: 199.99,
  originalPrice: 249.99,
  images: [
    { id: "1", url: "/placeholder.svg?height=600&width=600", alt: "Headphones front view" },
    { id: "2", url: "/placeholder.svg?height=600&width=600", alt: "Headphones side view" },
    { id: "3", url: "/placeholder.svg?height=600&width=600", alt: "Headphones folded" },
    { id: "4", url: "/placeholder.svg?height=600&width=600", alt: "Headphones with case" },
  ],
  variants: {
    colors: [
      { id: "black", name: "Color", value: "Midnight Black", available: true },
      { id: "white", name: "Color", value: "Pearl White", available: true },
      { id: "blue", name: "Color", value: "Ocean Blue", available: false },
    ],
    sizes: [
      { id: "standard", name: "Size", value: "Standard", available: true },
      { id: "large", name: "Size", value: "Large", available: true },
    ],
  },
  inStock: true,
  stockCount: 15,
  rating: 4.5,
  reviewCount: 128,
  category: "Electronics",
  brand: "AudioTech",
  sku: "AT-WH-001",
  features: [
    "Active Noise Cancellation",
    "30-hour battery life",
    "Quick charge (15 min = 3 hours)",
    "Premium leather ear cushions",
    "Touch controls",
    "Voice assistant compatible",
  ],
  specifications: {
    "Driver Size": "40mm",
    "Frequency Response": "20Hz - 20kHz",
    Impedance: "32 Ohm",
    Sensitivity: "110 dB",
    "Battery Life": "30 hours",
    "Charging Time": "2 hours",
    Weight: "250g",
    Connectivity: "Bluetooth 5.0, 3.5mm jack",
  },
  reviews: [
    {
      id: "1",
      user: { name: "John D.", avatar: "/placeholder.svg?height=40&width=40" },
      rating: 5,
      date: new Date(2023, 5, 15),
      title: "Excellent sound quality!",
      content:
        "These headphones exceeded my expectations. The noise cancellation is fantastic and the battery life is exactly as advertised.",
      verified: true,
    },
    {
      id: "2",
      user: { name: "Sarah M." },
      rating: 4,
      date: new Date(2023, 5, 10),
      title: "Great for travel",
      content: "Perfect for long flights. Comfortable to wear for hours and the noise cancellation really works.",
      verified: true,
    },
    {
      id: "3",
      user: { name: "Mike R." },
      rating: 5,
      date: new Date(2023, 5, 5),
      title: "Worth every penny",
      content: "Premium build quality and amazing sound. The touch controls are intuitive and responsive.",
      verified: false,
    },
  ],
}

// Related products
const relatedProducts = [
  {
    id: "2",
    name: "Wireless Earbuds Pro",
    price: 149.99,
    originalPrice: 179.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.3,
  },
  {
    id: "3",
    name: "Bluetooth Speaker",
    price: 89.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
  },
  {
    id: "4",
    name: "USB-C Charging Cable",
    price: 19.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
  },
  {
    id: "5",
    name: "Headphone Stand",
    price: 29.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.4,
  },
]

export default function ProductPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.variants.colors[0].id)
  const [selectedSize, setSelectedSize] = useState(product.variants.sizes[0].id)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} fill-yellow-400 text-yellow-400`} />,
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} fill-yellow-400 text-yellow-400`} />,
        )
      } else {
        stars.push(<Star key={i} className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} text-gray-300`} />)
      }
    }
    return stars
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${product.category.toLowerCase()}`}>{product.category}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImageIndex].url || "/placeholder.svg"}
                alt={product.images[selectedImageIndex].alt}
                className="w-full h-full object-cover"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? "border-blue-500" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={image.url || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.brand}</Badge>
                {product.inStock ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.shortDescription}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">{renderStars(product.rating)}</div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
                )}
                {product.originalPrice && (
                  <Badge variant="destructive">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </Badge>
                )}
              </div>
            </div>

            {/* Variants */}
            <div className="space-y-4">
              {/* Color Selection */}
              <div>
                <h3 className="text-sm font-medium mb-2">
                  Color: {product.variants.colors.find((c) => c.id === selectedColor)?.value}
                </h3>
                <div className="flex gap-2">
                  {product.variants.colors.map((color) => (
                    <button
                      key={color.id}
                      className={`px-4 py-2 border rounded-md text-sm ${
                        selectedColor === color.id
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-gray-400"
                      } ${!color.available ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => color.available && setSelectedColor(color.id)}
                      disabled={!color.available}
                    >
                      {color.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-sm font-medium mb-2">
                  Size: {product.variants.sizes.find((s) => s.id === selectedSize)?.value}
                </h3>
                <div className="flex gap-2">
                  {product.variants.sizes.map((size) => (
                    <button
                      key={size.id}
                      className={`px-4 py-2 border rounded-md text-sm ${
                        selectedSize === size.id
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-gray-400"
                      } ${!size.available ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => size.available && setSelectedSize(size.id)}
                      disabled={!size.available}
                    >
                      {size.value}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Quantity</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 text-center min-w-[60px]">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-gray-600">{product.stockCount} available</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" size="lg">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={isWishlisted ? "text-red-600 border-red-600" : ""}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-medium mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping & Returns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">30-Day Returns</p>
                  <p className="text-xs text-gray-600">Easy returns</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">2-Year Warranty</p>
                  <p className="text-xs text-gray-600">Manufacturer warranty</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  {product.description.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {/* Review Summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{product.rating}</div>
                      <div className="flex justify-center mb-2">{renderStars(product.rating, "md")}</div>
                      <p className="text-gray-600">Based on {product.reviewCount} reviews</p>
                    </div>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-sm w-8">{stars}★</span>
                          <Progress value={stars === 5 ? 60 : stars === 4 ? 30 : 10} className="flex-1" />
                          <span className="text-sm text-gray-600 w-8">
                            {stars === 5 ? "77" : stars === 4 ? "38" : "13"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{review.user.name}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-sm text-gray-600">{review.date.toLocaleDateString()}</span>
                          </div>
                          <h4 className="font-medium mb-2">{review.title}</h4>
                          <p className="text-gray-700">{review.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-medium mb-2 line-clamp-2">{relatedProduct.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(relatedProduct.rating)}
                    <span className="text-sm text-gray-600">({relatedProduct.rating})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{formatCurrency(relatedProduct.price)}</span>
                    {relatedProduct.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatCurrency(relatedProduct.originalPrice)}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
