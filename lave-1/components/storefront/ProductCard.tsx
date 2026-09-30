import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  images: { url: string }[];
  category: { name: string };
  newArrival: boolean;
  bestSeller: boolean;
};

export function ProductCard({ product }: { product: Product }) {
  const mainImage = product.images[0]?.url;
  const secondImage = product.images[1]?.url;
  const displayPrice = product.discountPrice ?? product.price;
  const hasDiscount = !!product.discountPrice;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#FFF7F3]">
        {mainImage ? (
          <>
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {secondImage && (
              <Image
                src={secondImage}
                alt={product.name}
                fill
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#EDE2E5] font-serif text-4xl">{product.name[0]}</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.newArrival && (
            <span className="text-[10px] font-semibold bg-[#3D3436] text-white px-2.5 py-1 rounded-full">
              Baru
            </span>
          )}
          {product.bestSeller && (
            <span className="text-[10px] font-semibold bg-[#E8B7C6] text-[#3D3436] px-2.5 py-1 rounded-full">
              Terlaris
            </span>
          )}
          {hasDiscount && (
            <span className="text-[10px] font-semibold bg-[#7A9B82] text-white px-2.5 py-1 rounded-full">
              Diskon
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 px-1">
        <p className="text-xs text-[#A99B9F] mb-1">{product.category.name}</p>
        <h3 className="text-sm font-medium text-[#3D3436] line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-semibold text-[#3D3436]">
            Rp {displayPrice.toLocaleString("id-ID")}
          </span>
          {hasDiscount && (
            <span className="text-xs text-[#A99B9F] line-through">
              Rp {product.price.toLocaleString("id-ID")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
