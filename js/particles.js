(function () {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = null;
    let resizeTimer = null;
    let seededWidth = 0;
    let seededHeight = 0;

    // Set canvas size to match the viewport
    function resizeCanvas(){
        const dpr = window.devicePixelRatio || 1;

        // Use viewport dimensions instead of scroll dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Set canvas display size (CSS pixels)
        canvas.style.width = `${viewportWidth}px`;
        canvas.style.height = `${viewportHeight}px`;

        // Set canvas actual size (device pixels)
        canvas.width = viewportWidth * dpr;
        canvas.height = viewportHeight * dpr;

        // Scale the drawing context to account for device pixel ratio
        ctx.scale(dpr, dpr);
    }

    // Random gold color from palette
    const goldPalette = [
        "#FFD700", // Gold
        "#FFEC80", // Light Gold
        "#FFE066", // Golden Yellow
        "#FFC107", // Amber
        "#F5BF42", // Soft gold
        "#FFFA00"  // Pale gold
    ];

    // Pre-render each palette colour's glow once; particles scale it with drawImage
    // instead of building a radial gradient per particle per frame.
    const spriteSize = 64;
    const sprites = goldPalette.map((color) => {
        const sprite = document.createElement("canvas");
        sprite.width = spriteSize;
        sprite.height = spriteSize;
        const spriteCtx = sprite.getContext("2d");
        const half = spriteSize / 2;
        const gradient = spriteCtx.createRadialGradient(half, half, 0, half, half, half);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        spriteCtx.fillStyle = gradient;
        spriteCtx.beginPath();
        spriteCtx.arc(half, half, half, 0, Math.PI * 2);
        spriteCtx.fill();
        return sprite;
    });

    const particles = [];

    // Particle class
    class Particle {
        constructor(x, y, size) {
            this.x = x;
            this.y = y;
            this.size = size;

            this.sprite = sprites[Math.floor(Math.random() * sprites.length)];

            this.dx = (Math.random() - 0.5) * 0.3; // Horizontal speed
            this.dy = (Math.random() - 0.5) * 0.3; // Vertical speed

            // Twinkling Properties
            this.alpha = Math.random() * 0.3 + 0.3 // Starting opacity between 0.3 and 0.6
            this.sizeVariation = Math.random() * 0.5 + 0.5 // Small size variation
            this.twinkleSpeed = Math.random() * 0.1 + 0.01 // Speed of twinkling effect
        }

        draw() {
            const radius = this.size * this.sizeVariation;
            ctx.globalAlpha = this.alpha;
            ctx.drawImage(this.sprite, this.x - radius, this.y - radius, radius * 2, radius * 2);
        }

        update() {
            this.x += this.dx;
            this.y += this.dy;

            // Use viewport dimensions for boundary checking
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            if (this.x < 0 || this.x > viewportWidth) this.dx *= -1;
            if (this.y < 0 || this.y > viewportHeight) this.dy *= -1;

            // Twinkling effect
            this.alpha += (Math.random() - 0.5) * this.twinkleSpeed;
            if (this.alpha > 0.8) this.alpha = 0.8;
            if (this.alpha < 0.4) this.alpha = 0.4;

            this.sizeVariation += (Math.random() - 0.5) * 0.07;
            if (this.sizeVariation > 1.7) this.sizeVariation = 1.7;
            if (this.sizeVariation < 0.7) this.sizeVariation = 0.7;
        }
    }

    // Initialize particles
    function initParticles() {
        particles.length = 0;

        // Use viewport dimensions for particle distribution
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        seededWidth = viewportWidth;
        seededHeight = viewportHeight;

        // Adjust particle count based on screen size
        let particleCount = 100;
        if (viewportWidth < 768) {
            particleCount = 60; // Fewer particles on mobile for better performance
        } else if (viewportWidth < 1200) {
            particleCount = 80; // Medium count for tablets
        }

        for (let i = 0; i < particleCount; i++) {
            const size = Math.random() * 2 + 2; // 2–4px for visibility
            const x = Math.random() * viewportWidth;
            const y = Math.random() * viewportHeight;
            particles.push(new Particle(x, y, size));
        }
    }

    // Clear the entire canvas
    function clearCanvas() {
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    // One still frame, used when the visitor prefers reduced motion
    function drawStill() {
        clearCanvas();
        particles.forEach((particle) => particle.draw());
    }

    // Animation loop with proper canvas clearing
    function animate() {
        clearCanvas();

        // Update and draw particles
        particles.forEach((particle) => {
            particle.update();
            particle.draw();
        });
        frameId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (frameId === null) frameId = requestAnimationFrame(animate);
    }

    function stopAnimation() {
        if (frameId !== null) {
            cancelAnimationFrame(frameId);
            frameId = null;
        }
    }

    // Run only when motion is allowed and the tab is visible
    function syncAnimation() {
        if (reducedMotion.matches) {
            stopAnimation();
            drawStill();
        } else if (document.hidden) {
            stopAnimation();
        } else {
            startAnimation();
        }
    }

    // Resize canvas dynamically, once the resizing settles
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resizeCanvas();
            // Re-seed only on a real size change; mobile URL-bar show/hide fires
            // small height-only resizes that should not scramble the particles
            if (window.innerWidth !== seededWidth || Math.abs(window.innerHeight - seededHeight) > 150) {
                initParticles();
            }
            if (reducedMotion.matches) drawStill();
        }, 150);
    });

    reducedMotion.addEventListener("change", syncAnimation);
    document.addEventListener("visibilitychange", syncAnimation);

    // Start the particle system
    resizeCanvas();
    initParticles();
    syncAnimation();
})();
