/**
 * Декоративный фон для hero — анимированная сетка с акцентами.
 */
export function HeroGrid() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Центральный radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 60%)",
        }}
      />

      {/* Декоративные линии */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line
          x1="0"
          y1="200"
          x2="1000"
          y2="350"
          stroke="url(#lineGrad)"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1="500"
          x2="1000"
          y2="650"
          stroke="url(#lineGrad)"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1="800"
          x2="1000"
          y2="950"
          stroke="url(#lineGrad)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
