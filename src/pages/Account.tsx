import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { STONES_CATALOG } from "@/data/products";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";
import func2url from "../../backend/func2url.json";

const CLASP_LABELS: Record<string, string> = {
  elastic: "Резинка",
  lobster: "Карабин",
  magnetic: "Магнит",
  toggle: "Тоггл",
};

type Tab = "designs" | "orders";

interface CartOrder {
  id: number;
  name: string;
  phone: string;
  comment: string;
  items: { name: string; quantity: number; price: number }[];
  total_price: number;
  status: string;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  new:       { label: "Новый",       className: "bg-blue-100 text-blue-700" },
  confirmed: { label: "Подтверждён", className: "bg-green-100 text-green-700" },
  cancelled: { label: "Отменён",     className: "bg-red-100 text-red-600" },
};

export default function Account() {
  const { savedDesigns, deleteDesign } = useCart();
  const [tab, setTab] = useState<Tab>("designs");
  const [orders, setOrders] = useState<CartOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (tab !== "orders") return;
    setOrdersLoading(true);
    fetch(func2url["cart-order"])
      .then(r => r.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Не удалось загрузить заказы"))
      .finally(() => setOrdersLoading(false));
  }, [tab]);

  const handleShare = (designId: string) => {
    const design = savedDesigns.find(d => d.id === designId);
    if (!design) return;
    const params = new URLSearchParams({
      stones: design.stones.join(","),
      size: design.size.toString(),
      clasp: design.clasp,
      name: design.name,
    });
    const link = `${window.location.origin}/constructor?${params}`;
    navigator.clipboard.writeText(link);
    toast.success("Ссылка скопирована!");
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-5xl font-display font-light text-foreground mb-2">Личный кабинет</h1>
        <div className="section-divider mx-0 mb-4" />
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Сайдбар */}
        <div className="md:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex flex-col items-center text-center mb-5 pb-5 border-b border-border">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-3">
                <Icon name="User" size={28} className="text-muted-foreground" />
              </div>
              <p className="font-body text-sm text-muted-foreground">Гость</p>
              <p className="font-body text-xs text-muted-foreground/60 mt-0.5">Войдите, чтобы сохранить данные</p>
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => setTab("designs")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body transition-colors text-left ${
                  tab === "designs"
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon name="Bookmark" size={16} />
                Мои дизайны
              </button>
              <button
                onClick={() => setTab("orders")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body transition-colors text-left ${
                  tab === "orders"
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon name="Package" size={16} />
                Мои заказы
              </button>
              {[
                { icon: "Heart", label: "Избранное" },
                { icon: "Settings", label: "Настройки" },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => toast.info("Раздел в разработке")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body transition-colors text-left text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <Icon name={item.icon as "Heart" | "Settings"} size={16} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Контент */}
        <div className="md:col-span-3">

          {/* Мои дизайны */}
          {tab === "designs" && (
            <>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-3xl font-display font-light text-foreground">Мои дизайны</h2>
                <Link
                  to="/constructor"
                  className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-body hover:opacity-90 transition-opacity"
                >
                  <Icon name="Plus" size={16} />
                  Создать
                </Link>
              </div>

              {savedDesigns.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-12 text-center">
                  <Icon name="Bookmark" size={40} className="mx-auto mb-4 text-muted-foreground opacity-40" />
                  <h3 className="font-display text-2xl text-foreground mb-3">Нет сохранённых дизайнов</h3>
                  <p className="text-muted-foreground font-body mb-5">Создайте свой уникальный браслет в конструкторе и сохраните его здесь</p>
                  <Link
                    to="/constructor"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-body hover:opacity-90 transition-opacity"
                  >
                    <Icon name="Sparkles" size={16} />
                    Открыть конструктор
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-5">
                  {savedDesigns.map(design => (
                    <div key={design.id} className="bg-card border border-border rounded-2xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-display text-xl text-foreground leading-tight">{design.name}</h3>
                          <p className="text-xs font-body text-muted-foreground mt-0.5">
                            {new Date(design.createdAt).toLocaleDateString("ru-RU")}
                          </p>
                        </div>
                        <button
                          onClick={() => { deleteDesign(design.id); toast.success("Дизайн удалён"); }}
                          className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {design.stones.map((stoneId, idx) => {
                          const stone = STONES_CATALOG.find(s => s.id === stoneId);
                          return (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                              style={{ backgroundColor: stone?.color || "#aaa" }}
                              title={stone?.name}
                            />
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs font-body text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Icon name="Ruler" size={12} />
                          {design.size} см
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Link" size={12} />
                          {CLASP_LABELS[design.clasp]}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Gem" size={12} />
                          {design.stones.length} камней
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xl font-display text-foreground">{design.price.toLocaleString()} ₽</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleShare(design.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-full text-xs font-body text-foreground hover:bg-secondary transition-colors"
                          >
                            <Icon name="Share2" size={12} />
                            Поделиться
                          </button>
                          <button
                            onClick={() => toast.info("Оформление заказа — в разработке")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-body hover:opacity-90 transition-opacity"
                          >
                            Заказать
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Мои заказы */}
          {tab === "orders" && (
            <>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-3xl font-display font-light text-foreground">Заказы</h2>
              </div>

              {ordersLoading ? (
                <div className="flex justify-center py-20">
                  <Icon name="Loader2" size={32} className="animate-spin text-muted-foreground" />
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-12 text-center">
                  <Icon name="Package" size={40} className="mx-auto mb-4 text-muted-foreground opacity-40" />
                  <h3 className="font-display text-2xl text-foreground mb-3">Нет заказов</h3>
                  <p className="text-muted-foreground font-body mb-5">Здесь появятся заказы после оформления</p>
                  <Link
                    to="/catalog"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-body hover:opacity-90 transition-opacity"
                  >
                    <Icon name="ShoppingBag" size={16} />
                    Перейти в каталог
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-card border border-border rounded-2xl p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-display text-lg text-foreground">Заказ #{order.id}</p>
                            {(() => {
                              const s = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.new;
                              return (
                                <span className={`text-xs font-body px-2 py-0.5 rounded-full ${s.className}`}>
                                  {s.label}
                                </span>
                              );
                            })()}
                          </div>
                          <p className="text-xs font-body text-muted-foreground">
                            {new Date(order.created_at).toLocaleString("ru-RU", {
                              day: "numeric", month: "long", year: "numeric",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <span className="text-xl font-display text-foreground">
                          {order.total_price.toLocaleString()} ₽
                        </span>
                      </div>

                      <div className="space-y-1 mb-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm font-body">
                            <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                            <span className="text-foreground">{(item.price * item.quantity).toLocaleString()} ₽</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-border pt-3 flex flex-wrap gap-4 text-xs font-body text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="User" size={12} />
                          {order.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Phone" size={12} />
                          {order.phone}
                        </span>
                        {order.comment && (
                          <span className="flex items-center gap-1">
                            <Icon name="MessageCircle" size={12} />
                            {order.comment}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </main>
  );
}