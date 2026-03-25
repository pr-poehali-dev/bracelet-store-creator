import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { STONES_CATALOG } from "@/data/products";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

const CLASP_LABELS: Record<string, string> = {
  elastic: "Резинка",
  lobster: "Карабин",
  magnetic: "Магнит",
  toggle: "Тоггл",
};

export default function Account() {
  const { savedDesigns, deleteDesign } = useCart();

  const handleShare = (designId: string) => {
    const design = savedDesigns.find(d => d.id === designId);
    if (!design) return;
    const params = new URLSearchParams({
      stones: design.stones.join(","),
      size: design.size.toString(),
      clasp: design.clasp,
      name: design.name,
    });
    const link = `${window.location.origin}/constructor?${params}`;
    navigator.clipboard.writeText(link);
    toast.success("Ссылка скопирована!");
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-5xl font-display font-light text-foreground mb-2">Личный кабинет</h1>
        <div className="section-divider mx-0 mb-4" />
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Сайдбар */}
        <div className="md:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex flex-col items-center text-center mb-5 pb-5 border-b border-border">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-3">
                <Icon name="User" size={28} className="text-muted-foreground" />
              </div>
              <p className="font-body text-sm text-muted-foreground">Гость</p>
              <p className="font-body text-xs text-muted-foreground/60 mt-0.5">Войдите, чтобы сохранить данные</p>
            </div>
            <nav className="space-y-1">
              {[
                { icon: "Bookmark", label: "Мои дизайны", active: true },
                { icon: "Package", label: "Мои заказы", active: false },
                { icon: "Heart", label: "Избранное", active: false },
                { icon: "Settings", label: "Настройки", active: false },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => !item.active && toast.info("Раздел в разработке")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body transition-colors text-left ${
                    item.active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon name={item.icon as "Bookmark" | "Package" | "Heart" | "Settings"} size={16} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Дизайны */}
        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-3xl font-display font-light text-foreground">Мои дизайны</h2>
            <Link
              to="/constructor"
              className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-body hover:opacity-90 transition-opacity"
            >
              <Icon name="Plus" size={16} />
              Создать
            </Link>
          </div>

          {savedDesigns.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <Icon name="Bookmark" size={40} className="mx-auto mb-4 text-muted-foreground opacity-40" />
              <h3 className="font-display text-2xl text-foreground mb-3">Нет сохранённых дизайнов</h3>
              <p className="text-muted-foreground font-body mb-5">Создайте свой уникальный браслет в конструкторе и сохраните его здесь</p>
              <Link
                to="/constructor"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-body hover:opacity-90 transition-opacity"
              >
                <Icon name="Sparkles" size={16} />
                Открыть конструктор
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {savedDesigns.map(design => (
                <div key={design.id} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display text-xl text-foreground leading-tight">{design.name}</h3>
                      <p className="text-xs font-body text-muted-foreground mt-0.5">
                        {new Date(design.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                    <button
                      onClick={() => { deleteDesign(design.id); toast.success("Дизайн удалён"); }}
                      className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {design.stones.map((stoneId, idx) => {
                      const stone = STONES_CATALOG.find(s => s.id === stoneId);
                      return (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                          style={{ backgroundColor: stone?.color || "#aaa" }}
                          title={stone?.name}
                        />
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-body text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Icon name="Ruler" size={12} />
                      {design.size} см
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Link" size={12} />
                      {CLASP_LABELS[design.clasp]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Gem" size={12} />
                      {design.stones.length} камней
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-display text-foreground">{design.price.toLocaleString()} ₽</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleShare(design.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-full text-xs font-body text-foreground hover:bg-secondary transition-colors"
                      >
                        <Icon name="Share2" size={12} />
                        Поделиться
                      </button>
                      <button
                        onClick={() => toast.info("Оформление заказа — в разработке")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-body hover:opacity-90 transition-opacity"
                      >
                        Заказать
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
