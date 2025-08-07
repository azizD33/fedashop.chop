export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: { id: string; name: string; price: number; imageUrl: string }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const CATEGORIES = {
  'skincare': 'العناية بالبشرة',
  'herbal-remedies': 'الأعشاب الطبيعية',
  'organic-foods': 'الأطعمة العضوية',
  'essential-oils': 'الزيوت العطرية',
} as const;
