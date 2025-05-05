// JavaScript for particle effect
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize canvas dynamically
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles(); // Reinitialize particles on resize
});

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
            "#FFC107", // Amber
            "#FFB300", // Darker gold
            "#FFAA00", // Deep orange-gold
            "#F5BF42", // Lighter gold
            "#E6A817"  // Muted gold
        ];
        this.color = goldPalette[Math.floor(Math.random() * goldPalette.length)];

        this.dx = (Math.random() - 0.5) * 2; // Horizontal speed
        this.dy = (Math.random() - 0.5) * 2; // Vertical speed
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        // Boundary bounce
        if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.dy *= -1;

        this.draw();
    }
}

// Initialize particles
function initParticles() {
    particles.length = 0; // Clear existing particles
    const particleCount = 100; // Number of particles

    for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 3 + 1; // Particle size
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const color = "rgba(255, 255, 255, 0.8)"; // White particles
        particles.push(new Particle(x, y, size, color));
    }
}

// Animate particles
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    particles.forEach((particle) => particle.update());
    requestAnimationFrame(animate); // Recursive animation loop
}

// Start the particle system
initParticles();
animate();
