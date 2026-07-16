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

  // Create categories based on reference data
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "kardus" },
      update: {},
      create: { name: "Kardus", slug: "kardus", description: "Paket kardus berisi berbagai varian getuk" },
    }),
    prisma.category.upsert({
      where: { slug: "nampan" },
      update: {},
      create: { name: "Nampan", slug: "nampan", description: "Paket nampan dengan tatanan getuk hias" },
    }),
    prisma.category.upsert({
      where: { slug: "tampah" },
      update: {},
      create: { name: "Tampah", slug: "tampah", description: "Set tampah dengan berbagai ukuran" },
    }),
    prisma.category.upsert({
      where: { slug: "hantaran" },
      update: {},
      create: { name: "Hantaran", slug: "hantaran", description: "Paket hantaran spesial untuk acara" },
    }),
    prisma.category.upsert({
      where: { slug: "jajan-pasar" },
      update: {},
      create: { name: "Jajan Pasar", slug: "jajan-pasar", description: "Jajanan pasar tradisional" },
    }),
  ])

  // Create products based on reference data
  const products = await Promise.all([
    // Kardus products
    prisma.product.upsert({
      where: { slug: "kardus-kecil-s" },
      update: {},
      create: {
        name: "Kardus Kecil (S)",
        slug: "kardus-kecil-s",
        description: "Berisi aneka varian: 3 pcs Frambos, 3 pcs Pandan, 3 pcs Gula Jawa, 3 pcs Pelangi, 3 pcs Trio, dan 1 pcs Mawur.",
        price: 10000,
        stock: 100,
        weight: 500,
        categoryId: categories[0].id,
        isActive: true,
        images: {
          create: [{ url: "/products/1.webp", alt: "Kardus Kecil (S)", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "kardus-sedang-m" },
      update: {},
      create: {
        name: "Kardus Sedang (M)",
        slug: "kardus-sedang-m",
        description: "Berisi aneka varian: 4 pcs Frambos, 4 pcs Pandan, 4 pcs Gula Jawa, 4 pcs Pelangi, 5 pcs Trio, dan 1 pcs Mawur.",
        price: 15000,
        stock: 100,
        weight: 700,
        categoryId: categories[0].id,
        isActive: true,
        images: {
          create: [{ url: "/products/2.webp", alt: "Kardus Sedang (M)", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "kardus-sedang-l" },
      update: {},
      create: {
        name: "Kardus Sedang (L)",
        slug: "kardus-sedang-l",
        description: "Berisi Aneka Varian: 6 pcs Frambos, 6 pcs Pandan, 6 pcs Gula Jawa, 6 pcs Pelangi, 6 pcs Trio, dan 2 pcs Mawur.",
        price: 20000,
        stock: 100,
        weight: 900,
        categoryId: categories[0].id,
        isActive: true,
        images: {
          create: [{ url: "/products/3.webp", alt: "Kardus Sedang (L)", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "kardus-besar-xl" },
      update: {},
      create: {
        name: "Kardus Besar (XL)",
        slug: "kardus-besar-xl",
        description: "Berisi Aneka Varian: 7 pcs Frambos, 7 pcs Pandan, 7 pcs Gula Jawa, 7 pcs Pelangi, 7 pcs Trio, dan 3 pcs Mawur.",
        price: 25000,
        stock: 100,
        weight: 1200,
        categoryId: categories[0].id,
        isActive: true,
        images: {
          create: [{ url: "/products/4.webp", alt: "Kardus Besar (XL)", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "kardus-mix" },
      update: {},
      create: {
        name: "Kardus Mix",
        slug: "kardus-mix",
        description: "Getuk MIX berisi campuran Getuk, Klepon, Jongkong, Yangko",
        price: 30000,
        stock: 50,
        weight: 1500,
        categoryId: categories[0].id,
        isActive: true,
        images: {
          create: [{ url: "/products/5.webp", alt: "Kardus Mix", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "paket-jumbo" },
      update: {},
      create: {
        name: "Paket Jumbo",
        slug: "paket-jumbo",
        description: "Paket Getuk Komplit 1kg",
        price: 50000,
        stock: 30,
        weight: 1000,
        categoryId: categories[0].id,
        isActive: true,
        images: {
          create: [{ url: "/products/6.webp", alt: "Paket Jumbo", isPrimary: true, order: 0 }],
        },
      },
    }),
    // Nampan products
    prisma.product.upsert({
      where: { slug: "nampan-small-s" },
      update: {},
      create: {
        name: "Nampan Small (S)",
        slug: "nampan-small-s",
        description: "Paket nampan porsi kecil yang ditata cantik. Pas untuk hantaran personal atau camilan keluarga.",
        price: 50000,
        stock: 50,
        weight: 800,
        categoryId: categories[1].id,
        isActive: true,
        images: {
          create: [{ url: "/products/7.webp", alt: "Nampan Small (S)", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "nampan-medium-m" },
      update: {},
      create: {
        name: "Nampan Medium (M)",
        slug: "nampan-medium-m",
        description: "Paket nampan sedang dengan varian getuk hias yang lebih banyak. Sangat cocok untuk hidangan rapat atau kumpul sore.",
        price: 60000,
        stock: 50,
        weight: 1000,
        categoryId: categories[1].id,
        isActive: true,
        images: {
          create: [{ url: "/products/8.webp", alt: "Nampan Medium (M)", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "nampan-large-l" },
      update: {},
      create: {
        name: "Nampan Large (L)",
        slug: "nampan-large-l",
        description: "Paket nampan besar untuk porsi sajian bersama yang lebih puas. Pilihan terbaik untuk acara resmi, syukuran, atau buah tangan premium.",
        price: 75000,
        stock: 50,
        weight: 1200,
        categoryId: categories[1].id,
        isActive: true,
        images: {
          create: [{ url: "/products/9.webp", alt: "Nampan Large (L)", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "nampan-extra-large-xl" },
      update: {},
      create: {
        name: "Nampan Extra Large (XL)",
        slug: "nampan-extra-large-xl",
        description: "Paket nampan jumbo dengan porsi melimpah dan tatanan megah. Pilihan paling pas dan sangat ideal untuk hantaran besar atau acara resmi!",
        price: 100000,
        stock: 30,
        weight: 1500,
        categoryId: categories[1].id,
        isActive: true,
        images: {
          create: [{ url: "/products/10.webp", alt: "Nampan Extra Large (XL)", isPrimary: true, order: 0 }],
        },
      },
    }),
    // Tampah products
    prisma.product.upsert({
      where: { slug: "tampah-small-s" },
      update: {},
      create: {
        name: "Tampah Small (S)",
        slug: "tampah-small-s",
        description: "Set tampah bulat ukuran 35 CM. Pas untuk hantaran cantik atau camilan keluarga.",
        price: 100000,
        stock: 30,
        weight: 600,
        categoryId: categories[2].id,
        isActive: true,
        images: {
          create: [{ url: "/products/11.webp", alt: "Tampah Small (S)", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "tampah-medium-m" },
      update: {},
      create: {
        name: "Tampah Medium (M)",
        slug: "tampah-medium-m",
        description: "Set tampah ukuran 40 CM dengan varian warna-warni. Ideal untuk rapat atau arisan.",
        price: 125000,
        stock: 30,
        weight: 800,
        categoryId: categories[2].id,
        isActive: true,
        images: {
          create: [{ url: "/products/12.webp", alt: "Tampah Medium (M)", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "tampah-large-l" },
      update: {},
      create: {
        name: "Tampah Large (L)",
        slug: "tampah-large-l",
        description: "Set tampah besar ukuran 45 CM untuk porsi melimpah. Cocok untuk acara syukuran dan pesta.",
        price: 150000,
        stock: 20,
        weight: 1000,
        categoryId: categories[2].id,
        isActive: true,
        images: {
          create: [{ url: "/products/13.webp", alt: "Tampah Large (L)", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "tampah-extra-large-xl" },
      update: {},
      create: {
        name: "Tampah Extra Large (XL)",
        slug: "tampah-extra-large-xl",
        description: "Set tampah jumbo ukuran 50 CM dengan tatanan getuk hias megah. Pilihan premium terbaik untuk perayaan!",
        price: 200000,
        stock: 15,
        weight: 1200,
        categoryId: categories[2].id,
        isActive: true,
        images: {
          create: [{ url: "/products/14.webp", alt: "Tampah Extra Large (XL)", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "tumpeng" },
      update: {},
      create: {
        name: "Tumpeng",
        slug: "tumpeng",
        description: "Kreasi tumpeng hias tradisional. Sangat pas sebagai pusat perhatian di acara syukuran atau perayaan spesial!",
        price: 250000,
        stock: 10,
        weight: 1500,
        categoryId: categories[2].id,
        isActive: true,
        images: {
          create: [{ url: "/products/15.webp", alt: "Tumpeng", isPrimary: true, order: 0 }],
        },
      },
    }),
    // Hantaran products
    prisma.product.upsert({
      where: { slug: "wajik-jadah-hantaran" },
      update: {},
      create: {
        name: "Wajik-Jadah Hantaran",
        slug: "wajik-jadah-hantaran",
        description: "Paket hantaran besar berisi perpaduan wajik manis dan jadah gurih tradisional. Sangat ideal untuk hantaran resmi, seserahan, atau pelengkap pesta.",
        price: 300000,
        stock: 10,
        weight: 2000,
        categoryId: categories[3].id,
        isActive: true,
        images: {
          create: [{ url: "/products/16.webp", alt: "Wajik-Jadah Hantaran", isPrimary: true, order: 0 }],
        },
      },
    }),
    // Jajan Pasar products
    prisma.product.upsert({
      where: { slug: "klepon" },
      update: {},
      create: {
        name: "Klepon",
        slug: "klepon",
        description: "Jajanan tradisional dengan isian gula merah cair dan balutan kelapa parut yang gurih. Manis, lumer di mulut, dan pas untuk camilan.",
        price: 10000,
        stock: 200,
        weight: 100,
        categoryId: categories[4].id,
        isActive: true,
        images: {
          create: [{ url: "/products/17.webp", alt: "Klepon", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "jongkong" },
      update: {},
      create: {
        name: "Jongkong (Ongol-Ongol)",
        slug: "jongkong",
        description: "Jajanan pasar kenyal dengan cita rasa manis pedas jahe. Nikmat dan praktis sebagai camilan.",
        price: 10000,
        stock: 200,
        weight: 100,
        categoryId: categories[4].id,
        isActive: true,
        images: {
          create: [{ url: "/products/18.webp", alt: "Jongkong (Ongol-Ongol)", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "yangkoyangko" },
      update: {},
      create: {
        name: "Yangko",
        slug: "yangkoyangko",
        description: "Jajanan tradisional bertekstur kenyal dan lembut dengan isian kacang yang manis dan gurih.",
        price: 15000,
        stock: 150,
        weight: 120,
        categoryId: categories[4].id,
        isActive: true,
        images: {
          create: [{ url: "/products/19.webp", alt: "Yangko", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "wajik-jadah" },
      update: {},
      create: {
        name: "Wajik-Jadah",
        slug: "wajik-jadah",
        description: "Perpaduan sempurna antara manisnya wajik ketan dan gurihnya jadah tradisional. Cocok untuk camilan bersama keluarga.",
        price: 15000,
        stock: 150,
        weight: 150,
        categoryId: categories[4].id,
        isActive: true,
        images: {
          create: [{ url: "/products/20.webp", alt: "Wajik-Jadah", isPrimary: true, order: 0 }],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "wingko" },
      update: {},
      create: {
        name: "Wingko",
        slug: "wingko",
        description: "Wingko babat dengan cita rasa kelapa asli yang manis dan gurih alami.",
        price: 10000,
        stock: 200,
        weight: 100,
        categoryId: categories[4].id,
        isActive: true,
        images: {
          create: [{ url: "/products/21.webp", alt: "Wingko", isPrimary: true, order: 0 }],
        },
      },
    }),
  ])

  const siteContents = [
    { key: "landing_hero_title", type: ContentType.TEXT, value: "Getuk Gondok - Cita Rasa Tradisional Magelang", label: "Hero Title", section: "landing_hero" },
    { key: "landing_hero_subtitle", type: ContentType.TEXT, value: "Getuk singkong asli khas Magelang dengan berbagai varian rasa dan kemasan tradisional.", label: "Hero Subtitle", section: "landing_hero" },
    { key: "landing_hero_image", type: ContentType.IMAGE, value: "/design%20bg/1.png", label: "Hero Background Image", section: "landing_hero" },
    { key: "landing_highlight_image_1", type: ContentType.IMAGE, value: "/products/1.webp", label: "Highlight Image 1", section: "landing_highlight" },
    { key: "landing_highlight_image_2", type: ContentType.IMAGE, value: "/products/7.webp", label: "Highlight Image 2", section: "landing_highlight" },
    { key: "landing_highlight_image_3", type: ContentType.IMAGE, value: "/products/11.webp", label: "Highlight Image 3", section: "landing_highlight" },
    { key: "landing_reviews", type: ContentType.JSON, value: "[]", label: "Selected Landing Reviews", section: "landing_reviews" },
  ]

  for (const content of siteContents) {
    await prisma.siteContent.upsert({
      where: { key: content.key },
      update: {},
      create: { ...content, updatedById: admin.id },
    })
  }

  // Create sample orders
  const existingOrder1 = await prisma.order.findUnique({
    where: { orderNumber: "GG-0001" },
  })

  if (!existingOrder1 && products.length > 0) {
    const order1 = await prisma.order.create({
      data: {
        orderNumber: "GG-0001",
        status: OrderStatus.DONE,
        totalAmount: 50000,
        shippingCost: 0,
        shippingAddress: "Rumah Produksi - G643+24F, Karet, Bulurejo, Mertoyudan, Magelang Regency, Central Java 56172",
        paymentMethod: "Transfer Bank",
        paymentStatus: PaymentStatus.PAID,
        userId: customer.id,
        items: {
          create: [
            { quantity: 1, price: 50000, subtotal: 50000, productId: products[6].id },
          ],
        },
      },
    })

    await prisma.adminLog.create({
      data: {
        action: "UPDATE_STATUS",
        entity: "Order",
        entityId: order1.id,
        metadata: { from: "PAID", to: "DONE" },
        userId: admin.id,
        orderId: order1.id,
      },
    })
  }

  console.log("Seeding complete!")
  console.log(`Created ${categories.length} categories and ${products.length} products.`)
  console.log("Admin: admin@getukgondok.com / Admin123!")
  console.log("Customer: customer@example.com / Customer123!")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
