import { Star, Heart, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
}

export default function ProductCard({ product, showBadge = true }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      imageUrl: product.imageUrl,
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 fill-amber-400/50 text-amber-400" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-slate-300" />
      );
    }

    return stars;
  };

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 group cursor-pointer"
        data-testid={`card-product-${product.id}`}
      >
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          {showBadge && product.featured && (
            <Badge className="absolute top-2 right-2 bg-natural-600 hover:bg-natural-700">
              مميز
            </Badge>
          )}
          
          {!product.inStock && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              نفد المخزون
            </Badge>
          )}

          {/* Wishlist Button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 left-2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Heart className="h-4 w-4 text-slate-600 hover:text-red-500" />
          </Button>
        </div>

        <div className="p-4">
          <h3
            className="font-semibold text-slate-800 mb-2 line-clamp-2"
            data-testid={`text-product-name-${product.id}`}
          >
            {product.name}
          </h3>
          
          <p
            className="text-slate-600 text-sm mb-3 line-clamp-2"
            data-testid={`text-product-description-${product.id}`}
          >
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <div className="flex">
                {renderStars(parseFloat(product.rating))}
              </div>
              <span className="text-slate-600 text-sm mr-2">
                ({product.reviewCount})
              </span>
            </div>
            <span
              className="text-natural-600 font-semibold text-lg"
              data-testid={`text-price-${product.id}`}
            >
              {parseFloat(product.price).toFixed(0)} ريال
            </span>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full bg-natural-600 hover:bg-natural-700"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingCart className="h-4 w-4 ml-2" />
            {product.inStock ? "أضف للسلة" : "نفد المخزون"}
          </Button>
        </div>
      </div>
    </Link>
  );
}
