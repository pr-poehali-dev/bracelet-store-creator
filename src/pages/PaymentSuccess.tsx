import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      <div
        className="text-center max-w-md mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="CheckCircle" size={48} className="text-primary" />
          </div>
          <div
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            style={{
              animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
              opacity: visible ? 1 : 0,
            }}
          />
        </div>

        <h1 className="text-4xl font-display font-light text-foreground mb-3">
          Оплата прошла!
        </h1>
        <div className="section-divider mx-auto mb-4" />

        <p className="text-muted-foreground font-body text-base leading-relaxed mb-2">
          Спасибо за ваш заказ. Мастер уже получила уведомление
          и свяжется с вами в ближайшее время.
        </p>

        {orderId && (
          <p className="text-sm text-muted-foreground font-body mb-8">
            Номер заказа: <span className="text-foreground font-medium">#{orderId}</span>
          </p>
        )}

        <div className="p-5 bg-secondary/40 rounded-2xl border border-border mb-8 text-left space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name="Package" size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-body font-medium text-foreground">Подготовка заказа</p>
              <p className="text-xs text-muted-foreground font-body">Мастер приступит к изготовлению в ближайшие дни</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name="Phone" size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-body font-medium text-foreground">Мы свяжемся с вами</p>
              <p className="text-xs text-muted-foreground font-body">Для уточнения деталей доставки</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name="Heart" size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-body font-medium text-foreground">Сделано с душой</p>
              <p className="text-xs text-muted-foreground font-body">Каждое украшение — уникальная работа мастера</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/catalog"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-sm font-body font-medium hover:opacity-90 transition-opacity"
          >
            Продолжить покупки
          </Link>
          <Link
            to="/"
            className="px-8 py-3 bg-secondary text-foreground rounded-full text-sm font-body hover:bg-secondary/70 transition-colors"
          >
            На главную
          </Link>
        </div>
      </div>
    </main>
  );
}
