import { useState, useRef } from "react";
import { STONES_CATALOG } from "@/data/products";
import { useCart, CustomDesign } from "@/context/CartContext";
import { toast } from "sonner";
import BraceletPlatform from "@/components/constructor/BraceletPlatform";
import StonePicker, { CLASP_TYPES, CHARM_TYPES } from "@/components/constructor/StonePicker";
import DesignSummary from "@/components/constructor/DesignSummary";
import SavedDesigns from "@/components/constructor/SavedDesigns";
import Icon from "@/components/ui/icon";

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
            <BraceletPlatform
              selectedStones={selectedStones}
              stoneKeys={stoneKeys}
              onRemoveStoneAt={removeStoneAt}
              onRemoveLastStone={removeLastStone}
            />
            <StonePicker
              braceletSize={braceletSize}
              clasp={clasp}
              charm={charm}
              onAddStone={addStone}
              onSizeChange={setBraceletSize}
              onClaspChange={setClasp}
              onCharmChange={setCharm}
            />
          </div>

          {/* Правая колонка — итог */}
          <DesignSummary
            selectedStones={selectedStones}
            basePrice={basePrice}
            stonesPrice={stonesPrice}
            charmPrice={charmPrice}
            charm={charm}
            totalPrice={totalPrice}
            designName={designName}
            shareLink={shareLink}
            onDesignNameChange={setDesignName}
            onAddToCart={handleAddToCart}
            onSave={handleSave}
            onShare={handleShare}
            onClear={clearAll}
          />
        </div>
      ) : (
        <SavedDesigns
          savedDesigns={savedDesigns}
          onDeleteDesign={deleteDesign}
          onCreateFirst={() => setTab("create")}
        />
      )}
    </main>
  );
}
