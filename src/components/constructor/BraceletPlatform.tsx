import Icon from "@/components/ui/icon";
import StoneGem from "@/components/StoneGem";
import { STONES_CATALOG } from "@/data/products";
import { CHARM_TYPES } from "./StonePicker";

interface BraceletPlatformProps {
  selectedStones: string[];
  stoneKeys: React.MutableRefObject<string[]>;
  charm: string;
  onRemoveStoneAt: (idx: number) => void;
  onRemoveLastStone: () => void;
}

const SIZE = 270;
const CENTER = SIZE / 2;
const RING_R = 100;
const BEAD_R = 14;

export default function BraceletPlatform({
  selectedStones,
  stoneKeys,
  charm,
  onRemoveStoneAt,
  onRemoveLastStone,
}: BraceletPlatformProps) {
  const total = selectedStones.length + 1;
  const slots = Math.max(total, 8);
  const charmDef = CHARM_TYPES.find(c => c.id === charm);

  const stoneDetails = (id: string) => STONES_CATALOG.find(s => s.id === id);

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="font-display text-xl mb-4 text-foreground">Предпросмотр</h2>
      <div className="relative bg-secondary/30 rounded-xl flex items-center justify-center py-4 pb-10" style={{ minHeight: 340 }}>
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

            {/* Звезда Давида */}
            <polygon
              points={`${CENTER},${CENTER - 52} ${CENTER + 45},${CENTER + 26} ${CENTER - 45},${CENTER + 26}`}
              fill="none" stroke="hsl(25,35%,40%)" strokeWidth="1" strokeOpacity="0.3"
            />
            <polygon
              points={`${CENTER},${CENTER + 52} ${CENTER + 45},${CENTER - 26} ${CENTER - 45},${CENTER - 26}`}
              fill="none" stroke="hsl(25,35%,40%)" strokeWidth="1" strokeOpacity="0.3"
            />

            {/* Цветок жизни — 6 кружков вокруг центра */}
            {[0, 1, 2, 3, 4, 5].map(i => {
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
            <circle cx={CENTER} cy={CENTER} r={22} fill="none" stroke="hsl(25,35%,40%)" strokeWidth="0.8" strokeOpacity="0.28" />

            {/* Внешнее кольцо цветка жизни */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => {
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
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
              const a = (i * Math.PI * 2) / 8;
              return (
                <line key={i}
                  x1={CENTER + 10 * Math.cos(a)} y1={CENTER + 10 * Math.sin(a)}
                  x2={CENTER + 68 * Math.cos(a)} y2={CENTER + 68 * Math.sin(a)}
                  stroke="hsl(25,35%,40%)" strokeWidth="0.5" strokeOpacity="0.18"
                />
              );
            })}

            {/* Лунные фазы */}
            <text x={CENTER} y={CENTER + 62} textAnchor="middle" fontSize="11" fill="hsl(25,35%,40%)" fillOpacity="0.45" fontFamily="serif">☽ ○ ☾</text>

            {/* Гнёзда на кольце */}
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
                onClick={() => onRemoveStoneAt(idx)}
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

          {/* Подвеска */}
          {charmDef && charmDef.id !== "none" && (
            <div
              title={charmDef.label}
              className="absolute flex flex-col items-center charm-pendant"
              style={{ left: CENTER - 22, top: SIZE - 14 }}
            >
              {/* Цепочка */}
              <div style={{ width: 1.5, height: 18, background: "linear-gradient(to bottom, #b8a070, #9c8060)", borderRadius: 1, opacity: 0.7 }} />
              {/* Медальон */}
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 44,
                  height: 44,
                  background: "radial-gradient(circle at 35% 30%, #f0e8d0, #d4c090, #a08040)",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.25), inset 0 1px 3px rgba(255,255,255,0.4)",
                  border: "1px solid rgba(180,140,60,0.5)",
                  fontSize: 22,
                  lineHeight: 1,
                }}
              >
                {charmDef.emoji}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-3">
        <p className="text-xs text-muted-foreground font-body">
          {selectedStones.length} / 20 камней • Нажми на камень чтобы удалить
        </p>
        {selectedStones.length > 0 && (
          <button onClick={onRemoveLastStone} className="text-xs text-muted-foreground font-body hover:text-foreground flex items-center gap-1">
            <Icon name="Undo2" size={12} /> Отменить
          </button>
        )}
      </div>
    </div>
  );
}