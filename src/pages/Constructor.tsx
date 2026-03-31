import { useState } from "react";
import { STONES_CATALOG } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { CustomDesign } from "@/context/CartContext";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

const CLASP_TYPES = [
  { id: "elastic", label: "Резинка" },
  { id: "lobster", label: "Карабин" },
  { id: "magnetic", label: "Магнит" },
  { id: "toggle", label: "Тоггл" },
];

const SIZES = [15, 16, 17, 18, 19, 20, 21];

const BASE_PRICE = 800;

export default function Constructor() {
  const { saveDesign, savedDesigns, deleteDesign } = useCart();
  const [selectedStones, setSelectedStones] = useState<string[]>([]);
  const [braceletSize, setBraceletSize] = useState(17);
  const [clasp, setClasp] = useState("elastic");
  const [designName, setDesignName] = useState("");
  const [tab, setTab] = useState<"create" | "saved">("create");
  const [shareLink, setShareLink] = useState<string | null>(null);

  const stonesPrice = selectedStones.reduce((sum, id) => {
    const stone = STONES_CATALOG.find(s => s.id === id);
    return sum + (stone?.price ?? 56);
  }, 0);
  const totalPrice = BASE_PRICE + stonesPrice;

  const addStone = (stoneId: string) => {
    if (selectedStones.length >= 20) {
      toast.error("Максимум 20 камней");
      return;
    }
    setSelectedStones(prev => [...prev, stoneId]);
  };

  const removeLastStone = () => {
    setSelectedStones(prev => prev.slice(0, -1));
  };

  const removeStoneAt = (idx: number) => {
    setSelectedStones(prev => prev.filter((_, i) => i !== idx));
  };

  const clearAll = () => setSelectedStones([]);

  const handleSave = () => {
    if (selectedStones.length === 0) {
      toast.error("Добавьте хотя бы один камень");
      return;
    }
    const name = designName.trim() || `Браслет от ${new Date().toLocaleDateString("ru-RU")}`;
    const design: CustomDesign = {
      id: Date.now().toString(),
      name,
      stones: selectedStones,
      size: braceletSize,
      clasp,
      createdAt: new Date().toISOString(),
      price: totalPrice,
    };
    saveDesign(design);
    toast.success("Дизайн сохранён в личном кабинете!");
  };

  const handleShare = () => {
    const params = new URLSearchParams({
      stones: selectedStones.join(","),
      size: braceletSize.toString(),
      clasp,
      name: designName || "Мой браслет",
    });
    const link = `${window.location.origin}/constructor?${params}`;
    navigator.clipboard.writeText(link).then(() => {
      setShareLink(link);
      toast.success("Ссылка скопирована!");
    });
  };

  const stoneDetails = (id: string) => STONES_CATALOG.find(s => s.id === id);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-5xl font-display font-light text-foreground mb-2">Конструктор браслета</h1>
        <div className="section-divider mx-0 mb-4" />
        <p className="text-muted-foreground font-body">Создай уникальный браслет из натуральных камней</p>
      </div>

      {/* Табы */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab("create")}
          className={`px-6 py-2.5 rounded-full text-sm font-body transition-colors ${tab === "create" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
        >
          Создать украшение
        </button>
        <button
          onClick={() => setTab("saved")}
          className={`px-6 py-2.5 rounded-full text-sm font-body transition-colors flex items-center gap-2 ${tab === "saved" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
        >
          Мои дизайны
          {savedDesigns.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-primary-foreground/20 text-xs flex items-center justify-center">
              {savedDesigns.length}
            </span>
          )}
        </button>
      </div>

      {tab === "create" ? (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Левая колонка — настройки */}
          <div className="lg:col-span-2 space-y-8">
            {/* Предпросмотр браслета */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-display text-xl mb-4 text-foreground">Предпросмотр</h2>
              <div className="relative bg-secondary/30 rounded-xl p-6 min-h-32 flex items-center justify-center overflow-hidden">
                {selectedStones.length === 0 ? (
                  <p className="text-muted-foreground font-body text-sm text-center">
                    Добавляйте камни снизу, чтобы увидеть браслет
                  </p>
                ) : (
                  <div className="bracelet-preview flex-wrap gap-2 max-w-full">
                    {selectedStones.map((stoneId, idx) => {
                      const stone = stoneDetails(stoneId);
                      return (
                        <div
                          key={idx}
                          className="bead cursor-pointer relative group"
                          style={{ backgroundColor: stone?.color || "#aaa" }}
                          title={stone?.name}
                          onClick={() => removeStoneAt(idx)}
                        >
                          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Icon name="X" size={12} className="text-white" />
                          </span>
                        </div>
                      );
                    })}
                    {/* Застёжка */}
                    <div className="bead" style={{ backgroundColor: "#c9b99a" }} title="Застёжка" />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-muted-foreground font-body">
                  {selectedStones.length} / 20 камней • Нажми на камень чтобы удалить
                </p>
                {selectedStones.length > 0 && (
                  <button onClick={removeLastStone} className="text-xs text-muted-foreground font-body hover:text-foreground flex items-center gap-1">
                    <Icon name="Undo2" size={12} /> Отменить
                  </button>
                )}
              </div>
            </div>

            {/* Выбор камней */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-display text-xl mb-4 text-foreground">Выбор камней</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {STONES_CATALOG.map(stone => (
                  <button
                    key={stone.id}
                    onClick={() => addStone(stone.id)}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-secondary/40 transition-all text-left group"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0 shadow-md group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: stone.color }}
                    />
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
                      onClick={() => setBraceletSize(size)}
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
                      onClick={() => setClasp(c.id)}
                      className={`py-2.5 px-3 rounded-xl text-sm font-body transition-colors ${
                        clasp === c.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/70"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка — итог */}
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-20">
              <h2 className="font-display text-xl mb-4 text-foreground">Ваш браслет</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Основа</span>
                  <span className="text-foreground">{BASE_PRICE.toLocaleString()} ₽</span>
                </div>
                {selectedStones.length > 0 && (
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">{selectedStones.length} камней</span>
                    <span className="text-foreground">{stonesPrice.toLocaleString()} ₽</span>
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
                  onChange={e => setDesignName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm font-body focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleSave}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-full text-sm font-body font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Icon name="BookmarkPlus" size={16} />
                  Сохранить дизайн
                </button>
                <button
                  onClick={handleShare}
                  disabled={selectedStones.length === 0}
                  className="w-full py-3 border border-border text-foreground rounded-full text-sm font-body hover:bg-secondary transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Icon name="Share2" size={16} />
                  Поделиться дизайном
                </button>
                <button
                  onClick={clearAll}
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
        </div>
      ) : (
        /* Сохранённые дизайны */
        <div>
          {savedDesigns.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground font-body">
              <Icon name="Bookmark" size={40} className="mx-auto mb-3 opacity-40" />
              <p className="mb-4">Нет сохранённых дизайнов</p>
              <button
                onClick={() => setTab("create")}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-body hover:opacity-90 transition-opacity"
              >
                Создать первый дизайн
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedDesigns.map(design => (
                <div key={design.id} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-display text-lg text-foreground">{design.name}</h3>
                    <button
                      onClick={() => deleteDesign(design.id)}
                      className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                  <div className="bracelet-preview mb-4 flex-wrap gap-1.5 justify-start">
                    {design.stones.map((stoneId, idx) => {
                      const stone = STONES_CATALOG.find(s => s.id === stoneId);
                      return (
                        <div key={idx} className="bead-sm" style={{ backgroundColor: stone?.color || "#aaa" }} title={stone?.name} />
                      );
                    })}
                  </div>
                  <div className="space-y-1.5 mb-4">
                    <p className="text-xs font-body text-muted-foreground">
                      <span className="font-medium text-foreground">Размер:</span> {design.size} см
                    </p>
                    <p className="text-xs font-body text-muted-foreground">
                      <span className="font-medium text-foreground">Застёжка:</span> {CLASP_TYPES.find(c => c.id === design.clasp)?.label}
                    </p>
                    <p className="text-xs font-body text-muted-foreground">
                      <span className="font-medium text-foreground">Создан:</span> {new Date(design.createdAt).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-display text-foreground">{design.price.toLocaleString()} ₽</span>
                    <button
                      onClick={() => {
                        const params = new URLSearchParams({
                          stones: design.stones.join(","),
                          size: design.size.toString(),
                          clasp: design.clasp,
                          name: design.name,
                        });
                        const link = `${window.location.origin}/constructor?${params}`;
                        navigator.clipboard.writeText(link);
                        toast.success("Ссылка скопирована!");
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-full text-xs font-body text-foreground hover:bg-secondary transition-colors"
                    >
                      <Icon name="Share2" size={12} />
                      Поделиться
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}