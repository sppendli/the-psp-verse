
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
const masterHeader = document.querySelector(".master-header");

// Set canvas size to match the master-header section
function resizeCanvas(){
    const dpr = window.devicePixelRatio || 1;
    const scrollWidth = document.documentElement.scrollWidth;
    const scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight
    ); // Ensure full document height

    const sizeChanged = canvas.width !== scrollWidth * dpr || canvas.height !== scrollHeight * dpr;
    canvas.style.width = `${scrollWidth}px`;
    canvas.style.height = `${scrollHeight}px`;

    canvas.width = scrollWidth * dpr;
    canvas.height = scrollHeight * dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
}

// Resize canvas dynamically
window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles(); // Reinitialize particles on resize
});

resizeCanvas();

const particles = [];
const mouse = {
    x: null,
    y: null,
    radius: 100 // Interaction radius
};

// Update mouse position
window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Particle class
class Particle {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;

        // Random gold color from palette
        const goldPalette = [
            "#FFD700", // Gold
            "#FFEC80", // Light Gold
            "#FFE066", // Golden Yellow
            "#FFC107", // Amber
            "#F5BF42", // Soft gold
            "#FFFA00"  // Pale gold
        ];
        this.color = goldPalette[Math.floor(Math.random() * goldPalette.length)];

        this.dx = (Math.random() - 0.5) * 0.3; // Horizontal speed
        this.dy = (Math.random() - 0.5) * 0.3; // Vertical speed

        // Twinkling Properties
        this.alpha = Math.random() * 0.3 + 0.3 // Starting opacity between 0.1 and 0.3
        this.sizeVariation = Math.random() * 0.5 + 0.5 // Small size variation
        this.twinkleSpeed = Math.random() * 0.1 + 0.01 // Speed of twinkling effect
    }

    // Add Gradient Colors
    draw() {
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0, 
            this.x, this.y, this.size * this.sizeVariation
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.sizeVariation, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        const dpr = window.devicePixelRatio || 1;
        if (this.x < 0 || this.x > canvas.width / dpr) this.dx *= -1;
        if (this.y < 0 || this.y > canvas.height / dpr) this.dy *= -1;

        this.alpha += (Math.random() - 0.5) * this.twinkleSpeed;
        if (this.alpha > 0.8) this.alpha = 0.8;
        if (this.alpha < 0.4) this.alpha = 0.4;

        this.sizeVariation += (Math.random() - 0.5) * 0.07;
        if (this.sizeVariation > 1.7) this.sizeVariation = 1.7;
        if (this.sizeVariation < 0.7) this.sizeVariation = 0.7;

        this.draw();
    }
    
}

// Initialize particles
function initParticles() {
    particles.length = 0;
    const dpr = window.devicePixelRatio || 1;
    const particleCount = 100; // Uniform distribution

    for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 2 + 2; // 2–4px for visibility
        const x = Math.random() * (canvas.width / dpr);
        const y = Math.random() * (canvas.height / dpr);
        particles.push(new Particle(x, y, size));
    }
}

// Motion Trails
function animate() {
    ctx.fillStyle = "#0a0a0a"
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Creates a fading effect
    particles.forEach((particle) => particle.update());
    requestAnimationFrame(animate);
}

// Start the particle system
initParticles();
animate();
