// One motion state for everything that moves by itself: the particle field and the card videos.
// It lives on <html data-motion="running|paused">, and other scripts listen for "motionchange".
// Paused while the visitor prefers reduced motion, running otherwise. There is no on-page pause control for now
// (B90, deferred by the owner on 2026-11-22; revisit after Phase 5). When one is added, it only has to call set().
(function () {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function set(state) {
        if (root.dataset.motion === state) return;
        root.dataset.motion = state;
        document.dispatchEvent(new CustomEvent("motionchange", { detail: { state } }));
    }

    root.dataset.motion = reducedMotion.matches ? "paused" : "running";
    window.pspMotion = { isRunning: () => root.dataset.motion === "running", set };

    // Follows the OS setting, including when it changes while the page is open
    reducedMotion.addEventListener("change", () => set(reducedMotion.matches ? "paused" : "running"));
})();
