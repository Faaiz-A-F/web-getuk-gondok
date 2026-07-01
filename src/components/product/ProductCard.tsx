import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils/formatPrice";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const productImageSrc = "/nobg/1.png";

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <Image
          src={productImageSrc}
          alt={product.name}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
          <p className="text-xl font-bold text-blue-600">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}
