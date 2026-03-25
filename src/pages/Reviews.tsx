import { useState } from "react";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

interface Review {
  id: number;
  name: string;
  rating: number;
  product: string;
  text: string;
  date: string;
  avatar: string;
}

const INITIAL_REVIEWS: Review[] = [
  { id: 1, name: "Анна К.", rating: 5, product: "Браслет «Аметистовый туман»", text: "Просто влюбилась в этот браслет! Камни переливаются так красиво, нитка крепкая, застёжка удобная. Пришёл быстро, упакован бережно. Уже заказала второй!", date: "15.11.2024", avatar: "А" },
  { id: 2, name: "Мария Л.", rating: 5, product: "Индивидуальный дизайн", text: "Создала браслет через конструктор для подруги на день рождения. Она была в восторге! Составила из её любимых камней — малахит и цитрин. Уникальный подарок.", date: "08.11.2024", avatar: "М" },
  { id: 3, name: "Ольга В.", rating: 5, product: "Браслет «Тигровый глаз»", text: "Покупаю уже третий браслет в этом магазине. Качество на высоте, камни подлинные — проверяла у специалиста. Энергетика действительно ощущается!", date: "01.11.2024", avatar: "О" },
  { id: 4, name: "Екатерина Р.", rating: 5, product: "Ожерелье «Малахит»", text: "Ожерелье невероятно красивое. Малахит насыщенного зелёного цвета, медная оправа добавляет шарм. Получила кучу комплиментов. Спасибо мастерам!", date: "25.10.2024", avatar: "Е" },
  { id: 5, name: "Светлана М.", rating: 4, product: "Серьги «Лабрадорит»", text: "Серьги красивые, переливаются при свете — просто магия. Единственное — хотелось бы чуть длиннее крепление, но это мелочь. Обязательно куплю ещё.", date: "19.10.2024", avatar: "С" },
  { id: 6, name: "Дарья П.", rating: 5, product: "Браслет «Розовый кварц»", text: "Подарила себе на день рождения. Браслет такой нежный и женственный! Камни гладкие, приятные на ощупь. Размер подобрала по таблице — идеально сел.", date: "12.10.2024", avatar: "Д" },
];

const RATING_LABELS = ["", "Плохо", "Неплохо", "Хорошо", "Очень хорошо", "Отлично"];

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [newText, setNewText] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [filterRating, setFilterRating] = useState(0);

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const filtered = filterRating > 0 ? reviews.filter(r => r.rating === filterRating) : reviews;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newText.trim()) {
      toast.error("Заполните имя и текст отзыва");
      return;
    }
    const review: Review = {
      id: Date.now(),
      name: newName.trim(),
      rating: newRating,
      product: newProduct.trim() || "Украшение из каталога",
      text: newText.trim(),
      date: new Date().toLocaleDateString("ru-RU"),
      avatar: newName.trim()[0].toUpperCase(),
    };
    setReviews(prev => [review, ...prev]);
    setNewName(""); setNewProduct(""); setNewText(""); setNewRating(5);
    setShowForm(false);
    toast.success("Спасибо за ваш отзыв!");
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-5xl font-display font-light text-foreground mb-2">Отзывы покупателей</h1>
        <div className="section-divider mx-0 mb-4" />
      </div>

      {/* Рейтинг */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="text-center">
          <p className="text-7xl font-display font-light text-foreground">{avgRating.toFixed(1)}</p>
          <div className="flex gap-1 justify-center my-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Icon key={i} name="Star" size={18} className={i <= Math.round(avgRating) ? "text-yellow-500 fill-yellow-500" : "text-muted"} />
            ))}
          </div>
          <p className="text-sm font-body text-muted-foreground">{reviews.length} отзывов</p>
        </div>
        <div className="flex-1 w-full">
          {[5, 4, 3, 2, 1].map(star => {
            const count = reviews.filter(r => r.rating === star).length;
            const pct = reviews.length ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 mb-2">
                <span className="text-xs font-body text-muted-foreground w-6 text-right">{star}</span>
                <Icon name="Star" size={12} className="text-yellow-500 fill-yellow-500" />
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-body text-muted-foreground w-4">{count}</span>
              </div>
            );
          })}
        </div>
        <div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-body hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Написать отзыв
          </button>
        </div>
      </div>

      {/* Форма отзыва */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="font-display text-2xl mb-5 text-foreground">Оставить отзыв</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-body text-muted-foreground mb-1.5">Ваше имя *</label>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Анна К."
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm font-body focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-body text-muted-foreground mb-1.5">Товар</label>
              <input
                value={newProduct}
                onChange={e => setNewProduct(e.target.value)}
                placeholder="Название украшения"
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm font-body focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-body text-muted-foreground mb-2">Оценка</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setNewRating(i)}
                  className="flex flex-col items-center gap-1"
                >
                  <Icon name="Star" size={28} className={i <= newRating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"} />
                </button>
              ))}
              <span className="ml-2 self-center text-sm font-body text-muted-foreground">{RATING_LABELS[newRating]}</span>
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-xs font-body text-muted-foreground mb-1.5">Текст отзыва *</label>
            <textarea
              value={newText}
              onChange={e => setNewText(e.target.value)}
              rows={4}
              placeholder="Расскажите о вашем опыте..."
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm font-body focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-body hover:opacity-90 transition-opacity">
              Отправить
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-border text-foreground rounded-full text-sm font-body hover:bg-secondary transition-colors">
              Отмена
            </button>
          </div>
        </form>
      )}

      {/* Фильтр */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[0, 5, 4, 3, 2, 1].map(star => (
          <button
            key={star}
            onClick={() => setFilterRating(star)}
            className={`px-4 py-2 rounded-full text-sm font-body whitespace-nowrap transition-colors ${
              filterRating === star ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            {star === 0 ? "Все" : `${star} ★`}
          </button>
        ))}
      </div>

      {/* Список отзывов */}
      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map(review => (
          <div key={review.id} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <span className="font-display text-primary font-medium">{review.avatar}</span>
              </div>
              <div className="flex-1">
                <p className="font-body font-medium text-foreground text-sm">{review.name}</p>
                <p className="text-xs font-body text-muted-foreground">{review.product}</p>
              </div>
              <div className="text-right">
                <div className="flex gap-0.5 mb-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Icon key={i} name="Star" size={12} className={i <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"} />
                  ))}
                </div>
                <p className="text-xs font-body text-muted-foreground">{review.date}</p>
              </div>
            </div>
            <p className="text-sm font-body text-foreground/80 leading-relaxed">«{review.text}»</p>
          </div>
        ))}
      </div>
    </main>
  );
}
