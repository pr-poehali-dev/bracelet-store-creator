interface StoneGemProps {
  stoneId: string;
  size?: number;
  className?: string;
}

const STONE_DEFS: Record<string, { stops: string[]; pattern?: string; shine?: boolean }> = {
  amethyst: {
    stops: ["#c39bd3", "#9b59b6", "#6c3483", "#4a235a"],
    shine: true,
  },
  rose_quartz: {
    stops: ["#fce4ec", "#f8bbd0", "#f48fb1", "#e879a0"],
    shine: true,
  },
  tiger_eye: {
    stops: ["#f0c040", "#c8860a", "#8d5900", "#5c3a00"],
    pattern: "stripes",
  },
  lapis: {
    stops: ["#2e86c1", "#1a5276", "#0e2f4a", "#061a2b"],
    pattern: "gold-fleck",
  },
  turquoise: {
    stops: ["#76d7c4", "#48c9b0", "#1a9e8a", "#0e6b5e"],
    pattern: "vein",
  },
  malachite: {
    stops: ["#82e0aa", "#27ae60", "#1a7d44", "#0e4d2b"],
    pattern: "vein",
  },
  obsidian: {
    stops: ["#5d6d7e", "#2c3e50", "#1a252f", "#0d1117"],
    shine: true,
  },
  citrine: {
    stops: ["#f9e79f", "#f4d03f", "#d4ac0d", "#9a7d0a"],
    shine: true,
  },
  labradorite: {
    stops: ["#aab7b8", "#7f8c8d", "#5d6d7e", "#2e4057"],
    pattern: "iridescent",
  },
  carnelian: {
    stops: ["#f1948a", "#e74c3c", "#cb4335", "#922b21"],
    pattern: "cloud",
  },
  jade: {
    stops: ["#76d7c4", "#45b39d", "#1a8a6e", "#0d5c49"],
    pattern: "vein",
  },
  hematite: {
    stops: ["#aab7b8", "#808b96", "#616161", "#3d3d3d"],
    shine: true,
  },
  moonstone: {
    stops: ["#f8f9fa", "#e8eaf6", "#c5cae9", "#9fa8da"],
    pattern: "iridescent",
  },
  amber: {
    stops: ["#f9e79f", "#f0b429", "#d4810a", "#9a5800"],
    pattern: "inclusion",
    shine: true,
  },
  coral: {
    stops: ["#f5c6ae", "#e8825a", "#d45a2a", "#9c3a14"],
    pattern: "cloud",
  },
  pearl: {
    stops: ["#fdfefe", "#f0ead6", "#ddd5b8", "#bfb094"],
    shine: true,
  },
};

export default function StoneGem({ stoneId, size = 32, className = "" }: StoneGemProps) {
  const def = STONE_DEFS[stoneId];
  if (!def) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
        <circle cx="16" cy="16" r="14" fill="#aaa" />
      </svg>
    );
  }

  const id = `sg_${stoneId}`;
  const [c1, c2, c3, c4] = def.stops;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      style={{ display: "block" }}
    >
      <defs>
        {/* Основной радиальный градиент */}
        <radialGradient id={`${id}_rg`} cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="40%" stopColor={c2} />
          <stop offset="75%" stopColor={c3} />
          <stop offset="100%" stopColor={c4} />
        </radialGradient>

        {/* Блик */}
        <radialGradient id={`${id}_shine`} cx="35%" cy="28%" r="45%">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        {/* Паттерн полос (тигровый глаз) */}
        {def.pattern === "stripes" && (
          <pattern id={`${id}_pat`} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(35)">
            <rect width="6" height="6" fill="transparent" />
            <line x1="0" y1="1.5" x2="6" y2="1.5" stroke="#e8a020" strokeWidth="1.2" strokeOpacity="0.5" />
            <line x1="0" y1="4" x2="6" y2="4" stroke="#7a4500" strokeWidth="0.8" strokeOpacity="0.4" />
          </pattern>
        )}

        {/* Паттерн золотых вкраплений (лазурит) */}
        {def.pattern === "gold-fleck" && (
          <pattern id={`${id}_pat`} patternUnits="userSpaceOnUse" width="10" height="10">
            <rect width="10" height="10" fill="transparent" />
            <circle cx="2" cy="3" r="0.7" fill="#d4ac0d" fillOpacity="0.8" />
            <circle cx="7" cy="7" r="0.5" fill="#d4ac0d" fillOpacity="0.6" />
            <circle cx="5" cy="1.5" r="0.4" fill="#ffffff" fillOpacity="0.4" />
          </pattern>
        )}

        {/* Прожилки (бирюза, малахит, нефрит) */}
        {def.pattern === "vein" && (
          <pattern id={`${id}_pat`} patternUnits="userSpaceOnUse" width="16" height="16" patternTransform="rotate(15)">
            <rect width="16" height="16" fill="transparent" />
            <path d="M0 5 Q4 3 8 6 Q12 9 16 7" stroke="white" strokeWidth="0.6" strokeOpacity="0.2" fill="none" />
            <path d="M0 11 Q5 13 10 10 Q13 8 16 12" stroke="black" strokeWidth="0.4" strokeOpacity="0.15" fill="none" />
          </pattern>
        )}

        {/* Переливы (лабрадорит, лунный камень) */}
        {def.pattern === "iridescent" && (
          <>
            <linearGradient id={`${id}_iri`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a8d8ea" stopOpacity="0" />
              <stop offset="40%" stopColor="#81d4fa" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#ce93d8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#80cbc4" stopOpacity="0" />
            </linearGradient>
          </>
        )}

        {/* Облачная текстура (сердолик, коралл) */}
        {def.pattern === "cloud" && (
          <radialGradient id={`${id}_pat`} cx="60%" cy="55%" r="50%">
            <stop offset="0%" stopColor={c1} stopOpacity="0.3" />
            <stop offset="100%" stopColor={c3} stopOpacity="0" />
          </radialGradient>
        )}

        {/* Включения (янтарь) */}
        {def.pattern === "inclusion" && (
          <radialGradient id={`${id}_inc`} cx="55%" cy="60%" r="30%">
            <stop offset="0%" stopColor="#8d5a00" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8d5a00" stopOpacity="0" />
          </radialGradient>
        )}

        {/* Маска круга */}
        <clipPath id={`${id}_clip`}>
          <circle cx="16" cy="16" r="14" />
        </clipPath>
      </defs>

      {/* Основной камень */}
      <circle cx="16" cy="16" r="14" fill={`url(#${id}_rg)`} />

      {/* Паттерн поверх */}
      {def.pattern === "stripes" && (
        <circle cx="16" cy="16" r="14" fill={`url(#${id}_pat)`} />
      )}
      {def.pattern === "gold-fleck" && (
        <circle cx="16" cy="16" r="14" fill={`url(#${id}_pat)`} />
      )}
      {def.pattern === "vein" && (
        <circle cx="16" cy="16" r="14" fill={`url(#${id}_pat)`} />
      )}
      {def.pattern === "iridescent" && (
        <circle cx="16" cy="16" r="14" fill={`url(#${id}_iri)`} />
      )}
      {def.pattern === "cloud" && (
        <circle cx="16" cy="16" r="14" fill={`url(#${id}_pat)`} />
      )}
      {def.pattern === "inclusion" && (
        <circle cx="16" cy="16" r="14" fill={`url(#${id}_inc)`} />
      )}

      {/* Блик (у всех) */}
      <circle cx="16" cy="16" r="14" fill={`url(#${id}_shine)`} />

      {/* Дополнительный маленький бликовый акцент */}
      <ellipse cx="11" cy="10" rx="3.5" ry="2.2" fill="white" fillOpacity="0.18" />

      {/* Обводка */}
      <circle cx="16" cy="16" r="14" fill="none" stroke="black" strokeOpacity="0.12" strokeWidth="0.8" />
    </svg>
  );
}
