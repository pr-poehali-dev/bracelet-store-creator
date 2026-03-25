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
}

const AMULET_IDS = [13, 14, 15, 16, 17];

export default function OrderRequestModal({ product, open, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [requestText, setRequestText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const needsBirthDate = product?.id === 17;
  const isAmulet = product ? AMULET_IDS.includes(product.id) : false;

  const handleClose = () => {
    setName(""); setPhone(""); setBirthDate(""); setRequestText("");
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
      const res = await fetch(func2url["order-request"], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: product?.name ?? "",
          product_id: product?.id ?? 0,
          name: name.trim(),
          phone: phone.trim(),
          birth_date: birthDate.trim(),
          request_text: requestText.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && (data.ok || typeof data === "object")) {
        setSent(true);
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
            {sent ? "Заявка принята!" : "Оформить по запросу"}
          </DialogTitle>
        </DialogHeader>

        {sent ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={32} className="text-primary" />
            </div>
            <p className="text-foreground font-body mb-2">Мастер свяжется с тобой в течение дня</p>
            <p className="text-muted-foreground text-sm font-body mb-6">
              Обсудим детали, подберём камни и назначим сроки изготовления
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
            {product && (
              <div className="p-3 bg-secondary/40 rounded-xl flex items-center gap-3">
                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <p className="text-sm font-display text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground font-body">{product.price.toLocaleString()} ₽</p>
                </div>
              </div>
            )}

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

            {(needsBirthDate || isAmulet) && (
              <div>
                <label className="block text-sm font-body text-foreground mb-1">
                  Дата рождения {needsBirthDate ? "*" : "(по желанию)"}
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-body text-foreground focus:outline-none focus:border-primary"
                  required={needsBirthDate}
                />
                <p className="text-xs text-muted-foreground font-body mt-1">
                  {needsBirthDate
                    ? "Нужна для подбора камней по чакрам"
                    : "Поможет мастеру точнее подобрать камни"}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-body text-foreground mb-1">Ваш запрос</label>
              <textarea
                value={requestText}
                onChange={e => setRequestText(e.target.value)}
                placeholder={
                  product?.id === 13
                    ? "Например: хочу усилить доход, открываю своё дело..."
                    : product?.id === 14
                    ? "Например: ищу партнёра, хочу укрепить отношения..."
                    : product?.id === 15
                    ? "Например: важные переговоры, преодолеваю страхи..."
                    : product?.id === 16
                    ? "Например: чувствую негатив, хочу защиту для семьи..."
                    : "Расскажите о своём запросе или пожеланиях..."
                }
                rows={3}
                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-full text-sm font-body hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Icon name="Loader2" size={16} className="animate-spin" /> Отправляем...</>
              ) : (
                <><Icon name="Send" size={16} /> Отправить заявку</>
              )}
            </button>

            <p className="text-xs text-center text-muted-foreground font-body">
              Мастер свяжется с вами в течение дня для обсуждения деталей
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
