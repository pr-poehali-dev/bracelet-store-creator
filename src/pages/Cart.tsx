import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";
import CartOrderModal from "@/components/CartOrderModal";

export default function Cart() {
  const { items, cartDesigns, removeFromCart, removeDesignFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [orderOpen, setOrderOpen] = useState(false);

  if (items.length === 0 && cartDesigns.length === 0) {
    return (
      <main className="container mx-auto px-4 py-10 text-center">
        <div className="max-w-sm mx-auto py-20">
          <Icon name="ShoppingBag" size={56} className="mx-auto mb-5 text-muted-foreground opacity-40" />
          <h1 className="text-3xl font-display font-light text-foreground mb-3">Корзина пуста</h1>
          <p className="text-muted-foreground font-body mb-6">Перейдите в каталог, чтобы выбрать украшения</p>
          <Link to="/catalog" className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-full text-sm font-body hover:opacity-90 transition-opacity">
            Перейти в каталог
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-display font-light text-foreground mb-1">Корзина</h1>
          <p className="text-muted-foreground font-body">{totalItems} товара</p>
        </div>
        <button
          onClick={() => { clearCart(); toast.success("Корзина очищена"); }}
          className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="Trash2" size={14} /> Очистить
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-start">
              <img src={product.image} alt={product.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg text-foreground leading-tight">{product.name}</h3>
                <p className="text-xs font-body text-muted-foreground mb-3">{product.stones.join(" • ")}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-full overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <Icon name="Minus" size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-body text-foreground">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <Icon name="Plus" size={14} />
                    </button>
                  </div>
                  <span className="text-lg font-display text-foreground ml-auto">
                    {(product.price * quantity).toLocaleString()} ₽
                  </span>
                </div>
              </div>
              <button
                onClick={() => { removeFromCart(product.id); toast.success("Товар удалён"); }}
                className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          ))}

          {cartDesigns.length > 0 && (
            <>
              <h2 className="font-display text-lg text-foreground pt-2">Браслеты из конструктора</h2>
              {cartDesigns.map(design => (
                <div key={design.id} className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-start">
                  <div className="w-20 h-20 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <Icon name="Sparkles" size={28} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg text-foreground leading-tight">{design.name}</h3>
                    <p className="text-xs font-body text-muted-foreground mb-1">{design.stones.length} камней • размер {design.size} см</p>
                    <span className="text-lg font-display text-foreground">{design.price.toLocaleString()} ₽</span>
                  </div>
                  <button
                    onClick={() => { removeDesignFromCart(design.id); toast.success("Дизайн удалён из корзины"); }}
                    className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Итог */}
        <div>
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-20">
            <h2 className="font-display text-2xl mb-5 text-foreground">Итого</h2>
            <div className="space-y-3 mb-5">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground truncate mr-2">{product.name} × {quantity}</span>
                  <span className="text-foreground whitespace-nowrap">{(product.price * quantity).toLocaleString()} ₽</span>
                </div>
              ))}
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-body">
                  <span className="text-foreground font-medium">Товары</span>
                  <span className="text-foreground">{totalPrice.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between font-body text-sm mt-1.5">
                  <span className="text-muted-foreground">Доставка</span>
                  <span className="text-muted-foreground">{totalPrice >= 5000 ? "Бесплатно" : "от 250 ₽"}</span>
                </div>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-display text-xl text-foreground">Итого</span>
                <span className="font-display text-2xl text-foreground">{totalPrice.toLocaleString()} ₽</span>
              </div>
            </div>

            {totalPrice < 5000 && (
              <div className="mb-4 p-3 bg-primary/10 rounded-xl text-xs font-body text-foreground">
                До бесплатной доставки: <strong>{(5000 - totalPrice).toLocaleString()} ₽</strong>
              </div>
            )}

            <button
              onClick={() => setOrderOpen(true)}
              className="w-full py-3 bg-primary text-primary-foreground rounded-full text-sm font-body font-medium hover:opacity-90 transition-opacity mb-3"
            >
              Оформить заказ
            </button>
            <Link
              to="/catalog"
              className="block w-full py-3 border border-border text-center text-foreground rounded-full text-sm font-body hover:bg-secondary transition-colors"
            >
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>

      <CartOrderModal
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        items={items}
        totalPrice={totalPrice}
        onSuccess={() => {
          clearCart();
          toast.success("Заказ оформлен! Мастер скоро свяжется с вами");
        }}
      />
    </main>
  );
}