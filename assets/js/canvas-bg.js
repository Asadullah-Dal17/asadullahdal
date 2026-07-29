/**
 * canvas-bg.js - Floating Varied Interactive Squares
 * Features: Varied sizes, Opacity Pulse, Mouse Repulsion & Connections
 */

(function () {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // Allow individual pages to opt out of the background animation
    // by adding data-no-canvas attribute to <body>
    if (document.body && document.body.dataset.noCanvas) return;


    const ctx = canvas.getContext('2d');
    let width, height;

    // Configuration
    const squareCount = window.innerWidth < 768 ? 50 : 100;
    const minSize = 6;
    const maxSize = 24;
    const baseColor = { r: 76, g: 175, b: 80 }; // #4CAF50

    let squares = [];

    // Mouse
    const mouse = { x: null, y: null };
    const hoverRadius = 180;
    const connectionRadius = 150;

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Square {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.size = Math.floor(minSize + Math.random() * (maxSize - minSize));
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + this.size;

            this.baseSpeed = 0.2 + Math.random() * 0.5;
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = -this.baseSpeed;

            this.opacity = Math.random() * 0.5;
            this.opacitySpeed = 0.005 + Math.random() * 0.01;
            this.opacityDir = Math.random() > 0.5 ? 1 : -1;
        }

        update() {
            // Normal movement
            this.x += this.vx;
            this.y += this.vy;

            // Pulse opacity
            this.opacity += this.opacitySpeed * this.opacityDir;
            if (this.opacity >= 0.3) {
                this.opacity = 0.3;
                this.opacityDir = -1;
            }
            if (this.opacity <= 0.05) {
                this.opacity = 0.05;
                this.opacityDir = 1;
            }

            // Reset if off top
            if (this.y < -this.size) {
                this.reset();
            }
            // Wrap X
            if (this.x > width) this.x = 0;
            if (this.x < 0) this.x = width;

            // --- MOUSE TRACKING / REPULSION ---
            if (mouse.x != null) {
                const cx = this.x + this.size / 2;
                const cy = this.y + this.size / 2;
                const dx = mouse.x - cx;
                const dy = mouse.y - cy;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < hoverRadius) {
                    // Calculate force density
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (hoverRadius - distance) / hoverRadius;

                    // Push away!
                    const repulsionStrength = 2; // Strength of push
                    this.x -= forceDirectionX * force * repulsionStrength;
                    this.y -= forceDirectionY * force * repulsionStrength;
                }
            }
        }

        draw() {
            let drawOpacity = this.opacity;

            // Calculate distance to mouse for Glow & Connections
            let distToMouse = 9999;
            if (mouse.x != null) {
                const cx = this.x + this.size / 2;
                const cy = this.y + this.size / 2;
                const dx = mouse.x - cx;
                const dy = mouse.y - cy;
                distToMouse = Math.sqrt(dx * dx + dy * dy);

                if (distToMouse < hoverRadius) {
                    drawOpacity += (1 - distToMouse / hoverRadius) * 0.7;
                }
            }

            if (drawOpacity > 1) drawOpacity = 1;

            ctx.fillStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${drawOpacity})`;
            ctx.fillRect(this.x, this.y, this.size, this.size);

            // Border for Tech look
            if (this.size > 15) {
                ctx.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${drawOpacity * 1.5})`;
                ctx.lineWidth = 1;
                ctx.strokeRect(this.x, this.y, this.size, this.size);
            }

            // --- DRAW CONNECTIONS ---
            // 1. Connect to Mouse
            if (mouse.x != null && distToMouse < connectionRadius) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${0.4 * (1 - distToMouse / connectionRadius)})`;
                ctx.lineWidth = 1;
                ctx.moveTo(this.x + this.size / 2, this.y + this.size / 2);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }

    function init() {
        squares = [];
        for (let i = 0; i < squareCount; i++) {
            squares.push(new Square());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        squares.forEach(sq => {
            sq.update();
            sq.draw();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        init();
    });

    resize();
    init();
    animate();
})();
