(function () {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Card videos play only while on screen, and never under reduced motion.
    // preload="none" means nothing downloads until play() is called.
    const cardVideos = document.querySelectorAll(".portfolio-item video");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = entry.target;
                if (entry.isIntersecting && !reducedMotion.matches) {
                    video.play().catch(() => {}); // autoplay can be blocked; the poster stays
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.25 });

        cardVideos.forEach((video) => observer.observe(video));

        // Re-evaluate every card when the motion preference changes
        // (unobserve then observe makes the observer fire its callback again)
        reducedMotion.addEventListener("change", () => {
            cardVideos.forEach((video) => {
                observer.unobserve(video);
                observer.observe(video);
            });
        });
    }

    // Modal videos load and play when their modal opens, and pause when it closes.
    // Under reduced motion they wait for the visitor to press play.
    document.querySelectorAll(".portfolio-modal").forEach((modal) => {
        const video = modal.querySelector("video");
        if (!video) return;
        modal.addEventListener("shown.bs.modal", () => {
            if (!reducedMotion.matches) video.play().catch(() => {});
        });
        modal.addEventListener("hide.bs.modal", () => video.pause());
    });
})();
