"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Анимированная технократическая SVG-композиция для Hero:
 * - Wireframe icosahedron (вращается)
 * - Орбитальные ноды
 * - Flow-линии между нодами
 * - Глитч-частицы
 *
 * Всё в emerald/cold blue, тёмный фон, GPU-only transforms.
 */
export function HeroAnimation() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 6 орбитальных нод с рандомным стартом
  const nodes = [
    { angle: 0, r: 38, size: 4, delay: 0 },
    { angle: 60, r: 38, size: 3, delay: 0.5 },
    { angle: 120, r: 38, size: 5, delay: 1 },
    { angle: 180, r: 38, size: 3, delay: 1.5 },
    { angle: 240, r: 38, size: 4, delay: 2 },
    { angle: 300, r: 38, size: 3, delay: 2.5 },
  ];

  return (
    <div className="relative w-full aspect-square max-w-[520px] mx-auto">
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          {/* Радиальный градиент для центра */}
          <radialGradient id="coreGrad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.8" />
            <stop offset="60%" stopColor="var(--color-accent)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>

          {/* Свечение для нод */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Пульсирующее кольцо */}
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* === ОРБИТЫ === */}
        {[42, 56, 70].map((r, i) => (
          <circle
            key={`orbit-${i}`}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="0.2"
            strokeOpacity="0.15"
            strokeDasharray="2 4"
          />
        ))}

        {/* === ВРАЩАЮЩИЙСЯ WIREFRAME ICOSAHEDRON === */}
        <motion.g
          style={{ transformOrigin: "100px 100px" }}
          animate={mounted ? { rotate: 360 } : {}}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <motion.g
            style={{ transformOrigin: "100px 100px" }}
            animate={mounted ? { rotate: -360 } : {}}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          >
            {/* Внешний wireframe куб (в проекции) */}
            <polygon
              points="60,70 100,55 140,70 140,120 100,135 60,120"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="0.5"
              strokeOpacity="0.5"
            />
            <polygon
              points="75,80 100,70 125,80 125,115 100,125 75,115"
              fill="none"
              stroke="var(--color-blue)"
              strokeWidth="0.4"
              strokeOpacity="0.5"
            />
            <polygon
              points="85,90 100,83 115,90 115,108 100,115 85,108"
              fill="var(--color-accent)"
              fillOpacity="0.05"
              stroke="var(--color-accent)"
              strokeWidth="0.4"
              strokeOpacity="0.6"
            />
            {/* Внутренние связи */}
            <line x1="60" y1="70" x2="100" y2="55" stroke="var(--color-accent)" strokeWidth="0.2" strokeOpacity="0.3" />
            <line x1="100" y1="55" x2="140" y2="70" stroke="var(--color-accent)" strokeWidth="0.2" strokeOpacity="0.3" />
            <line x1="60" y1="120" x2="100" y2="135" stroke="var(--color-accent)" strokeWidth="0.2" strokeOpacity="0.3" />
            <line x1="100" y1="135" x2="140" y2="120" stroke="var(--color-accent)" strokeWidth="0.2" strokeOpacity="0.3" />
          </motion.g>
        </motion.g>

        {/* === ЦЕНТРАЛЬНОЕ ЯДРО === */}
        <circle cx="100" cy="100" r="20" fill="url(#coreGrad)" />
        <motion.circle
          cx="100"
          cy="100"
          r="3"
          fill="var(--color-accent)"
          filter="url(#glow)"
          animate={mounted ? { scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="100"
          cy="100"
          r="8"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="0.4"
          animate={mounted ? { r: [8, 18, 8], opacity: [0.8, 0, 0.8] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
        />

        {/* === ОРБИТАЛЬНЫЕ НОДЫ === */}
        <motion.g
          style={{ transformOrigin: "100px 100px" }}
          animate={mounted ? { rotate: 360 } : {}}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {nodes.map((n, i) => {
            const x = 100 + n.r * Math.cos((n.angle * Math.PI) / 180);
            const y = 100 + n.r * Math.sin((n.angle * Math.PI) / 180);
            return (
              <g key={`node-${i}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={n.size / 4}
                  fill="var(--color-blue)"
                  filter="url(#glow)"
                />
                <motion.circle
                  cx={x}
                  cy={y}
                  r={n.size / 4}
                  fill="var(--color-blue)"
                  animate={mounted ? { r: [n.size / 4, n.size, n.size / 4], opacity: [1, 0, 1] } : {}}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: n.delay,
                    ease: "easeOut",
                  }}
                />
              </g>
            );
          })}
        </motion.g>

        {/* === FLOW LINES (статичные связи от ядра) === */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const x = 100 + 70 * Math.cos((deg * Math.PI) / 180);
          const y = 100 + 70 * Math.sin((deg * Math.PI) / 180);
          return (
            <line
              key={`flow-${deg}`}
              x1="100"
              y1="100"
              x2={x}
              y2={y}
              stroke="var(--color-accent)"
              strokeWidth="0.2"
              strokeOpacity="0.2"
              strokeDasharray="1 3"
            />
          );
        })}

        {/* === ВНЕШНИЕ ДУГИ (вторая орбита, против часовой) === */}
        <motion.g
          style={{ transformOrigin: "100px 100px" }}
          animate={mounted ? { rotate: -360 } : {}}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        >
          <circle
            cx="155"
            cy="100"
            r="1.5"
            fill="var(--color-accent)"
            filter="url(#glow)"
          />
          <circle
            cx="45"
            cy="100"
            r="1.5"
            fill="var(--color-blue)"
            filter="url(#glow)"
          />
        </motion.g>

        {/* === УГЛОВЫЕ МЕТКИ (crosshair corners) === */}
        {[
          { x: 10, y: 10 },
          { x: 190, y: 10 },
          { x: 10, y: 190 },
          { x: 190, y: 190 },
        ].map((p, i) => (
          <g key={`corner-${i}`} stroke="var(--color-accent)" strokeWidth="0.5" strokeOpacity="0.4">
            <line x1={p.x} y1={p.y} x2={p.x + 6} y2={p.y} />
            <line x1={p.x} y1={p.y} x2={p.x} y2={p.y + 6} />
          </g>
        ))}

        {/* === КООРДИНАТНАЯ МЕТКА === */}
        <text
          x="10"
          y="198"
          fill="var(--color-foreground-subtle)"
          fontSize="2.5"
          fontFamily="monospace"
          opacity="0.5"
        >
          ACC.SYS / v1.0 / ONLINE
        </text>
        <text
          x="190"
          y="198"
          fill="var(--color-accent)"
          fontSize="2.5"
          fontFamily="monospace"
          textAnchor="end"
          opacity="0.7"
        >
          ● ACTIVE
        </text>
      </svg>

      {/* Подсвечивающий ореол */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--color-accent-glow) 0%, transparent 60%)",
          filter: "blur(40px)",
          opacity: 0.4,
        }}
      />
    </div>
  );
}
