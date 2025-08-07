import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Leaf, Truck, RotateCcw, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Product } from "@shared/schema";
import { CATEGORIES } from "@/lib/types";

export default function Home() {
  const { data: featuredProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  const categories = [
    {
      key: "skincare" as const,
      name: CATEGORIES.skincare,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      description: "منتجات طبيعية للعناية بجمال بشرتك"
    },
    {
      key: "herbal-remedies" as const,
      name: CATEGORIES["herbal-remedies"],
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      description: "مجموعة متنوعة من الأعشاب الطبيعية"
    },
    {
      key: "organic-foods" as const,
      name: CATEGORIES["organic-foods"],
      image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      description: "أطعمة عضوية طازجة وصحية"
    },
    {
      key: "essential-oils" as const,
      name: CATEGORIES["essential-oils"],
      image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      description: "زيوت عطرية نقية وطبيعية"
    }
  ];

  const trustBadges = [
    {
      icon: Leaf,
      title: "منتجات طبيعية 100%",
      description: "جميع منتجاتنا من مصادر طبيعية"
    },
    {
      icon: Truck,
      title: "شحن مجاني",
      description: "على الطلبات أكثر من 200 ريال"
    },
    {
      icon: RotateCcw,
      title: "إرجاع مجاني",
      description: "خلال 30 يوم من الشراء"
    },
    {
      icon: Headphones,
      title: "دعم 24/7",
      description: "فريق دعم متاح دائماً"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-l from-natural-600 to-natural-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="text-hero-title">
              منتجات طبيعية أصيلة
            </h1>
            <p className="text-xl md:text-2xl text-natural-100 mb-8 max-w-2xl mx-auto">
              اكتشف مجموعتنا المتميزة من المنتجات الطبيعية والعضوية للعناية بصحتك وجمالك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button 
                  size="lg" 
                  className="bg-white text-natural-700 hover:bg-natural-50"
                  data-testid="button-shop-now"
                >
                  تسوق الآن
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-natural-700"
                data-testid="button-learn-more"
              >
                تعرف أكثر
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">فئات المنتجات</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              اختر من بين مجموعة متنوعة من المنتجات الطبيعية المصممة لتناسب احتياجاتك
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.key}
                href={`/products?category=${category.key}`}
                className="group cursor-pointer"
                data-testid={`category-${category.key}`}
              >
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{category.name}</h3>
                <p className="text-slate-600 text-sm">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">المنتجات المميزة</h2>
              <p className="text-slate-600">اكتشف أفضل منتجاتنا الطبيعية</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="border-natural-600 text-natural-600 hover:bg-natural-600 hover:text-white">
                عرض جميع المنتجات
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4">
                  <Skeleton className="w-full h-48 mb-4 rounded-lg" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-3" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              data-testid="featured-products-grid"
            >
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button 
                variant="outline" 
                className="border-natural-600 text-natural-600 hover:bg-natural-600 hover:text-white"
                data-testid="button-view-more"
              >
                عرض المزيد من المنتجات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-natural-100 rounded-full flex items-center justify-center mb-4">
                  <badge.icon className="h-8 w-8 text-natural-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 text-sm md:text-base">
                  {badge.title}
                </h3>
                <p className="text-slate-600 text-xs md:text-sm">
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
