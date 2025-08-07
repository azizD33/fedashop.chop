import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Star, ShoppingCart, Heart, Share2, Truck, RotateCcw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@shared/schema";
import { CATEGORIES } from "@/lib/types";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const { addToCart } = useCart();
  const productId = params?.id;

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ["/api/products/category", product?.category],
    enabled: !!product?.category,
  });

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        imageUrl: product.imageUrl,
      });
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-5 w-5 fill-amber-400/50 text-amber-400" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-5 w-5 text-slate-300" />
      );
    }

    return stars;
  };

  const formatPrice = (price: string) => {
    return `${parseFloat(price).toFixed(0)} ريال`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center" data-testid="error-message">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">لم يتم العثور على المنتج</h1>
            <p className="text-slate-600 mb-8">المنتج المطلوب غير موجود أو تم حذفه</p>
            <Button onClick={() => window.history.back()}>العودة للخلف</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Product Image Skeleton */}
            <div className="space-y-4">
              <Skeleton className="w-full h-96 rounded-lg" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-full h-20 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ) : product ? (
          <>
            {/* Product Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden rounded-lg bg-white">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    data-testid="img-product-main"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Title and Category */}
                <div>
                  <Badge className="mb-2" data-testid="badge-category">
                    {CATEGORIES[product.category as keyof typeof CATEGORIES] || product.category}
                  </Badge>
                  <h1 
                    className="text-3xl font-bold text-slate-800 mb-4"
                    data-testid="text-product-name"
                  >
                    {product.name}
                  </h1>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {renderStars(parseFloat(product.rating))}
                    </div>
                    <span className="text-slate-600">
                      ({product.reviewCount} تقييم)
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-3xl font-bold text-natural-600" data-testid="text-product-price">
                  {formatPrice(product.price)}
                </div>

                {/* Description */}
                <p 
                  className="text-slate-600 leading-relaxed"
                  data-testid="text-product-description"
                >
                  {product.description}
                </p>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  {product.inStock ? (
                    <>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 font-medium">متوفر في المخزون</span>
                      <span className="text-slate-500">({product.stockQuantity} قطعة)</span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 font-medium">نفد المخزون</span>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="flex-1 bg-natural-600 hover:bg-natural-700"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    data-testid="button-add-to-cart"
                  >
                    <ShoppingCart className="h-5 w-5 ml-2" />
                    {product.inStock ? "أضف للسلة" : "نفد المخزون"}
                  </Button>
                  
                  <Button size="lg" variant="outline" data-testid="button-wishlist">
                    <Heart className="h-5 w-5" />
                  </Button>
                  
                  <Button size="lg" variant="outline" data-testid="button-share">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-natural-600" />
                    <div>
                      <p className="font-medium text-slate-800">شحن مجاني</p>
                      <p className="text-xs text-slate-500">للطلبات فوق 200 ريال</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <RotateCcw className="h-5 w-5 text-natural-600" />
                    <div>
                      <p className="font-medium text-slate-800">إرجاع مجاني</p>
                      <p className="text-xs text-slate-500">خلال 30 يوم</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-natural-600" />
                    <div>
                      <p className="font-medium text-slate-800">ضمان الجودة</p>
                      <p className="text-xs text-slate-500">منتجات طبيعية 100%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Tabs */}
            <div className="mb-16">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">الوصف</TabsTrigger>
                  <TabsTrigger value="ingredients">المكونات</TabsTrigger>
                  <TabsTrigger value="reviews">التقييمات</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-6 p-6 bg-white rounded-lg">
                  <div className="prose prose-slate max-w-none">
                    <h3 className="text-lg font-semibold mb-4">وصف المنتج</h3>
                    <p className="text-slate-600 leading-relaxed">
                      {product.description}
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-4">
                      هذا المنتج مصنوع من أجود المكونات الطبيعية والعضوية المختارة بعناية لضمان الحصول على أفضل النتائج. 
                      تم تطويره باستخدام أحدث التقنيات مع الحفاظ على الطبيعة الأصيلة للمكونات.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="ingredients" className="mt-6 p-6 bg-white rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">المكونات</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li>• مكونات طبيعية عضوية 100%</li>
                    <li>• خالي من الكيماويات الضارة</li>
                    <li>• لم يتم اختباره على الحيوانات</li>
                    <li>• معتمد من الجهات المختصة</li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-6 p-6 bg-white rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">تقييمات العملاء</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex">{renderStars(5)}</div>
                      <div className="flex-1">
                        <p className="font-medium">عميل راضٍ</p>
                        <p className="text-slate-600 text-sm mt-1">
                          منتج ممتاز وجودة عالية، أنصح بشرائه
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 1 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-8">منتجات ذات صلة</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts
                    .filter(p => p.id !== product.id)
                    .slice(0, 4)
                    .map((relatedProduct) => (
                      <ProductCard key={relatedProduct.id} product={relatedProduct} />
                    ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>

      <Footer />
    </div>
  );
}
