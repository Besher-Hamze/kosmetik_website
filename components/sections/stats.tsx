"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? target : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const duration = 1800;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

export function Stats({
  items,
}: {
  items: { value: number; suffix?: string; label: string; asIs?: boolean }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          className="group relative overflow-hidden rounded-3xl bg-white/8 p-7 text-center ring-1 ring-white/15 backdrop-blur-md sm:p-8"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 transition group-hover:opacity-100"
            aria-hidden
          />
          <p className="relative font-display text-4xl font-bold sm:text-5xl">
            <span className="text-gradient-gold">
              {item.asIs ? (
                <>
                  {item.value}
                  {item.suffix}
                </>
              ) : (
                <Counter target={item.value} suffix={item.suffix} />
              )}
            </span>
          </p>
          <p className="relative mt-2 text-xs font-semibold uppercase tracking-wider text-primary-100/80 sm:text-sm">
            {item.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
