import { useEffect, useRef } from "react";

export function useRevealOnScroll(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add("reveal");

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("in");
            obs.unobserve(el);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px", ...options }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return ref;
}
