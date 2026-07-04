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
    const duration = 1600;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
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
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          className="rounded-3xl bg-white/10 p-8 text-center ring-1 ring-white/15 backdrop-blur-sm"
        >
          <p className="font-display text-4xl font-bold text-white sm:text-5xl">
            {item.asIs ? (
              <>
                {item.value}
                {item.suffix}
              </>
            ) : (
              <Counter target={item.value} suffix={item.suffix} />
            )}
          </p>
          <p className="mt-2 text-sm font-medium text-primary-100/85">
            {item.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
