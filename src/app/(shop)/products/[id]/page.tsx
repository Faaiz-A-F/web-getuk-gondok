import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  return prisma.product.findFirst({
    where: { id, isActive: true },
    include: {
      category: true,
      images: { orderBy: [{ isPrimary: "desc" }, { order: "asc" }] },
    },
  });
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Produk tidak ditemukan" };
  return {
    title: `${product.name} | Getuk Gondok`,
    description: product.description || `Pesan ${product.name} dari Getuk Gondok Hj. Sri Rahayu.`,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <ProductDetailClient
      product={{
        id: product.id,
        name: product.name,
        description: product.description || "Produk tradisional pilihan yang dibuat segar dengan resep keluarga.",
        price: Number(product.price),
        stock: product.stock,
        weight: product.weight,
        category: product.category.name,
        image: product.images[0]?.url || "/products/placeholder.webp",
      }}
    />
  );
}
