import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";
import type { CartItem, CustomDesign } from "@/context/CartContext";
import func2url from "../../backend/func2url.json";

interface Props {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  cartDesigns: CustomDesign[];
  totalPrice: number;
  onSuccess: () => void;
}

export default function CartOrderModal({ open, onClose, items, cartDesigns, totalPrice, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleClose = () => {
    setName(""); setPhone(""); setEmail(""); setComment("");
    setSent(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Заполните имя и телефон");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(func2url["cart-order"], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          comment: comment.trim(),
          items: items.map(({ product, quantity }) => ({
            name: product.name,
            quantity,
            price: product.price,
          })),
          custom_designs: cartDesigns.map(d => ({
            name: d.name,
            stones_count: d.stones.length,
            size: d.size,
            clasp: d.clasp,
            price: d.price,
          })),
          total_price: totalPrice,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSent(true);
        onSuccess();
      } else {
        toast.error(data.error || "Ошибка при отправке");
      }
    } catch {
      toast.error("Нет связи с сервером");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display font-light text-2xl text-foreground">
            {sent ? "Заказ принят!" : "Оформить заказ"}
          </DialogTitle>
        </DialogHeader>

        {sent ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={32} className="text-primary" />
            </div>
            <p className="text-foreground font-body mb-2">Мастер свяжется с тобой в течение дня</p>
            <p className="text-muted-foreground text-sm font-body mb-6">
              Обсудим доставку и удобный способ оплаты
            </p>
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-sm font-body hover:opacity-90 transition-opacity"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="p-3 bg-secondary/40 rounded-xl space-y-1.5 max-h-48 overflow-y-auto">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground truncate mr-2">{product.name} × {quantity}</span>
                  <span className="text-foreground whitespace-nowrap">{(product.price * quantity).toLocaleString()} ₽</span>
                </div>
              ))}
              {cartDesigns.map(d => (
                <div key={d.id} className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground truncate mr-2">✦ {d.name} ({d.stones.length} камней, {d.size} см)</span>
                  <span className="text-foreground whitespace-nowrap">{d.price.toLocaleString()} ₽</span>
                </div>
              ))}
              <div className="border-t border-border pt-1.5 flex justify-between font-body">
                <span className="text-foreground font-medium text-sm">Итого</span>
                <span className="text-foreground font-medium text-sm">{totalPrice.toLocaleString()} ₽</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-body text-foreground mb-1">Ваше имя *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Как к вам обращаться?"
                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-body text-foreground mb-1">Телефон *</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+7 (___) ___-__-__"
                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-body text-foreground mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="для подтверждения заказа"
                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-body text-foreground mb-1">Комментарий</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Пожелания по доставке, упаковке или что-то важное..."
                rows={2}
                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-full text-sm font-body font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Icon name="Loader2" size={16} className="animate-spin" /> Отправляем...</>
              ) : (
                <><Icon name="ShoppingBag" size={16} /> Подтвердить заказ</>
              )}
            </button>

            <p className="text-xs text-center text-muted-foreground font-body">
              Мастер свяжется с вами в течение дня для подтверждения и оплаты
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}