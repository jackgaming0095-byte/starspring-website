import { Mark } from "@/components/brand/logo";

/*
  Branded QR review card.

  The code pattern is a deterministic stand-in generated from a fixed seed, not
  a scannable code. It exists to show what the printed card looks like; the
  real asset is generated per client and points at their own review link.
*/

const MODULES = 21;
const FINDER_ZONES = [
  { x: 0, y: 0 },
  { x: MODULES - 7, y: 0 },
  { x: 0, y: MODULES - 7 },
];

function inFinder(x: number, y: number) {
  return FINDER_ZONES.some((zone) => x >= zone.x && x < zone.x + 8 && y >= zone.y && y < zone.y + 8);
}

/** Deterministic hash so server and client render byte-identical markup. */
function isFilled(x: number, y: number) {
  const h = (x * 73_856_093) ^ (y * 19_349_663) ^ 0x9e37;
  return ((h >>> 3) & 7) > 3;
}

function Finder({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="7" height="7" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="2" y="2" width="3" height="3" rx="0.6" fill="currentColor" />
    </g>
  );
}

export function QrCard({ className = "" }: { className?: string }) {
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < MODULES; y += 1) {
    for (let x = 0; x < MODULES; x += 1) {
      if (inFinder(x, y) || !isFilled(x, y)) continue;
      cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" rx="0.25" />);
    }
  }

  return (
    <div
      className={`
        flex w-full max-w-[16rem] flex-col items-center gap-4 rounded-md
        border border-line-strong bg-accent p-5 text-accent-ink ${className}
      `}
    >
      <div className="flex items-center gap-2 self-start">
        <Mark className="size-5" />
        <span className="text-sm font-semibold tracking-[-0.01em]">Enjoyed your visit?</span>
      </div>

      <div className="rounded-sm bg-accent-ink p-3">
        <svg
          viewBox={`-0.5 -0.5 ${MODULES + 1} ${MODULES + 1}`}
          className="size-28 text-accent"
          role="img"
          aria-label="Illustration of a QR code on a branded review card"
        >
          <g fill="currentColor">{cells}</g>
          <g className="text-accent">
            {FINDER_ZONES.map((zone) => (
              <Finder key={`${zone.x}-${zone.y}`} x={zone.x} y={zone.y} />
            ))}
          </g>
        </svg>
      </div>

      <p className="text-center text-xs font-medium leading-relaxed">
        Scan to leave an honest review.
        <span className="mt-1 block font-normal opacity-70">Takes about 20 seconds.</span>
      </p>
    </div>
  );
}
