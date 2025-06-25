"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
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
import axios, { Axios } from "axios"

// Types based on your API data
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"

interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: string
  created_at: string
  updated_at: string
}

interface Order {
  id: number
  user_id: number
  total_amount: string
  status: OrderStatus
  created_at: string
  updated_at: string
  items: OrderItem[]
}



// Sample data using your API structure
// const orders: Order[] = [
//   {
//     id: 25,
//     user_id: 2,
//     total_amount: "299.99",
//     status: "pending",
//     created_at: "2025-06-25T10:35:12.000000Z",
//     updated_at: "2025-06-25T10:35:12.000000Z",
//     items: [
//       {
//         id: 3,
//         order_id: 25,
//         product_id: 1,
//         quantity: 2,
//         price: "99.99",
//         created_at: "2025-06-25T10:35:12.000000Z",
//         updated_at: "2025-06-25T10:35:12.000000Z",
//       },
//       {
//         id: 4,
//         order_id: 25,
//         product_id: 5,
//         quantity: 1,
//         price: "99.99",
//         created_at: "2025-06-25T10:35:12.000000Z",
//         updated_at: "2025-06-25T10:35:12.000000Z",
//       },
//     ],
//   },
// ]

// Helper function to get status badge variant
const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return { variant: "outline", icon: <Clock className="h-3 w-3 mr-1" />, label: "Pending" }
    case "processing":
      return { variant: "secondary", icon: <Clock className="h-3 w-3 mr-1" />, label: "Processing" }
    case "shipped":
      return { variant: "default", icon: <Truck className="h-3 w-3 mr-1" />, label: "Shipped" }
    case "delivered":
      return { variant: "default", icon: <CheckCircle2 className="h-3 w-3 mr-1" />, label: "Delivered" }
    case "cancelled":
      return { variant: "destructive", icon: <XCircle className="h-3 w-3 mr-1" />, label: "Cancelled" }
    case "refunded":
      return { variant: "outline", icon: <ArrowUpDown className="h-3 w-3 mr-1" />, label: "Refunded" }
    default:
      return { variant: "outline", icon: null, label: status }
  }
}

// Format currency
const formatCurrency = (amount: string | number) => {
  const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numAmount)
}

// Format date from ISO string
const formatDate = (dateString: string) => {
  return format(new Date(dateString), "MMM d, yyyy")
}


export default function OrdersPage() {


  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [orders , setOrders] = useState<Order[]>([])

  // Filter orders based on search query and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchQuery.toLowerCase()) ||
      order.user_id.toString().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Sort orders by date
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()

    if (sortOrder === "asc") {
      return dateA - dateB
    } else {
      return dateB - dateA
    }
  })

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  useEffect(()=>{

    const fetchOrders = async ()=>{
      const token = Cookies.get("auth_token")
      const response = await axios.get("http://localhost:8000/api/orders",{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response)
      if(response.data){
        setOrders(response.data)
      }

    }

    fetchOrders()
    

  },[])

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
            placeholder="Search by order ID or user ID..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
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
                  <TableHead>Order ID</TableHead>
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
                  <TableHead>User ID</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedOrders.map((order) => {
                    const statusBadge = getStatusBadge(order.status)
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{formatDate(order.created_at)}</TableCell>
                        <TableCell>User #{order.user_id}</TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell>
                          <Badge variant={statusBadge.variant as any} className="flex items-center w-fit">
                            {statusBadge.icon}
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(order.total_amount)}</TableCell>
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
              Order #{selectedOrder?.id} - {selectedOrder && formatDate(selectedOrder.created_at)}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Order ID</h4>
                  <p className="text-sm font-medium">#{selectedOrder.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                  <p className="text-sm font-medium">{formatDate(selectedOrder.created_at)}</p>
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
                  <h4 className="text-sm font-medium text-muted-foreground">User ID</h4>
                  <p className="text-sm font-medium">#{selectedOrder.user_id}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-medium mb-2">Order Items</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product ID</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>Product #{item.product_id}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(Number.parseFloat(item.price) * item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(selectedOrder.total_amount)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Order Timeline */}
              <div>
                <h3 className="text-lg font-medium mb-2">Order Timeline</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4" />
                    <span>Order created: {formatDate(selectedOrder.created_at)}</span>
                  </div>
                  {selectedOrder.updated_at !== selectedOrder.created_at && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>Last updated: {formatDate(selectedOrder.updated_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                {selectedOrder.status === "pending" && (
                  <Button>
                    <Clock className="mr-2 h-4 w-4" />
                    Mark as Processing
                  </Button>
                )}
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
