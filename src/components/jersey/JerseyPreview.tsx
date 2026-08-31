import type { Silhouette } from "@/lib/types";

interface JerseyPreviewProps {
  silhouette: Silhouette;
  colors: { body: string; secondary: string; accent: string };
  pattern: string;
  number?: string;
  name?: string;
  side?: "front" | "back";
  showCrest?: boolean;
  className?: string;
  idSuffix?: string;
}

/**
 * Live, recolourable jersey mock — pure SVG, no assets.
 * The torso path is reused as a clip so patterns stay inside the shirt.
 */
export function JerseyPreview({
  silhouette,
  colors,
  pattern,
  number = "10",
  name = "PLAYER",
  side = "front",
  showCrest = true,
  className = "",
  idSuffix = "j",
}: JerseyPreviewProps) {
  const uid = `${idSuffix}-${silhouette}-${side}`;
  const { body, secondary, accent } = colors;

  const torso =
    silhouette === "tank"
      ? "M150 60 C150 84 250 84 250 60 L286 74 C300 120 300 150 292 176 L300 250 L300 430 C300 440 292 446 282 446 L118 446 C108 446 100 440 100 430 L100 250 L108 176 C100 150 100 120 114 74 Z"
      : "M138 66 L96 84 C66 112 52 150 44 196 L82 214 C92 200 100 176 106 154 L106 430 C106 440 114 446 124 446 L276 446 C286 446 294 440 294 430 L294 154 C300 176 308 200 318 214 L356 196 C348 150 334 112 304 84 L262 66 C244 96 156 96 138 66 Z";

  const longSleeve =
    silhouette === "longsleeve"
      ? "M96 84 C58 150 40 250 34 340 L86 356 C104 280 104 210 106 154 Z M304 84 C342 150 360 250 366 340 L314 356 C296 280 296 210 294 154 Z"
      : null;

  const collar =
    silhouette === "polo"
      ? "M162 66 L200 104 L238 66 L262 74 L238 128 L200 150 L162 128 L138 74 Z"
      : null;

  const stripeW = 26;

  return (
    <svg
      viewBox="0 0 400 480"
      className={className}
      role="img"
      aria-label={`${silhouette} jersey preview, ${side}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={`clip-${uid}`}>
          <path d={torso} />
        </clipPath>
        <linearGradient id={`fade-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={body} />
          <stop offset="1" stopColor={secondary} />
        </linearGradient>
        <filter id={`soft-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="22" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* base shirt */}
      <g filter={`url(#soft-${uid})`}>
        {longSleeve && <path d={longSleeve} fill={secondary} />}
        <path d={torso} fill={body} />
      </g>

      {/* pattern layer, clipped to torso */}
      <g clipPath={`url(#clip-${uid})`}>
        {pattern === "fade" && <rect x="0" y="0" width="400" height="480" fill={`url(#fade-${uid})`} />}
        {pattern === "split" && <rect x="200" y="0" width="200" height="480" fill={secondary} />}
        {pattern === "sash" && (
          <polygon points="60,480 200,60 300,60 160,480" fill={secondary} opacity="0.92" />
        )}
        {pattern === "stripes" &&
          Array.from({ length: 14 }).map((_, i) => (
            <rect
              key={i}
              x={i * stripeW * 2}
              y="0"
              width={stripeW}
              height="480"
              fill={secondary}
            />
          ))}
        {pattern === "hoops" &&
          Array.from({ length: 9 }).map((_, i) => (
            <rect key={i} x="0" y={40 + i * 48} width="400" height="24" fill={secondary} />
          ))}
        {pattern === "chevron" && (
          <>
            <polygon points="0,150 200,250 400,150 400,210 200,310 0,210" fill={secondary} />
            <polygon points="0,150 200,250 400,150 400,168 200,268 0,168" fill={accent} />
          </>
        )}
        {pattern === "camo" && (
          <>
            <polygon points="60,60 180,90 120,190 40,150" fill={secondary} opacity="0.55" />
            <polygon points="220,80 340,60 360,180 250,200" fill={secondary} opacity="0.4" />
            <polygon points="120,240 260,220 300,360 150,400" fill={accent} opacity="0.28" />
            <polygon points="40,320 130,300 160,430 60,450" fill={secondary} opacity="0.35" />
          </>
        )}
        {/* side accent panels */}
        <rect x="98" y="0" width="8" height="480" fill={accent} opacity="0.9" />
        <rect x="294" y="0" width="8" height="480" fill={accent} opacity="0.9" />
      </g>

      {/* collar / neck trim */}
      {collar ? (
        <path d={collar} fill={secondary} stroke={accent} strokeWidth="3" />
      ) : (
        <path
          d={
            silhouette === "tank"
              ? "M150 60 C150 84 250 84 250 60 L246 52 C240 74 160 74 154 52 Z"
              : "M138 66 C156 96 244 96 262 66 L256 56 C240 82 160 82 144 56 Z"
          }
          fill={accent}
        />
      )}

      {/* number + name */}
      {side === "back" ? (
        <>
          <text
            x="200"
            y="150"
            textAnchor="middle"
            fontFamily="var(--font-anton), sans-serif"
            fontSize="34"
            letterSpacing="6"
            fill={accent}
          >
            {name.toUpperCase().slice(0, 14)}
          </text>
          <text
            x="200"
            y="330"
            textAnchor="middle"
            fontFamily="var(--font-anton), sans-serif"
            fontSize="190"
            fill={accent}
          >
            {(number || "0").slice(0, 2)}
          </text>
        </>
      ) : (
        <>
          <text
            x="150"
            y="205"
            textAnchor="middle"
            fontFamily="var(--font-anton), sans-serif"
            fontSize="58"
            fill={accent}
          >
            {(number || "0").slice(0, 2)}
          </text>
          {showCrest && (
            <g transform="translate(232 150)">
              <path d="M0 0 L34 0 L34 22 L17 34 L0 22 Z" fill={accent} />
              <path d="M6 6 L28 6 L28 19 L17 27 L6 19 Z" fill={body} />
            </g>
          )}
          <rect x="120" y="300" width="160" height="20" rx="3" fill={accent} opacity="0.85" />
          <text
            x="200"
            y="315"
            textAnchor="middle"
            fontFamily="var(--font-grotesk), sans-serif"
            fontSize="12"
            letterSpacing="3"
            fill={body}
          >
            YOUR SPONSOR
          </text>
        </>
      )}
    </svg>
  );
}
