import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Product } from "@shared/schema";
import { CATEGORIES } from "@/lib/types";

export default function Products() {
  const [location] = useLocation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const search = urlParams.get('search');
    const category = urlParams.get('category');
    
    if (search) setSearchQuery(search);
    if (category) setSelectedCategory(category);
  }, [location]);

  // Fetch products based on filters
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products", { search: searchQuery, category: selectedCategory }],
    queryFn: async () => {
      let url = "/api/products";
      
      if (searchQuery) {
        url = `/api/products/search?q=${encodeURIComponent(searchQuery)}`;
      } else if (selectedCategory && selectedCategory !== "all") {
        url = `/api/products/category/${selectedCategory}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
  });

  // Sort and filter products
  const filteredProducts = products ? [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "name":
        return a.name.localeCompare(b.name);
      case "rating":
        return parseFloat(b.rating) - parseFloat(a.rating);
      case "featured":
      default:
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
    }
  }) : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the effect above when searchQuery changes
  };

  const categories = [
    { key: "all", name: "جميع الفئات" },
    ...Object.entries(CATEGORIES).map(([key, name]) => ({ key, name }))
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4" data-testid="text-page-title">
            {searchQuery ? `نتائج البحث: "${searchQuery}"` : 
             selectedCategory !== "all" ? CATEGORIES[selectedCategory as keyof typeof CATEGORIES] || "المنتجات" : 
             "جميع المنتجات"}
          </h1>
          <p className="text-slate-600">
            {products ? `${filteredProducts.length} منتج` : "جاري التحميل..."}
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <Input
              type="text"
              placeholder="البحث عن المنتجات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              data-testid="input-product-search"
            />
          </form>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-48" data-testid="select-category">
              <SelectValue placeholder="اختر الفئة" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.key} value={category.key}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48" data-testid="select-sort">
              <SelectValue placeholder="ترتيب حسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">المميزة</SelectItem>
              <SelectItem value="name">الاسم</SelectItem>
              <SelectItem value="price-low">السعر: من الأقل للأعلى</SelectItem>
              <SelectItem value="price-high">السعر: من الأعلى للأقل</SelectItem>
              <SelectItem value="rating">التقييم</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex gap-2">
            <Button
              size="icon"
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
              data-testid="button-grid-view"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              data-testid="button-list-view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid/List */}
        {error ? (
          <div className="text-center py-12" data-testid="error-message">
            <div className="text-red-500 mb-4">حدث خطأ أثناء تحميل المنتجات</div>
            <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
          </div>
        ) : isLoading ? (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-4">
                <Skeleton className="w-full h-48 mb-4 rounded-lg" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-3" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12" data-testid="no-products">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">لم يتم العثور على منتجات</h3>
            <p className="text-slate-600 mb-4">جرب تغيير معايير البحث أو الفلترة</p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}>
              مسح الفلاتر
            </Button>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1 lg:grid-cols-2"
            }`}
            data-testid="products-grid"
          >
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                showBadge={true}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
