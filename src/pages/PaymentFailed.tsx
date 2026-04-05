import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function PaymentFailed() {
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
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-muted flex items-center justify-center">
          <Icon name="XCircle" size={48} className="text-muted-foreground" />
        </div>

        <h1 className="text-4xl font-display font-light text-foreground mb-3">
          Оплата не прошла
        </h1>
        <div className="section-divider mx-auto mb-4" />

        <p className="text-muted-foreground font-body text-base leading-relaxed mb-2">
          Что-то пошло не так. Заказ сохранён — вы можете попробовать оплатить снова или связаться с нами.
        </p>

        {orderId && (
          <p className="text-sm text-muted-foreground font-body mb-8">
            Номер заказа: <span className="text-foreground font-medium">#{orderId}</span>
          </p>
        )}

        <div className="p-5 bg-secondary/40 rounded-2xl border border-border mb-8 text-left space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name="RefreshCw" size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-body font-medium text-foreground">Попробуйте ещё раз</p>
              <p className="text-xs text-muted-foreground font-body">Вернитесь в корзину и повторите оплату</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name="MessageCircle" size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-body font-medium text-foreground">Свяжитесь с мастером</p>
              <p className="text-xs text-muted-foreground font-body">Поможем оформить заказ другим способом</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/cart"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-sm font-body font-medium hover:opacity-90 transition-opacity"
          >
            Вернуться в корзину
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
