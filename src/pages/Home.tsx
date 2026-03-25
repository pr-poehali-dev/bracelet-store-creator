import { Link } from "react-router-dom";
import { PRODUCTS, STONES_CATALOG } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

const HERO_IMG = "https://cdn.poehali.dev/projects/c1d32ac7-1d0a-4ede-9952-f86391eda1c4/files/d6e8dc2c-c80c-4cd1-a2b2-cc5547019fa0.jpg";
const FEATURED = PRODUCTS.filter(p => p.badge === "Хит");

const BENEFITS = [
  { icon: "Gem", title: "Натуральные камни", text: "Только сертифицированные природные минералы без синтетики" },
  { icon: "Hand", title: "Ручная работа", text: "Каждое украшение создаётся мастером индивидуально" },
  { icon: "RefreshCw", title: "Возврат 14 дней", text: "Если украшение не подошло — вернём деньги без вопросов" },
  { icon: "Truck", title: "Доставка по России", text: "Отправляем Почтой России и СДЭК в любой город" },
];

const REVIEWS_PREVIEW = [
  { name: "Анна К.", text: "Браслет из аметиста просто волшебный! Камни красивые, нитка крепкая, пришёл быстро.", rating: 5 },
  { name: "Мария Л.", text: "Заказала конструктор для подруги на день рождения — она в восторге! Уникальный подарок.", rating: 5 },
  { name: "Ольга В.", text: "Покупаю уже третий браслет. Качество на высоте, энергетика камней чувствуется.", rating: 5 },
];

export default function Home() {
  const { addToCart } = useCart();

  return (
    <main>
      {/* Hero */}
      <section className="hero-section relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <span className="stone-badge bg-secondary text-foreground/70 mb-4 inline-flex">
                ✦ Украшения из натуральных камней
              </span>
              <h1 className="text-5xl md:text-6xl font-display font-light text-foreground leading-tight mb-6">
                Сила земли<br />
                <em>в твоих руках</em>
              </h1>
              <p className="text-muted-foreground font-body text-lg leading-relaxed mb-8 max-w-md">
                Браслеты, ожерелья и серьги из натуральных камней. Создай своё уникальное украшение в нашем конструкторе или выбери из коллекции.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/catalog"
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-body text-sm tracking-wide hover:opacity-90 transition-opacity"
                >
                  Смотреть каталог
                </Link>
                <Link
                  to="/constructor"
                  className="px-8 py-3 border border-border text-foreground rounded-full font-body text-sm tracking-wide hover:bg-secondary transition-colors"
                >
                  Создать своё
                </Link>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-transparent rounded-3xl" />
                <img
                  src={HERO_IMG}
                  alt="Украшения из натуральных камней"
                  className="w-full h-80 md:h-[480px] object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-background/80 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1">
                      {STONES_CATALOG.slice(0, 6).map(s => (
                        <div
                          key={s.id}
                          className="w-6 h-6 rounded-full border-2 border-background"
                          style={{ backgroundColor: s.color }}
                          title={s.name}
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-body font-medium text-foreground">16+ видов камней</p>
                      <p className="text-xs font-body text-muted-foreground">для вашего браслета</p>
                    </div>
                    <Link
                      to="/constructor"
                      className="ml-auto px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-body"
                    >
                      Создать
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {BENEFITS.map(b => (
              <div key={b.title} className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon name={b.icon} size={22} className="text-primary" />
                </div>
                <h3 className="font-display text-base font-medium mb-1 text-foreground">{b.title}</h3>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Хиты продаж */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-display font-light text-foreground">Хиты коллекции</h2>
            <div className="section-divider" />
            <p className="text-muted-foreground font-body">Самые любимые украшения наших покупательниц</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED.map(product => (
              <div key={product.id} className="product-card bg-card rounded-2xl overflow-hidden border border-border">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 stone-badge bg-primary text-primary-foreground">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl mb-1 text-foreground">{product.name}</h3>
                  <p className="text-xs text-muted-foreground font-body mb-3">{product.stones.join(" • ")}</p>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-display font-medium text-foreground">{product.price.toLocaleString()} ₽</span>
                    <button
                      onClick={() => { addToCart(product); toast.success("Добавлено в корзину"); }}
                      className="px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-body hover:opacity-90 transition-opacity"
                    >
                      В корзину
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-8 py-3 border border-border rounded-full text-sm font-body text-foreground hover:bg-secondary transition-colors"
            >
              Весь каталог <Icon name="ArrowRight" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Конструктор — баннер */}
      <section className="py-16 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, hsl(25, 35%, 55%) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(15, 60%, 62%) 0%, transparent 50%)"
          }} />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="stone-badge bg-background/10 text-background/80 mb-4 inline-flex">
                ✦ Уникальное украшение
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-light text-background leading-tight mb-4">
                Создай браслет<br /><em>своей мечты</em>
              </h2>
              <p className="text-background/70 font-body leading-relaxed mb-6">
                В нашем конструкторе ты выбираешь каждый камень, размер, застёжку и сохраняешь дизайн в своём профиле. Можно поделиться с подругой или заказать в подарок.
              </p>
              <Link
                to="/constructor"
                className="inline-flex items-center gap-2 px-8 py-3 bg-background text-foreground rounded-full text-sm font-body hover:opacity-90 transition-opacity"
              >
                Открыть конструктор <Icon name="Sparkles" size={16} />
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {["Выбираешь до 20 камней из 16+ видов", "Настраиваешь размер и тип застёжки", "Сохраняешь и делишься дизайном", "Заказываешь — мастер соберёт за 2-3 дня"].map((step, i) => (
                <div key={i} className="flex items-center gap-3 bg-background/5 rounded-xl px-5 py-3">
                  <span className="w-8 h-8 rounded-full bg-background/15 text-background text-sm font-body font-medium flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-background/80 font-body text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Свечи */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <img
                src="https://cdn.poehali.dev/projects/c1d32ac7-1d0a-4ede-9952-f86391eda1c4/files/67fefeb8-313c-44c6-8a41-46700271bb2a.jpg"
                alt="Свечи из пчелиного воска"
                className="w-full h-72 object-cover rounded-3xl shadow-xl"
              />
            </div>
            <div>
              <span className="stone-badge bg-secondary text-foreground/70 mb-4 inline-flex">
                🕯 Свечи из пчелиного воска
              </span>
              <h2 className="text-4xl font-display font-light text-foreground leading-tight mb-4">
                Уют, тепло<br /><em>и возможность выдохнуть</em>
              </h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-6">
                Каждая свеча сделана из чистого пчелиного воска вручную. Горит долго, пахнет мёдом и создаёт атмосферу тишины — для тех, кто ценит моменты покоя.
              </p>
              <Link
                to="/catalog?category=candle"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full text-sm font-body hover:opacity-90 transition-opacity"
              >
                Смотреть свечи <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Камни */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-display font-light text-foreground">Наши камни</h2>
            <div className="section-divider" />
            <p className="text-muted-foreground font-body">Каждый камень несёт особую энергию и значение</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STONES_CATALOG.slice(0, 8).map(stone => (
              <div key={stone.id} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors">
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0 shadow-md"
                  style={{ backgroundColor: stone.color }}
                />
                <div>
                  <p className="font-body text-sm font-medium text-foreground">{stone.name}</p>
                  <p className="font-body text-xs text-muted-foreground leading-snug">{stone.meaning.split(",")[0]}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/constructor" className="text-sm font-body text-primary hover:underline inline-flex items-center gap-1">
              Все 16+ камней в конструкторе <Icon name="ChevronRight" size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-display font-light text-foreground">Отзывы покупательниц</h2>
            <div className="section-divider" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS_PREVIEW.map((r, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Icon key={j} name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="font-body text-sm text-foreground/80 leading-relaxed mb-4">«{r.text}»</p>
                <p className="font-body text-xs text-muted-foreground font-medium">{r.name}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/reviews" className="inline-flex items-center gap-2 text-sm font-body text-primary hover:underline">
              Все отзывы <Icon name="ArrowRight" size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}