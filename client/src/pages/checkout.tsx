import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { CreditCard, Banknote, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useCart } from "@/contexts/cart-context";
import { apiRequest } from "@/lib/queryClient";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "اسم العميل مطلوب"),
  customerEmail: z.string().email("بريد إلكتروني صحيح مطلوب"),
  customerPhone: z.string().min(10, "رقم هاتف صحيح مطلوب"),
  shippingAddress: z.string().min(10, "عنوان الشحن مطلوب"),
  city: z.string().min(2, "المدينة مطلوبة"),
  postalCode: z.string().min(5, "الرمز البريدي مطلوب"),
  paymentMethod: z.enum(["credit-card", "bank-transfer", "cash-on-delivery"], {
    required_error: "يرجى اختيار طريقة الدفع"
  })
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, clearCart, getTotalPrice } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: "",
      city: "",
      postalCode: "",
      paymentMethod: "cash-on-delivery"
    }
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "تم تأكيد الطلب بنجاح!",
        description: `رقم الطلب: ${data.id}. سنتواصل معك قريباً.`,
      });
      clearCart();
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "فشل في إنشاء الطلب",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast({
        title: "سلة التسوق فارغة",
        description: "يرجى إضافة منتجات للسلة أولاً",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    const orderData = {
      ...data,
      totalAmount: getTotalPrice().toFixed(2),
      items: JSON.stringify(items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl
      })))
    };

    createOrderMutation.mutate(orderData);
    setIsSubmitting(false);
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(0)} ريال`;
  };

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-4">سلة التسوق فارغة</h1>
          <p className="text-slate-600 mb-8">يرجى إضافة منتجات للسلة قبل المتابعة للدفع</p>
          <Button onClick={() => setLocation("/products")} className="bg-natural-600 hover:bg-natural-700">
            تسوق الآن
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const paymentMethods = [
    {
      id: "cash-on-delivery",
      name: "الدفع عند الاستلام",
      icon: Banknote,
      description: "ادفع عند وصول الطلب"
    },
    {
      id: "credit-card",
      name: "بطاقة ائتمان",
      icon: CreditCard,
      description: "فيزا، ماستركارد، مدى"
    },
    {
      id: "bank-transfer",
      name: "تحويل بنكي",
      icon: Building,
      description: "تحويل مباشر من البنك"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800" data-testid="text-checkout-title">
            إتمام الطلب
          </h1>
          <p className="text-slate-600 mt-2">املأ البيانات المطلوبة لإتمام طلبك</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات العميل</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم الكامل</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="أدخل اسمك الكامل"
                              {...field}
                              data-testid="input-customer-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="example@email.com"
                                {...field}
                                data-testid="input-customer-email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="customerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رقم الهاتف</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="05xxxxxxxx"
                                {...field}
                                data-testid="input-customer-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الشحن</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="shippingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>العنوان</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="أدخل عنوانك بالتفصيل"
                              className="resize-none"
                              {...field}
                              data-testid="input-shipping-address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>المدينة</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="الرياض"
                                {...field}
                                data-testid="input-city"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الرمز البريدي</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="12345"
                                {...field}
                                data-testid="input-postal-code"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>طريقة الدفع</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3"
                              data-testid="radio-payment-method"
                            >
                              {paymentMethods.map((method) => (
                                <div
                                  key={method.id}
                                  className="flex items-center space-x-reverse space-x-3 p-4 border border-slate-300 rounded-lg hover:bg-slate-50"
                                >
                                  <RadioGroupItem value={method.id} id={method.id} />
                                  <Label
                                    htmlFor={method.id}
                                    className="flex items-center cursor-pointer flex-1"
                                  >
                                    <method.icon className="h-5 w-5 text-slate-600 ml-3" />
                                    <div>
                                      <p className="font-medium">{method.name}</p>
                                      <p className="text-sm text-slate-500">{method.description}</p>
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </form>
            </Form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle data-testid="text-order-summary">ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3"
                      data-testid={`order-item-${item.id}`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm" data-testid={`text-item-name-${item.id}`}>
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          الكمية: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold" data-testid={`text-item-total-${item.id}`}>
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Total */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span data-testid="text-subtotal">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الشحن:</span>
                    <span className="text-natural-600">مجاني</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>المجموع الكلي:</span>
                    <span className="text-natural-600" data-testid="text-total">
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-natural-600 hover:bg-natural-700"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isSubmitting || createOrderMutation.isPending}
                  data-testid="button-confirm-order"
                >
                  {isSubmitting || createOrderMutation.isPending ? "جاري المعالجة..." : "تأكيد الطلب"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
