import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/cart-context";
import { useLocation } from "wouter";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    onClose();
    setLocation("/checkout");
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(0)} ريال`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 flex flex-col">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle data-testid="text-cart-title">سلة التسوق</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-6">
          {items.length === 0 ? (
            <div className="text-center py-12" data-testid="empty-cart">
              <div className="text-4xl mb-4">🛒</div>
              <p className="text-slate-600 mb-4">سلة التسوق فارغة</p>
              <Button onClick={onClose} className="bg-natural-600 hover:bg-natural-700">
                تسوق الآن
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-reverse space-x-4 p-4 border border-slate-200 rounded-lg"
                  data-testid={`cart-item-${item.id}`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4
                      className="font-semibold text-slate-800 text-sm"
                      data-testid={`text-cart-item-name-${item.id}`}
                    >
                      {item.name}
                    </h4>
                    <p
                      className="text-natural-600 font-semibold"
                      data-testid={`text-cart-item-price-${item.id}`}
                    >
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex items-center space-x-reverse space-x-2 mt-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        data-testid={`button-decrease-${item.id}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span
                        className="text-sm font-medium min-w-[2rem] text-center"
                        data-testid={`text-quantity-${item.id}`}
                      >
                        {item.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        data-testid={`button-increase-${item.id}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                    data-testid={`button-remove-${item.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {items.length > 0 && (
          <div className="border-t p-6 bg-slate-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-slate-800">المجموع:</span>
              <span
                className="text-xl font-bold text-natural-600"
                data-testid="text-cart-total"
              >
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            <Button
              className="w-full bg-natural-600 hover:bg-natural-700 mb-3"
              onClick={handleCheckout}
              data-testid="button-checkout"
            >
              إتمام الشراء
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={onClose}
              data-testid="button-continue-shopping"
            >
              متابعة التسوق
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
