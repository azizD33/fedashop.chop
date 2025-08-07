import { type Product, type InsertProduct, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private orders: Map<string, Order>;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.seedProducts();
  }

  private seedProducts() {
    const sampleProducts: Product[] = [
      {
        id: "1",
        name: "سيروم الوجه الطبيعي",
        description: "سيروم مركز للعناية بالبشرة مصنوع من المكونات الطبيعية",
        price: "150.00",
        imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "skincare",
        inStock: true,
        stockQuantity: 25,
        rating: "5.0",
        reviewCount: 24,
        featured: true,
        createdAt: new Date(),
      },
      {
        id: "2",
        name: "عسل الأكاسيا النقي",
        description: "عسل طبيعي نقي 100% من أزهار الأكاسيا البرية",
        price: "85.00",
        imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "organic-foods",
        inStock: true,
        stockQuantity: 15,
        rating: "5.0",
        reviewCount: 18,
        featured: true,
        createdAt: new Date(),
      },
      {
        id: "3",
        name: "زيت اللافندر العطري",
        description: "زيت عطري نقي من اللافندر للاسترخاء والهدوء",
        price: "120.00",
        imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "essential-oils",
        inStock: true,
        stockQuantity: 30,
        rating: "5.0",
        reviewCount: 32,
        featured: true,
        createdAt: new Date(),
      },
      {
        id: "4",
        name: "شاي الأعشاب المخلوط",
        description: "خلطة متميزة من الأعشاب الطبيعية للصحة والعافية",
        price: "65.00",
        imageUrl: "https://images.unsplash.com/photo-1627825296022-d3ce060f72a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "herbal-remedies",
        inStock: true,
        stockQuantity: 20,
        rating: "4.0",
        reviewCount: 15,
        featured: true,
        createdAt: new Date(),
      },
      {
        id: "5",
        name: "صابون الأعشاب الطبيعي",
        description: "صابون مصنوع يدوياً من المكونات الطبيعية",
        price: "45.00",
        imageUrl: "https://images.unsplash.com/photo-1556909088-95d5240ac8fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "skincare",
        inStock: true,
        stockQuantity: 40,
        rating: "5.0",
        reviewCount: 28,
        featured: true,
        createdAt: new Date(),
      },
      {
        id: "6",
        name: "زيت جوز الهند العضوي",
        description: "زيت جوز هند بكر مضغوط على البارد",
        price: "95.00",
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "organic-foods",
        inStock: true,
        stockQuantity: 18,
        rating: "4.0",
        reviewCount: 21,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: "7",
        name: "قناع الطين الطبيعي",
        description: "قناع منقي للوجه من الطين الطبيعي والعسل",
        price: "75.00",
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "skincare",
        inStock: true,
        stockQuantity: 22,
        rating: "5.0",
        reviewCount: 19,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: "8",
        name: "الشاي الأخضر العضوي",
        description: "شاي أخضر عضوي عالي الجودة غني بمضادات الأكسدة",
        price: "55.00",
        imageUrl: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "organic-foods",
        inStock: true,
        stockQuantity: 35,
        rating: "5.0",
        reviewCount: 26,
        featured: false,
        createdAt: new Date(),
      },
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category === category
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.featured
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }
}

export const storage = new MemStorage();
