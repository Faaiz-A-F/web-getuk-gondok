import { PrismaClient, Role, OrderStatus, PaymentStatus, ContentType } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  const hashedPassword = await bcrypt.hash("Admin123!", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@getukgondok.com" },
    update: {},
    create: {
      email: "admin@getukgondok.com",
      password: hashedPassword,
      name: "Admin Getuk Gondok",
      role: Role.ADMIN,
    },
  })

  const customerPassword = await bcrypt.hash("Customer123!", 12)
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      password: customerPassword,
      name: "Budi Santoso",
      phone: "08123456789",
      address: "Jl. Contoh No. 1, Semarang",
      role: Role.CUSTOMER,
    },
  })

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "getuk-original" },
      update: {},
      create: { name: "Getuk Original", slug: "getuk-original", description: "Getuk rasa original khas Gondok" },
    }),
    prisma.category.upsert({
      where: { slug: "getuk-rasa" },
      update: {},
      create: { name: "Getuk Rasa", slug: "getuk-rasa", description: "Getuk dengan berbagai varian rasa" },
    }),
    prisma.category.upsert({
      where: { slug: "minuman" },
      update: {},
      create: { name: "Minuman", slug: "minuman", description: "Minuman pendamping getuk" },
    }),
    prisma.category.upsert({
      where: { slug: "paket-bundling" },
      update: {},
      create: { name: "Paket Bundling", slug: "paket-bundling", description: "Paket hemat getuk + minuman" },
    }),
  ])

  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: "getuk-original-250gr" },
      update: {},
      create: {
        name: "Getuk Original 250gr",
        slug: "getuk-original-250gr",
        description: "Getuk singkong original dengan kelapa parut.",
        price: 15000,
        stock: 50,
        weight: 250,
        categoryId: categories[0].id,
        images: {
          create: [{ url: "/images/placeholder-product.jpg", alt: "Getuk Original 250gr", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "getuk-coklat-250gr" },
      update: {},
      create: {
        name: "Getuk Coklat 250gr",
        slug: "getuk-coklat-250gr",
        description: "Getuk singkong dengan cita rasa coklat.",
        price: 18000,
        stock: 40,
        weight: 250,
        categoryId: categories[1].id,
        images: {
          create: [{ url: "/images/placeholder-product.jpg", alt: "Getuk Coklat 250gr", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "es-teh-manis" },
      update: {},
      create: {
        name: "Es Teh Manis",
        slug: "es-teh-manis",
        description: "Es teh manis segar.",
        price: 5000,
        stock: 100,
        weight: 300,
        categoryId: categories[2].id,
        images: {
          create: [{ url: "/images/placeholder-product.jpg", alt: "Es Teh Manis", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "paket-getuk-teh" },
      update: {},
      create: {
        name: "Paket Getuk + Teh",
        slug: "paket-getuk-teh",
        description: "Paket hemat 1 getuk original + 1 es teh manis.",
        price: 18000,
        stock: 30,
        weight: 550,
        categoryId: categories[3].id,
        images: {
          create: [{ url: "/images/placeholder-product.jpg", alt: "Paket Getuk + Teh", isPrimary: true, order: 0 }],
        },
      },
    }),
  ])

  const siteContents = [
    { key: "landing_hero_title", type: ContentType.TEXT, value: "Getuk Gondok - Cita Rasa Tradisional", label: "Hero Title", section: "landing_hero" },
    { key: "landing_hero_subtitle", type: ContentType.TEXT, value: "Getuk singkong asli Semarang.", label: "Hero Subtitle", section: "landing_hero" },
    { key: "landing_hero_image", type: ContentType.IMAGE, value: "/images/placeholder-hero.jpg", label: "Hero Background Image", section: "landing_hero" },
    { key: "landing_highlight_image_1", type: ContentType.IMAGE, value: "/images/placeholder-highlight-1.jpg", label: "Highlight Image 1", section: "landing_highlight" },
    { key: "landing_highlight_image_2", type: ContentType.IMAGE, value: "/images/placeholder-highlight-2.jpg", label: "Highlight Image 2", section: "landing_highlight" },
    { key: "landing_highlight_image_3", type: ContentType.IMAGE, value: "/images/placeholder-highlight-3.jpg", label: "Highlight Image 3", section: "landing_highlight" },
  ]

  for (const content of siteContents) {
    await prisma.siteContent.upsert({
      where: { key: content.key },
      update: {},
      create: { ...content, updatedById: admin.id },
    })
  }

  const order = await prisma.order.create({
    data: {
      orderNumber: "GG-0001",
      status: OrderStatus.DONE,
      totalAmount: 33000,
      shippingCost: 5000,
      shippingAddress: "Jl. Contoh No. 1, Semarang, Jawa Tengah",
      paymentMethod: "Transfer Bank",
      paymentStatus: PaymentStatus.PAID,
      userId: customer.id,
      items: {
        create: [
          { quantity: 1, price: 15000, subtotal: 15000, productId: products[0].id },
          { quantity: 1, price: 18000, subtotal: 18000, productId: products[1].id },
        ],
      },
    },
  })

  await prisma.adminLog.create({
    data: {
      action: "UPDATE_STATUS",
      entity: "Order",
      entityId: order.id,
      metadata: { from: "PAID", to: "DONE" },
      userId: admin.id,
      orderId: order.id,
    },
  })

  console.log("Seeding complete!")
  console.log("Admin: admin@getukgondok.com / Admin123!")
  console.log("Customer: customer@example.com / Customer123!")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
