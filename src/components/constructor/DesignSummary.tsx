import Icon from "@/components/ui/icon";
import { STONES_CATALOG } from "@/data/products";
import { CHARM_TYPES } from "./StonePicker";

interface DesignSummaryProps {
  selectedStones: string[];
  basePrice: number;
  stonesPrice: number;
  charmPrice: number;
  charm: string;
  totalPrice: number;
  designName: string;
  shareLink: string | null;
  onDesignNameChange: (name: string) => void;
  onAddToCart: () => void;
  onSave: () => void;
  onShare: () => void;
  onClear: () => void;
}

export default function DesignSummary({
  selectedStones,
  basePrice,
  stonesPrice,
  charmPrice,
  charm,
  totalPrice,
  designName,
  shareLink,
  onDesignNameChange,
  onAddToCart,
  onSave,
  onShare,
  onClear,
}: DesignSummaryProps) {
  const stoneDetails = (id: string) => STONES_CATALOG.find(s => s.id === id);

  return (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-2xl p-6 sticky top-20">
        <h2 className="font-display text-xl mb-4 text-foreground">Ваш браслет</h2>

        <div className="space-y-3 mb-5">
          <div className="flex justify-between text-sm font-body">
            <span className="text-muted-foreground">Основа</span>
            <span className="text-foreground">{basePrice.toLocaleString()} ₽</span>
          </div>
          {selectedStones.length > 0 && (
            <div className="flex justify-between text-sm font-body">
              <span className="text-muted-foreground">{selectedStones.length} камней</span>
              <span className="text-foreground">{stonesPrice.toLocaleString()} ₽</span>
            </div>
          )}
          {charmPrice > 0 && (
            <div className="flex justify-between text-sm font-body">
              <span className="text-muted-foreground">Подвеска «{CHARM_TYPES.find(c => c.id === charm)?.label}»</span>
              <span className="text-foreground">+{charmPrice} ₽</span>
            </div>
          )}
          <div className="border-t border-border pt-3 flex justify-between font-body font-medium">
            <span className="text-foreground">Итого</span>
            <span className="text-xl font-display text-foreground">{totalPrice.toLocaleString()} ₽</span>
          </div>
        </div>

        {selectedStones.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-body text-muted-foreground mb-2">Состав:</p>
            <div className="flex flex-wrap gap-1.5">
              {[...new Set(selectedStones)].map(id => {
                const s = stoneDetails(id);
                const count = selectedStones.filter(sid => sid === id).length;
                return (
                  <span key={id} className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-xs font-body">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s?.color }} />
                    {s?.name} {count > 1 ? `×${count}` : ""}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Название дизайна (необязательно)"
            value={designName}
            onChange={e => onDesignNameChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm font-body focus:outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <button
            onClick={onAddToCart}
            disabled={selectedStones.length === 0}
            className="w-full py-3 bg-primary text-primary-foreground rounded-full text-sm font-body font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Icon name="ShoppingCart" size={16} />
            Отправить дизайн в корзину
          </button>
          <button
            onClick={onSave}
            className="w-full py-3 border border-border text-foreground rounded-full text-sm font-body font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="BookmarkPlus" size={16} />
            Сохранить дизайн
          </button>
          <button
            onClick={onShare}
            disabled={selectedStones.length === 0}
            className="w-full py-3 border border-border text-foreground rounded-full text-sm font-body hover:bg-secondary transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Icon name="Share2" size={16} />
            Поделиться дизайном
          </button>
          <button
            onClick={onClear}
            disabled={selectedStones.length === 0}
            className="w-full py-2.5 text-muted-foreground text-sm font-body hover:text-foreground transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <Icon name="Trash2" size={14} />
            Очистить
          </button>
        </div>

        {shareLink && (
          <div className="mt-4 p-3 bg-secondary rounded-xl">
            <p className="text-xs font-body text-muted-foreground mb-1">Ссылка скопирована:</p>
            <p className="text-xs font-body text-foreground break-all">{shareLink}</p>
          </div>
        )}
      </div>
    </div>
  );
}
