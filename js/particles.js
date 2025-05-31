const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

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

// Resize canvas dynamically
window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles(); // Reinitialize particles on resize
});

// Initial canvas setup
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
        this.alpha = Math.random() * 0.3 + 0.3 // Starting opacity between 0.3 and 0.6
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

        this.draw();
    }
}

// Initialize particles
function initParticles() {
    particles.length = 0;
    
    // Use viewport dimensions for particle distribution
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
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

// Animation loop with proper canvas clearing
function animate() {
    // Clear the entire canvas
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    
    // Update and draw particles
    particles.forEach((particle) => particle.update());
    requestAnimationFrame(animate);
}

// Start the particle system
initParticles();
animate();