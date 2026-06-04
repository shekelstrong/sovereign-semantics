interface LogoMarkProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

/**
 * Sovereign Semantics — фирменный знак.
 * Гексагон-каркас (структура, суверенитет, сеть) + infinity / S-curve
 * (семантические сети, непрерывность смысла). Emerald на чёрном.
 *
 * Используется в Header, Footer, OG-картинках, иконках.
 */
export function LogoMark({ className = "", size = 32, animated = false }: LogoMarkProps) {
  const cls = `${animated ? "transition-transform duration-500 " : ""}${className}`.trim();
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={cls}
      aria-label="Sovereign Semantics"
      role="img"
    >
      <polygon
        points="50,6 90,28 90,72 50,94 10,72 10,28"
        fill="none"
        stroke="#10b981"
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <path
        d="M 30 50 C 30 35, 45 35, 50 50 C 55 65, 70 65, 70 50 C 70 35, 55 35, 50 50 C 45 65, 30 65, 30 50 Z"
        fill="none"
        stroke="#10b981"
        strokeWidth={5}
        strokeLinecap="round"
      />
    </svg>
  );
}
