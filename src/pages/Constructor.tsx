import { useState, useRef } from "react";
import { STONES_CATALOG } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { CustomDesign } from "@/context/CartContext";
import Icon from "@/components/ui/icon";
import StoneGem from "@/components/StoneGem";
import { toast } from "sonner";

const CLASP_TYPES = [
  { id: "elastic", label: "Резинка", price: 100 },
  { id: "lobster", label: "Карабин", price: 400 },
  { id: "magnetic", label: "Магнит", price: 400 },
  { id: "toggle", label: "Тоггл", price: 400 },
];

const SIZES = [15, 16, 17, 18, 19, 20, 21];

const CHARM_TYPES = [
  { id: "none",    label: "Без подвески", emoji: "✕",  price: 0 },
  { id: "heart",   label: "Сердце",       emoji: "🤍", price: 150 },
  { id: "star",    label: "Звезда",       emoji: "⭐", price: 150 },
  { id: "moon",    label: "Месяц",        emoji: "🌙", price: 150 },
  { id: "tree",    label: "Дерево",       emoji: "🌳", price: 200 },
  { id: "lotus",   label: "Лотос",        emoji: "🪷", price: 200 },
  { id: "sun",     label: "Солнце",       emoji: "☀️", price: 150 },
  { id: "sea",     label: "Морская",      emoji: "🐚", price: 200 },
];

const BASE_PRICE_ELASTIC = 100;
const BASE_PRICE_DEFAULT = 400;

export default function Constructor() {
  const { saveDesign, savedDesigns, deleteDesign, addDesignToCart } = useCart();
  const [selectedStones, setSelectedStones] = useState<string[]>([]);
  const stoneKeys = useRef<string[]>([]);
  const [braceletSize, setBraceletSize] = useState(17);
  const [clasp, setClasp] = useState("elastic");
  const [charm, setCharm] = useState("none");
  const [designName, setDesignName] = useState("");
  const [tab, setTab] = useState<"create" | "saved">("create");
  const [shareLink, setShareLink] = useState<string | null>(null);

  const basePrice = clasp === "elastic" ? BASE_PRICE_ELASTIC : BASE_PRICE_DEFAULT;
  const stonesPrice = selectedStones.reduce((sum, id) => {
    const stone = STONES_CATALOG.find(s => s.id === id);
    return sum + (stone?.price ?? 56);
  }, 0);
  const charmPrice = CHARM_TYPES.find(c => c.id === charm)?.price ?? 0;
  const totalPrice = basePrice + stonesPrice + charmPrice;

  const addStone = (stoneId: string) => {
    if (selectedStones.length >= 20) {
      toast.error("Максимум 20 камней");
      return;
    }
    stoneKeys.current = [...stoneKeys.current, `${stoneId}_${Date.now()}`];
    setSelectedStones(prev => [...prev, stoneId]);
  };

  const removeLastStone = () => {
    stoneKeys.current = stoneKeys.current.slice(0, -1);
    setSelectedStones(prev => prev.slice(0, -1));
  };

  const removeStoneAt = (idx: number) => {
    stoneKeys.current = stoneKeys.current.filter((_, i) => i !== idx);
    setSelectedStones(prev => prev.filter((_, i) => i !== idx));
  };

  const clearAll = () => {
    stoneKeys.current = [];
    setSelectedStones([]);
  };

  const buildDesign = (): CustomDesign => ({
    id: Date.now().toString(),
    name: designName.trim() || `Браслет от ${new Date().toLocaleDateString("ru-RU")}`,
    stones: selectedStones,
    size: braceletSize,
    clasp,
    createdAt: new Date().toISOString(),
    price: totalPrice,
  });

  const handleSave = () => {
    if (selectedStones.length === 0) {
      toast.error("Добавьте хотя бы один камень");
      return;
    }
    saveDesign(buildDesign());
    toast.success("Дизайн сохранён в личном кабинете!");
  };

  const handleAddToCart = () => {
    if (selectedStones.length === 0) {
      toast.error("Добавьте хотя бы один камень");
      return;
    }
    addDesignToCart(buildDesign());
    toast.success("Дизайн добавлен в корзину!");
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
              <div className="relative bg-secondary/30 rounded-xl flex items-center justify-center py-4" style={{ minHeight: 300 }}>
                {/* Круговая платформа */}
                {(() => {
                  const SIZE = 270;
                  const CENTER = SIZE / 2;
                  const RING_R = 100;
                  const BEAD_R = 14;
                  const total = selectedStones.length + 1; // +1 застёжка
                  const slots = Math.max(total, 8);

                  return (
                    <div style={{ width: SIZE, height: SIZE, position: "relative" }}>
                      {/* SVG фон — платформа + эзотерический центр */}
                      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ position: "absolute", top: 0, left: 0 }}>
                        <defs>
                          <radialGradient id="platform_bg" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="hsl(36,30%,92%)" />
                            <stop offset="70%" stopColor="hsl(30,25%,84%)" />
                            <stop offset="100%" stopColor="hsl(25,28%,72%)" />
                          </radialGradient>
                          <radialGradient id="platform_inner" cx="50%" cy="45%" r="55%">
                            <stop offset="0%" stopColor="hsl(36,35%,97%)" />
                            <stop offset="100%" stopColor="hsl(30,25%,80%)" />
                          </radialGradient>
                        </defs>

                        {/* Внешняя платформа */}
                        <circle cx={CENTER} cy={CENTER} r={CENTER - 4} fill="url(#platform_bg)" />
                        <circle cx={CENTER} cy={CENTER} r={CENTER - 4} fill="none" stroke="hsl(25,28%,55%)" strokeWidth="1.5" strokeOpacity="0.5" />
                        <circle cx={CENTER} cy={CENTER} r={CENTER - 10} fill="none" stroke="hsl(25,28%,55%)" strokeWidth="0.5" strokeDasharray="4 3" strokeOpacity="0.35" />

                        {/* Кольцо под камни */}
                        <circle cx={CENTER} cy={CENTER} r={RING_R} fill="none" stroke="hsl(25,35%,45%)" strokeWidth="1" strokeOpacity="0.3" />

                        {/* Внутренний круг */}
                        <circle cx={CENTER} cy={CENTER} r={74} fill="url(#platform_inner)" />
                        <circle cx={CENTER} cy={CENTER} r={74} fill="none" stroke="hsl(25,35%,45%)" strokeWidth="1" strokeOpacity="0.4" />

                        {/* === ЭЗОТЕРИЧЕСКИЙ ЦЕНТР === */}
                        {/* Звезда Давида (шестиконечная) */}
                        <polygon
                          points={`${CENTER},${CENTER - 52} ${CENTER + 45},${CENTER + 26} ${CENTER - 45},${CENTER + 26}`}
                          fill="none" stroke="hsl(25,35%,40%)" strokeWidth="1" strokeOpacity="0.3"
                        />
                        <polygon
                          points={`${CENTER},${CENTER + 52} ${CENTER + 45},${CENTER - 26} ${CENTER - 45},${CENTER - 26}`}
                          fill="none" stroke="hsl(25,35%,40%)" strokeWidth="1" strokeOpacity="0.3"
                        />

                        {/* Цветок жизни — 6 кружков вокруг центра */}
                        {[0,1,2,3,4,5].map(i => {
                          const a = (i * Math.PI * 2) / 6;
                          const r = 22;
                          return (
                            <circle key={i}
                              cx={CENTER + r * Math.cos(a)}
                              cy={CENTER + r * Math.sin(a)}
                              r={22}
                              fill="none" stroke="hsl(25,35%,40%)" strokeWidth="0.8" strokeOpacity="0.28"
                            />
                          );
                        })}
                        {/* Центральный кружок цветка */}
                        <circle cx={CENTER} cy={CENTER} r={22} fill="none" stroke="hsl(25,35%,40%)" strokeWidth="0.8" strokeOpacity="0.28" />

                        {/* Внешнее кольцо цветка жизни */}
                        {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
                          const a = (i * Math.PI * 2) / 12;
                          const r = 44;
                          return (
                            <circle key={i}
                              cx={CENTER + r * Math.cos(a)}
                              cy={CENTER + r * Math.sin(a)}
                              r={22}
                              fill="none" stroke="hsl(25,35%,40%)" strokeWidth="0.6" strokeOpacity="0.16"
                            />
                          );
                        })}

                        {/* Глаз / солнце в центре */}
                        <circle cx={CENTER} cy={CENTER} r={9} fill="hsl(25,40%,70%)" fillOpacity="0.5" />
                        <circle cx={CENTER} cy={CENTER} r={5} fill="hsl(25,45%,45%)" fillOpacity="0.6" />
                        <circle cx={CENTER} cy={CENTER} r={2} fill="hsl(25,50%,30%)" fillOpacity="0.8" />

                        {/* Лучи от центра */}
                        {[0,1,2,3,4,5,6,7].map(i => {
                          const a = (i * Math.PI * 2) / 8;
                          return (
                            <line key={i}
                              x1={CENTER + 10 * Math.cos(a)} y1={CENTER + 10 * Math.sin(a)}
                              x2={CENTER + 68 * Math.cos(a)} y2={CENTER + 68 * Math.sin(a)}
                              stroke="hsl(25,35%,40%)" strokeWidth="0.5" strokeOpacity="0.18"
                            />
                          );
                        })}

                        {/* Лунные фазы снизу */}
                        <text x={CENTER} y={CENTER + 62} textAnchor="middle" fontSize="11" fill="hsl(25,35%,40%)" fillOpacity="0.45" fontFamily="serif">☽ ○ ☾</text>

                        {/* Точки на внешней окружности */}
                        {Array.from({ length: slots }).map((_, i) => {
                          const a = (i * Math.PI * 2) / slots - Math.PI / 2;
                          return (
                            <circle key={i}
                              cx={CENTER + RING_R * Math.cos(a)}
                              cy={CENTER + RING_R * Math.sin(a)}
                              r={BEAD_R + 1}
                              fill="hsl(25,28%,72%)"
                              fillOpacity="0.5"
                              stroke="hsl(25,35%,45%)"
                              strokeWidth="0.8"
                              strokeOpacity="0.3"
                            />
                          );
                        })}

                        {selectedStones.length === 0 && (
                          <text x={CENTER} y={CENTER + 92} textAnchor="middle" fontSize="10" fill="hsl(25,20%,50%)" fontFamily="sans-serif">
                            Добавьте камни ниже
                          </text>
                        )}
                      </svg>

                      {/* Камни по кругу */}
                      {selectedStones.map((stoneId, idx) => {
                        const a = (idx * Math.PI * 2) / slots - Math.PI / 2;
                        const x = CENTER + RING_R * Math.cos(a) - BEAD_R;
                        const y = CENTER + RING_R * Math.sin(a) - BEAD_R;
                        const stone = stoneDetails(stoneId);
                        const uniqueKey = stoneKeys.current[idx] ?? `${stoneId}_${idx}`;
                        return (
                          <div
                            key={uniqueKey}
                            title={stone?.name}
                            onClick={() => removeStoneAt(idx)}
                            className="absolute cursor-pointer group stone-appear"
                            style={{ left: x, top: y, width: BEAD_R * 2, height: BEAD_R * 2 }}
                          >
                            <StoneGem stoneId={stoneId} size={BEAD_R * 2} className="rounded-full" />
                            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full">
                              <Icon name="X" size={10} className="text-white" />
                            </span>
                          </div>
                        );
                      })}

                      {/* Застёжка */}
                      {selectedStones.length > 0 && (() => {
                        const idx = selectedStones.length;
                        const a = (idx * Math.PI * 2) / slots - Math.PI / 2;
                        const x = CENTER + RING_R * Math.cos(a) - BEAD_R;
                        const y = CENTER + RING_R * Math.sin(a) - BEAD_R;
                        return (
                          <div
                            title="Застёжка"
                            className="absolute flex items-center justify-center rounded-full"
                            style={{ left: x, top: y, width: BEAD_R * 2, height: BEAD_R * 2, background: "radial-gradient(circle at 35% 30%, #e8d8b4, #c9b99a, #9c8a6a)", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
                          >
                            <Icon name="Link" size={10} className="text-stone-600 opacity-70" />
                          </div>
                        );
                      })()}
                    </div>
                  );
                })()}
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
                      onClick={() => setCharm(c.id)}
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
          </div>

          {/* Правая колонка — итог */}
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
                  onChange={e => setDesignName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm font-body focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleAddToCart}
                  disabled={selectedStones.length === 0}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-full text-sm font-body font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Icon name="ShoppingCart" size={16} />
                  Отправить дизайн в корзину
                </button>
                <button
                  onClick={handleSave}
                  className="w-full py-3 border border-border text-foreground rounded-full text-sm font-body font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2"
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