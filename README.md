# Getuk Gondok - UMKM E-Commerce Web App

A traditional Indonesian food shop e-commerce platform built with Next.js, Prisma, MySQL, and Docker.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL 8.0 (via Docker)
- **Charts**: Recharts, Lucide React

---

## Prerequisites

Before running this project, make sure you have:

1. **Node.js** 18+ installed
2. **Docker Desktop** installed and running
3. **npm** or **yarn** package manager

---

## Quick Start Guide

### Step 1: Clone & Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd web-getuk-gondok

# Install dependencies
npm install
```

### Step 2: Set Up Docker MySQL Database

```bash
# Start the MySQL container
docker compose up -d

# Wait 5 seconds for MySQL to be ready
timeout /t 5

# Verify container is running
docker ps
```

You should see `getuk-gondok-db` in the list.

### Step 3: Set Up Environment Variables

```bash
# Copy the example env file
copy .env.example .env

# Or create .env manually with:
# DATABASE_URL="mysql://getuk_user:getuk_password@localhost:3306/getuk_gondok"
```

### Step 4: Generate Prisma Client & Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init
```

### Step 5: Seed the Database (Optional - Creates Test Data)

```bash
# Seed the database with sample data
npx prisma db seed
```

This creates:
- 1 Admin user: `admin@getukgondok.com` / `Admin123!`
- 1 Customer user: `customer@example.com` / `Customer123!`
- 4 Categories
- 4 Products
- 6 Site Content entries
- 1 Sample Order

### Step 6: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

### Database Management

```bash
npm run db:up          # Start Docker container
npm run db:down        # Stop Docker container
npm run db:reset       # Reset database (delete volumes + recreate)
npm run prisma:seed    # Re-run seed script
npm run prisma:reset   # Reset migrations + seed
```

### Development

```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run start          # Start production server
npm run lint           # Run ESLint
```

### Database Tools

```bash
npx prisma studio      # Open Prisma Studio (GUI for database)
npx prisma generate    # Generate Prisma client
npx prisma migrate     # Run migrations
```

---

## Project Structure

```
web-getuk-gondok/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Seed script
│   └── migrations/         # Migration history
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── admin/     # Admin API routes
│   │   │       ├── dashboard/
│   │   │       ├── orders/
│   │   │       ├── products/
│   │   │       └── site-content/
│   │   └── page.tsx       # Main page
│   ├── components/        # React components
│   ├── lib/
│   │   ├── prisma.ts      # Prisma client singleton
│   │   └── auth.ts        # Admin auth helper
│   └── types/
│       └── index.ts       # TypeScript types
├── docker-compose.yml      # Docker configuration
├── .env                    # Environment variables (not committed)
└── .env.example            # Example environment file
```

---

## Database Schema

The application uses the following Prisma models:

- **User** - Customers and admins
- **Category** - Product categories
- **Product** - Products with images
- **ProductImage** - Product image gallery
- **Order** - Customer orders
- **OrderItem** - Order line items
- **SiteContent** - CMS content for landing page
- **AdminLog** - Audit trail for admin actions

---

## Troubleshooting

### Docker Issues

```bash
# Check if Docker is running
docker ps

# View container logs
docker logs getuk-gondok-db

# Restart container
docker compose restart

# Full reset (deletes all data)
docker compose down -v
docker compose up -d
```

### Database Connection Issues

```bash
# Verify DATABASE_URL in .env
cat .env

# Check if MySQL is accessible
docker exec -it getuk-gondok-db mysql -ugetuk_user -pgetuk_password -e "SHOW DATABASES;"
```

### Prisma Issues

```bash
# Clean reinstall
rm -rf node_modules
rm package-lock.json
npm install
npx prisma generate
npx prisma migrate dev --name init
```

---

## License

This project is for educational purposes.
