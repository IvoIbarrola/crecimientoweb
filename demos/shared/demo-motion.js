import { animate, inView, scroll, stagger } from "motion";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reducedMotion) {
  document.documentElement.dataset.motionEnabled = "true";

  document.querySelectorAll("[data-motion-intro]").forEach((intro) => {
    const items = Array.from(intro.children);
    if (items.length) {
      animate(items, { opacity: [0, 1], y: [22, 0] }, {
        delay: stagger(0.09),
        duration: 0.72,
        ease: "easeOut",
      });
    }
  });

  document.querySelectorAll("[data-reveal]").forEach((element) => {
    inView(element, () => {
      const animation = animate(element, { opacity: [0, 1], y: [22, 0] }, {
        duration: 0.72,
        ease: "easeOut",
      });

      return () => animation.stop();
    }, { amount: 0.15 });
  });

  const progressBar = document.querySelector("[data-motion-progress]");
  if (progressBar) {
    scroll(animate(progressBar, { scaleX: [0, 1] }, { ease: "linear" }));
  }

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-filter]")) return;

    requestAnimationFrame(() => {
      const visibleProducts = document.querySelectorAll(".product-card:not([hidden])");
      if (visibleProducts.length) {
        animate(visibleProducts, { opacity: [0, 1], y: [12, 0] }, {
          delay: stagger(0.035),
          duration: 0.32,
          ease: "easeOut",
        });
      }
    });
  });

  document.querySelectorAll("[data-motion-count]").forEach((counter) => {
    const target = Number(counter.textContent);
    if (!Number.isFinite(target)) return;

    animate(0, target, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (value) => {
        counter.textContent = String(Math.round(value));
      },
    });
  });
}
