import Icon from "@/components/ui/icon";
import { STONES_CATALOG } from "@/data/products";
import { CustomDesign } from "@/context/CartContext";
import { CLASP_TYPES } from "./StonePicker";
import { toast } from "sonner";

interface SavedDesignsProps {
  savedDesigns: CustomDesign[];
  onDeleteDesign: (id: string) => void;
  onCreateFirst: () => void;
}

export default function SavedDesigns({ savedDesigns, onDeleteDesign, onCreateFirst }: SavedDesignsProps) {
  if (savedDesigns.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground font-body">
        <Icon name="Bookmark" size={40} className="mx-auto mb-3 opacity-40" />
        <p className="mb-4">Нет сохранённых дизайнов</p>
        <button
          onClick={onCreateFirst}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-body hover:opacity-90 transition-opacity"
        >
          Создать первый дизайн
        </button>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {savedDesigns.map(design => (
        <div key={design.id} className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-display text-lg text-foreground">{design.name}</h3>
            <button
              onClick={() => onDeleteDesign(design.id)}
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
  );
}
