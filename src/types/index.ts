export type {
  User,
  Product,
  ProductImage,
  Category,
  Order,
  OrderItem,
  SiteContent,
  AdminLog,
} from '@prisma/client'

export type OrderWithItems = import('@prisma/client').Order & {
  items: (import('@prisma/client').OrderItem & {
    product: import('@prisma/client').Product
  })[]
  user: import('@prisma/client').User
}

export type ProductWithImages = import('@prisma/client').Product & {
  images: import('@prisma/client').ProductImage[]
  category: import('@prisma/client').Category
}

export type DashboardStats = {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  recentOrders: {
    id: string
    orderNumber: string
    userName: string
    totalAmount: number
    status: string
    createdAt: Date
  }[]
  revenueByMonth: {
    month: string
    revenue: number
  }[]
}
