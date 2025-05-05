
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

const masterHeader = document.querySelector(".master-header");

// Set canvas size to match the master-header section
function resizeCanvas(){
    //Use getBoundingClientRect to ensure accurate height and width
    const rect = masterHeader.getBoundingClientRect();
    canvas.width = masterHeader.offsetWidth;
    canvas.height = masterHeader.offsetHeight;
}

// Resize canvas dynamically
window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles(); // Reinitialize particles on resize
});

resizeCanvas();

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// // Resize canvas dynamically
// window.addEventListener("resize", () => {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     initParticles(); // Reinitialize particles on resize
// });

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

        this.dx = (Math.random() - 0.5) * 0.5; // Horizontal speed
        this.dy = (Math.random() - 0.5) * 0.5; // Vertical speed

        // Twinkling Properties
        this.alpha = Math.random() * 0.5 + 0.5 // Starting opacity between 0.5 and 1
        this.sizeVariation = Math.random() * 1 + 0.5 // Small size variation
        this.twinkleSpeed = Math.random() * 0.04 + 0.02 // Speed of twinkling effect
    }

    // draw() {
    //     ctx.beginPath();
    //     ctx.arc(this.x, this.y, this.size * this.sizeVariation, 0, Math.PI * 2);
    //     ctx.fillStyle = this.color;
    //     ctx.globalAlpha = this.alpha
    //     ctx.fill();
    //     ctx.closePath();
    // }

    // Add Gradient Colors
    draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * this.sizeVariation);
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

        // Interaction with mouse: Repelling Effect
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            // Push particles away
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * 2; 
            this.y += Math.sin(angle) * 2;
        }

        // Boundary bounce
        if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.dy *= -1;

        this.alpha += (Math.random() - 0.5) * this.twinkleSpeed;
        if (this.alpha > 1) this.alpha = 1;
        if (this.alpha < 0.1) this.alpha = 0.1;

        this.sizeVariation += (Math.random() - 0.5) * 0.1;
        if (this.sizeVariation > 2) this.sizeVariation = 2;
        if (this.sizeVariation < 0.3) this.sizeVariation = 0.3;

        this.draw();
    }
    
}

// Initialize particles
function initParticles() {
    particles.length = 0; // Clear existing particles
    const particleCount = 100; // Number of particles

    for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 4 + 1; // Particle size
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const color = "rgba(255, 255, 255, 0.8)"; // White particles
        particles.push(new Particle(x, y, size, color));
    }
}

// Animate particles
// function animate() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
//     particles.forEach((particle) => particle.update());
//     requestAnimationFrame(animate); // Recursive animation loop
// }

// Motion Trails
function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // Slightly transparent background
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Creates a fading effect
    particles.forEach((particle) => particle.update());
    requestAnimationFrame(animate);
}



// Start the particle system
initParticles();
animate();
