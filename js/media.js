(function () {
    // Motion state comes from js/motion.js (paused under reduced motion, or when the visitor pressed pause)
    const running = () => !window.pspMotion || window.pspMotion.isRunning();
    let modalOpen = false;

    // Card videos play only while on screen, only while motion is running, and not behind an open modal.
    // preload="none" means nothing downloads until play() is called.
    const cardVideos = document.querySelectorAll(".portfolio-item video");
    const onScreen = new Set();

    function syncCard(video) {
        if (running() && !modalOpen && onScreen.has(video)) {
            video.play().catch(() => {}); // autoplay can be blocked; the poster stays
        } else {
            video.pause();
        }
    }
    const syncCards = () => cardVideos.forEach(syncCard);

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) onScreen.add(entry.target);
                else onScreen.delete(entry.target);
                syncCard(entry.target);
            });
        }, { threshold: 0.25 });
        cardVideos.forEach((video) => observer.observe(video));
    }

    // Modal videos load and play when their modal opens (if motion is running), and pause when it closes.
    const modalVideos = [];
    document.querySelectorAll(".portfolio-modal").forEach((modal) => {
        const video = modal.querySelector("video");
        if (!video) return;
        modalVideos.push(video);
        modal.addEventListener("shown.bs.modal", () => {
            if (running()) video.play().catch(() => {});
        });
        modal.addEventListener("hide.bs.modal", () => video.pause());
    });

    // The cards behind a modal rest while it is open, and resume when it closes
    document.addEventListener("show.bs.modal", () => { modalOpen = true; syncCards(); });
    document.addEventListener("hidden.bs.modal", () => { modalOpen = false; syncCards(); });

    // Pausing motion also stops a modal video that is already playing; resuming does not restart it
    document.addEventListener("motionchange", () => {
        syncCards();
        if (!running()) modalVideos.forEach((video) => video.pause());
    });
})();
