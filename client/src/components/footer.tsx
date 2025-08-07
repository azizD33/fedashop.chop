import { Link } from "wouter";
import { Facebook, Twitter, Instagram, MessageCircle, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-natural-400 mb-4">فيدا شوب</h3>
            <p className="text-slate-300 mb-4">
              متجرك الموثوق للمنتجات الطبيعية والعضوية عالية الجودة
            </p>
            <div className="flex space-x-reverse space-x-4">
              <Link href="#" className="text-slate-400 hover:text-natural-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-natural-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-natural-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-natural-400 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-slate-300 hover:text-natural-400 transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-slate-300 hover:text-natural-400 transition-colors">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-300 hover:text-natural-400 transition-colors">
                  العروض
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-300 hover:text-natural-400 transition-colors">
                  المدونة
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-300 hover:text-natural-400 transition-colors">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">خدمة العملاء</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-slate-300 hover:text-natural-400 transition-colors">
                  سياسة الإرجاع
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-300 hover:text-natural-400 transition-colors">
                  الشحن والتوصيل
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-300 hover:text-natural-400 transition-colors">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-300 hover:text-natural-400 transition-colors">
                  دليل المقاسات
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-300 hover:text-natural-400 transition-colors">
                  الدعم الفني
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">معلومات التواصل</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="text-natural-400 ml-3 h-4 w-4" />
                <span className="text-slate-300">الرياض، المملكة العربية السعودية</span>
              </div>
              <div className="flex items-center">
                <Phone className="text-natural-400 ml-3 h-4 w-4" />
                <span className="text-slate-300" dir="ltr">+966 50 123 4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="text-natural-400 ml-3 h-4 w-4" />
                <span className="text-slate-300">info@fedashop.shop</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400">&copy; 2024 فيدا شوب. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
