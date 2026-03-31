import { useState } from "react";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";
import OrderRequestModal from "@/components/OrderRequestModal";

const REQUEST_IDS = [13, 14, 15, 16, 17];

export default function Catalog() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc">("default");
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  const filtered = PRODUCTS
    .filter(p => activeCategory === "all" || p.category === activeCategory)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.stones.some(s => s.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return 0;
    });

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-5xl font-display font-light text-foreground mb-2">Каталог украшений</h1>
        <div className="section-divider mx-0 mb-4" />
        <p className="text-muted-foreground font-body">Браслеты, ожерелья, серьги и кольца из натуральных камней</p>
      </div>

      {/* Фильтры */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск по названию или камню..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-full text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-body whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2.5 bg-card border border-border rounded-full text-sm font-body text-foreground focus:outline-none focus:border-primary"
        >
          <option value="default">По умолчанию</option>
          <option value="price_asc">Цена: по возрастанию</option>
          <option value="price_desc">Цена: по убыванию</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground font-body">
          <Icon name="SearchX" size={40} className="mx-auto mb-3 opacity-40" />
          <p>Ничего не найдено. Попробуйте другой запрос.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground font-body mb-5">{filtered.length} украшений</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map(product => {
              const isRequestOnly = REQUEST_IDS.includes(product.id);
              return (
                <div key={product.id} className="product-card bg-card rounded-2xl overflow-hidden border border-border">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.badge && (
                      <span className="absolute top-2 left-2 stone-badge bg-primary text-primary-foreground text-[10px]">
                        {product.badge}
                      </span>
                    )}
                    {isRequestOnly && (
                      <span className="absolute top-2 right-2 stone-badge bg-background/90 text-foreground text-[10px]">
                        По запросу
                      </span>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <span className="stone-badge bg-muted text-muted-foreground">Нет в наличии</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg leading-tight mb-1 text-foreground">{product.name}</h3>
                    {product.category !== "certificate" && (
                      <p className="text-xs text-muted-foreground font-body mb-2">{product.stones.join(" • ")}</p>
                    )}
                    <p className="text-xs text-muted-foreground font-body leading-relaxed mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-display font-medium text-foreground">{product.price.toLocaleString()} ₽</span>
                      {isRequestOnly ? (
                        <button
                          onClick={() => setModalProduct(product)}
                          className="px-4 py-2 rounded-full text-xs font-body bg-secondary text-foreground hover:bg-secondary/70 transition-colors border border-border"
                        >
                          Оформить
                        </button>
                      ) : (
                        <button
                          onClick={() => { if (product.inStock) { addToCart(product); toast.success("Добавлено в корзину"); } }}
                          disabled={!product.inStock}
                          className={`px-4 py-2 rounded-full text-xs font-body transition-opacity ${
                            product.inStock
                              ? "bg-primary text-primary-foreground hover:opacity-90"
                              : "bg-muted text-muted-foreground cursor-not-allowed"
                          }`}
                        >
                          {product.inStock ? "В корзину" : "Нет"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <OrderRequestModal
        product={modalProduct}
        open={!!modalProduct}
        onClose={() => setModalProduct(null)}
      />
    </main>
  );
}