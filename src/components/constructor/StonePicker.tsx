import { STONES_CATALOG } from "@/data/products";
import StoneGem from "@/components/StoneGem";

const SIZES = [15, 16, 17, 18, 19, 20, 21];

const CLASP_TYPES = [
  { id: "elastic", label: "Резинка", price: 100 },
  { id: "lobster", label: "Карабин", price: 400 },
  { id: "magnetic", label: "Магнит", price: 400 },
  { id: "toggle", label: "Тоггл", price: 400 },
];

const CHARM_TYPES = [
  { id: "none",   label: "Без подвески", emoji: "✕",  price: 0 },
  { id: "heart",  label: "Сердце",       emoji: "🤍", price: 150 },
  { id: "star",   label: "Звезда",       emoji: "⭐", price: 150 },
  { id: "moon",   label: "Месяц",        emoji: "🌙", price: 150 },
  { id: "tree",   label: "Дерево",       emoji: "🌳", price: 200 },
  { id: "lotus",  label: "Лотос",        emoji: "🪷", price: 200 },
  { id: "sun",    label: "Солнце",       emoji: "☀️", price: 150 },
  { id: "sea",    label: "Морская",      emoji: "🐚", price: 200 },
];

export { CLASP_TYPES, CHARM_TYPES };

interface StonePickerProps {
  braceletSize: number;
  clasp: string;
  charm: string;
  onAddStone: (id: string) => void;
  onSizeChange: (size: number) => void;
  onClaspChange: (id: string) => void;
  onCharmChange: (id: string) => void;
}

export default function StonePicker({
  braceletSize,
  clasp,
  charm,
  onAddStone,
  onSizeChange,
  onClaspChange,
  onCharmChange,
}: StonePickerProps) {
  return (
    <>
      {/* Выбор камней */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-display text-xl mb-4 text-foreground">Выбор камней</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {STONES_CATALOG.map(stone => (
            <button
              key={stone.id}
              onClick={() => onAddStone(stone.id)}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-secondary/40 transition-all text-left group"
            >
              <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
                <StoneGem stoneId={stone.id} size={32} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-body font-medium text-foreground truncate">{stone.name}</p>
                <p className="text-[10px] font-body text-primary font-medium">{stone.price} ₽/шт</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Размер и застёжка */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-display text-xl mb-4 text-foreground">Размер браслета</h2>
          <div className="flex flex-wrap gap-2">
            {SIZES.map(size => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`w-12 h-12 rounded-full text-sm font-body font-medium transition-colors ${
                  braceletSize === size
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/70"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground font-body mt-3">Обхват запястья в сантиметрах</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-display text-xl mb-4 text-foreground">Тип застёжки</h2>
          <div className="grid grid-cols-2 gap-2">
            {CLASP_TYPES.map(c => (
              <button
                key={c.id}
                onClick={() => onClaspChange(c.id)}
                className={`py-2.5 px-3 rounded-xl text-sm font-body transition-colors flex flex-col items-center gap-0.5 ${
                  clasp === c.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/70"
                }`}
              >
                <span>{c.label}</span>
                <span className={`text-[11px] font-medium ${clasp === c.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{c.price} ₽</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-display text-xl mb-4 text-foreground">Подвеска</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CHARM_TYPES.map(c => (
              <button
                key={c.id}
                onClick={() => onCharmChange(c.id)}
                className={`py-2.5 px-3 rounded-xl text-sm font-body transition-colors flex flex-col items-center gap-1 ${
                  charm === c.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/70"
                }`}
              >
                <span className="text-xl leading-none">{c.emoji}</span>
                <span className="text-xs">{c.label}</span>
                <span className={`text-[11px] font-medium ${charm === c.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {c.price > 0 ? `+${c.price} ₽` : "бесплатно"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
