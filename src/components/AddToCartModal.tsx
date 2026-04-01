import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";
import type { Product } from "@/data/products";
import func2url from "../../backend/func2url.json";

interface Props {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (product: Product, name: string, phone: string) => void;
}

export default function AddToCartModal({ product, open, onClose, onConfirm }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setName("");
    setPhone("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Заполните имя и телефон");
      return;
    }
    if (!product) return;

    setLoading(true);
    try {
      await fetch(func2url["add-to-cart-notify"], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          product_name: product.name,
          product_price: product.price,
        }),
      });
    } catch {
      // не блокируем пользователя при ошибке сети
    } finally {
      setLoading(false);
    }

    onConfirm(product, name.trim(), phone.trim());
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display font-light text-2xl text-foreground">
            Добавить в корзину
          </DialogTitle>
        </DialogHeader>

        {product && (
          <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl mb-1">
            <img
              src={product.image}
              alt={product.name}
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="font-display text-sm text-foreground leading-snug">{product.name}</p>
              <p className="text-primary font-body font-medium text-sm mt-0.5">
                {product.price.toLocaleString()} ₽
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <p className="text-xs text-muted-foreground font-body">
            Оставьте контакты — мастер свяжется с вами для подтверждения заказа
          </p>

          <div>
            <label className="block text-sm font-body text-foreground mb-1">Ваше имя *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Как к вам обращаться?"
              autoFocus
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-full text-sm font-body font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Icon name="Loader2" size={16} className="animate-spin" /> Добавляем...</>
            ) : (
              <><Icon name="ShoppingCart" size={16} /> В корзину</>
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
