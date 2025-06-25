"use client"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Package, MapPin, Phone, Mail, Calendar } from "lucide-react"
import { LucideUser } from "lucide-react"
import Logout from "@/components/global/Logout"

interface UserType {
  id: number
  name: string
  email: string
  phone_number: string | null
  address: string | null
  email_verified_at: string | null
  created_at: string
  updated_at: string
  role: string
}

interface Order {
  id: number
  order_number: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  items: {
    name: string
    quantity: number
    price: number
  }[]
}

interface Rating {
  id: number
  product_name: string
  rating: number
  review: string
  date: string
  order_number: string
}

const AccountPage = () => {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  // Dummy data for orders
  const [orders] = useState<Order[]>([
    {
      id: 1,
      order_number: "ORD-2024-001",
      date: "2024-06-20",
      status: "delivered",
      total: 299.99,
      items: [
        { name: "Wireless Headphones", quantity: 1, price: 199.99 },
        { name: "Phone Case", quantity: 2, price: 50.0 },
      ],
    },
    {
      id: 2,
      order_number: "ORD-2024-002",
      date: "2024-06-22",
      status: "shipped",
      total: 149.99,
      items: [{ name: "Bluetooth Speaker", quantity: 1, price: 149.99 }],
    },
    {
      id: 3,
      order_number: "ORD-2024-003",
      date: "2024-06-24",
      status: "processing",
      total: 89.99,
      items: [{ name: "USB Cable", quantity: 3, price: 29.99 }],
    },
  ])

  // Dummy data for ratings
  const [ratings] = useState<Rating[]>([
    {
      id: 1,
      product_name: "Wireless Headphones",
      rating: 5,
      review: "Excellent sound quality and comfortable to wear for long periods. Highly recommended!",
      date: "2024-06-21",
      order_number: "ORD-2024-001",
    },
    {
      id: 2,
      product_name: "Phone Case",
      rating: 4,
      review: "Good protection and nice design. Fits perfectly on my phone.",
      date: "2024-06-21",
      order_number: "ORD-2024-001",
    },
    {
      id: 3,
      product_name: "Bluetooth Speaker",
      rating: 4,
      review: "Great sound for the price. Battery life could be better but overall satisfied.",
      date: "2024-06-23",
      order_number: "ORD-2024-002",
    },
  ])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("auth_token")
        const res = await fetch("http://127.0.0.1:8000/api/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else {
          console.error("Failed to fetch user data")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Failed to load user data</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl flex flex-col gap-10">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg font-semibold">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">Customer Account</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <LucideUser className="h-4 w-4" />
            Customer Details
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="ratings" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Ratings & Reviews
          </TabsTrigger>
        </TabsList>

            {/* Customer Details  */}
        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <LucideUser className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                      <p className="font-medium">{user.email}</p>
                      {/* {!user.email_verified_at && (
                        <Badge variant="outline" className="mt-1">
                          Unverified
                        </Badge>
                      )} */}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                      <p className="font-medium">{user.phone_number || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Address</p>
                      <p className="font-medium">{user.address || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                      <p className="font-medium">
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="capitalize">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
                        {/* Customer Orders */}
        <TabsContent value="orders" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Order History</h2>
              <Badge variant="outline">{orders.length} Orders</Badge>
            </div>

            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.order_number}</CardTitle>
                      <CardDescription>Ordered on {new Date(order.date).toLocaleDateString()}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-3 font-bold text-lg">
                      <span>Total:</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
            {/* Customer Reviews */}
        <TabsContent value="ratings" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Reviews</h2>
              <Badge variant="outline">{ratings.length} Reviews</Badge>
            </div>

            {ratings.map((rating) => (
              <Card key={rating.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{rating.product_name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">{renderStars(rating.rating)}</div>
                        <span className="text-sm text-muted-foreground">{rating.rating}/5 stars</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {rating.order_number}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{rating.review}</p>
                  <p className="text-sm text-muted-foreground">
                    Reviewed on {new Date(rating.date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>


      {/* Logout Sectio */}
      <div className="w-30% self-end">
      <Logout/>
      </div>

    </div>
  )
}

export default AccountPage
