"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Download,
  Calendar,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  XCircle,
} from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Types
type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "on-hold"

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  total: number
}

interface Order {
  id: string
  orderNumber: string
  date: Date
  customer: {
    name: string
    email: string
  }
  items: OrderItem[]
  total: number
  status: OrderStatus
  paymentMethod: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  trackingNumber?: string
}

// Sample data
const orders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2023-1001",
    date: new Date(2023, 5, 15),
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
    },
    items: [
      { id: "item1", name: "Wireless Headphones", quantity: 1, price: 89.99, total: 89.99 },
      { id: "item2", name: "Phone Case", quantity: 2, price: 19.99, total: 39.98 },
    ],
    total: 129.97,
    status: "delivered",
    paymentMethod: "Credit Card",
    shippingAddress: {
      street: "123 Main St",
      city: "Austin",
      state: "TX",
      zip: "78701",
      country: "USA",
    },
    trackingNumber: "TRK928374651",
  },
  {
    id: "2",
    orderNumber: "ORD-2023-1002",
    date: new Date(2023, 5, 18),
    customer: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
    items: [{ id: "item3", name: "Smart Watch", quantity: 1, price: 199.99, total: 199.99 }],
    total: 199.99,
    status: "shipped",
    paymentMethod: "PayPal",
    shippingAddress: {
      street: "456 Oak Ave",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "USA",
    },
    trackingNumber: "TRK837465192",
  },
  {
    id: "3",
    orderNumber: "ORD-2023-1003",
    date: new Date(2023, 5, 20),
    customer: {
      name: "Robert Johnson",
      email: "robert.j@example.com",
    },
    items: [
      { id: "item4", name: "Laptop Stand", quantity: 1, price: 49.99, total: 49.99 },
      { id: "item5", name: "Wireless Mouse", quantity: 1, price: 29.99, total: 29.99 },
      { id: "item6", name: "USB-C Cable", quantity: 2, price: 12.99, total: 25.98 },
    ],
    total: 105.96,
    status: "processing",
    paymentMethod: "Credit Card",
    shippingAddress: {
      street: "789 Pine Blvd",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA",
    },
  },
  {
    id: "4",
    orderNumber: "ORD-2023-1004",
    date: new Date(2023, 5, 22),
    customer: {
      name: "Emily Davis",
      email: "emily.d@example.com",
    },
    items: [{ id: "item7", name: "Bluetooth Speaker", quantity: 1, price: 79.99, total: 79.99 }],
    total: 79.99,
    status: "cancelled",
    paymentMethod: "Credit Card",
    shippingAddress: {
      street: "101 Maple Dr",
      city: "Boston",
      state: "MA",
      zip: "02108",
      country: "USA",
    },
  },
  {
    id: "5",
    orderNumber: "ORD-2023-1005",
    date: new Date(2023, 5, 25),
    customer: {
      name: "Michael Wilson",
      email: "michael.w@example.com",
    },
    items: [
      { id: "item8", name: "External Hard Drive", quantity: 1, price: 129.99, total: 129.99 },
      { id: "item9", name: "HDMI Cable", quantity: 1, price: 14.99, total: 14.99 },
    ],
    total: 144.98,
    status: "on-hold",
    paymentMethod: "Bank Transfer",
    shippingAddress: {
      street: "202 Cedar St",
      city: "San Francisco",
      state: "CA",
      zip: "94107",
      country: "USA",
    },
  },
  {
    id: "6",
    orderNumber: "ORD-2023-1006",
    date: new Date(2023, 5, 28),
    customer: {
      name: "Sarah Brown",
      email: "sarah.b@example.com",
    },
    items: [
      { id: "item10", name: "Wireless Keyboard", quantity: 1, price: 59.99, total: 59.99 },
      { id: "item11", name: "Monitor Stand", quantity: 1, price: 39.99, total: 39.99 },
    ],
    total: 99.98,
    status: "refunded",
    paymentMethod: "Credit Card",
    shippingAddress: {
      street: "303 Birch Ave",
      city: "Denver",
      state: "CO",
      zip: "80202",
      country: "USA",
    },
  },
]

// Helper function to get status badge variant
const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "processing":
      return { variant: "outline", icon: <Clock className="h-3 w-3 mr-1" />, label: "Processing" }
    case "shipped":
      return { variant: "secondary", icon: <Truck className="h-3 w-3 mr-1" />, label: "Shipped" }
    case "delivered":
      return { variant: "default", icon: <CheckCircle2 className="h-3 w-3 mr-1" />, label: "Delivered" }
    case "cancelled":
      return { variant: "destructive", icon: <XCircle className="h-3 w-3 mr-1" />, label: "Cancelled" }
    case "refunded":
      return { variant: "outline", icon: <ArrowUpDown className="h-3 w-3 mr-1" />, label: "Refunded" }
    case "on-hold":
      return { variant: "warning", icon: <AlertCircle className="h-3 w-3 mr-1" />, label: "On Hold" }
    default:
      return { variant: "outline", icon: null, label: status }
  }
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filter orders based on search query and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Sort orders by date
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.date.getTime() - b.date.getTime()
    } else {
      return b.date.getTime() - a.date.getTime()
    }
  })

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">View and manage your orders</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Orders
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Date Range</span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem>This month</DropdownMenuItem>
              <DropdownMenuItem>Last month</DropdownMenuItem>
              <DropdownMenuItem>Custom range</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>{filteredOrders.length} orders found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      className="flex items-center p-0 h-auto font-medium"
                    >
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedOrders.map((order) => {
                    const statusBadge = getStatusBadge(order.status)
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{format(order.date, "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          <div>
                            <div>{order.customer.name}</div>
                            <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadge.variant as any} className="flex items-center w-fit">
                            {statusBadge.icon}
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => viewOrderDetails(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder?.orderNumber} - {selectedOrder && format(selectedOrder.date, "MMMM d, yyyy")}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Order Number</h4>
                  <p className="text-sm font-medium">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                  <p className="text-sm font-medium">{format(selectedOrder.date, "MMM d, yyyy")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <Badge
                    variant={getStatusBadge(selectedOrder.status).variant as any}
                    className="mt-1 flex items-center w-fit"
                  >
                    {getStatusBadge(selectedOrder.status).icon}
                    {getStatusBadge(selectedOrder.status).label}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Payment Method</h4>
                  <p className="text-sm font-medium">{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Customer</h4>
                    <p className="text-sm font-medium">{selectedOrder.customer.name}</p>
                    <p className="text-sm">{selectedOrder.customer.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Shipping Address</h4>
                    <p className="text-sm">{selectedOrder.shippingAddress.street}</p>
                    <p className="text-sm">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                      {selectedOrder.shippingAddress.zip}
                    </p>
                    <p className="text-sm">{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              </div>

              {/* Tracking Info */}
              {selectedOrder.trackingNumber && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Tracking Information</h3>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="text-sm">Tracking Number: </span>
                    <span className="text-sm font-medium">{selectedOrder.trackingNumber}</span>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-medium mb-2">Order Items</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Subtotal
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(selectedOrder.items.reduce((sum, item) => sum + item.total, 0))}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Shipping
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(0)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(selectedOrder.total)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                {selectedOrder.status === "processing" && (
                  <Button>
                    <Truck className="mr-2 h-4 w-4" />
                    Mark as Shipped
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
