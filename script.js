document.addEventListener('DOMContentLoaded', () => {
    const studioCanvas = document.getElementById('studio-canvas');
    const studioCtx = studioCanvas.getContext('2d');
    const labCanvas = document.getElementById('lab-canvas');
    const labCtx = labCanvas.getContext('2d');

    let studioMouse = { x: -1000, y: -1000 };
    let labMouse = { x: -1000, y: -1000 };

    const labSection = document.getElementById('lab-section');
    const studioSection = document.getElementById('studio-section');

    studioSection.addEventListener('mousemove', (e) => {
        const rect = studioSection.getBoundingClientRect();
        studioMouse.x = e.clientX - rect.left;
        studioMouse.y = e.clientY - rect.top;
    });

    studioSection.addEventListener('mouseleave', () => {
        studioMouse.x = -1000;
        studioMouse.y = -1000;
    });

    labSection.addEventListener('mousemove', (e) => {
        const rect = labSection.getBoundingClientRect();
        labMouse.x = e.clientX - rect.left;
        labMouse.y = e.clientY - rect.top;
    });

    labSection.addEventListener('mouseleave', () => {
        labMouse.x = -1000;
        labMouse.y = -1000;
    });

    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const canvas = entry.target.querySelector('canvas');
            if (canvas) {
                canvas.width = entry.contentRect.width;
                canvas.height = entry.contentRect.height;
            }
        }
    });

    resizeObserver.observe(studioSection);
    resizeObserver.observe(labSection);

    // ===============================
    // STUDIO - Custom SVG Shapes with flat colors
    // ===============================
    const studioColors = ['#3A29C0', '#EC622B', '#D49FF9', '#F4B048'];

    // SVG path data for each shape (normalized to 96x96 viewBox)
    const shapePaths = [
        // 0: circle-half-double
        {
            paths: [
                'M4,48c0,24.3005,19.6995,44,44,44V4C23.6995,4,4,23.6995,4,48Z',
                'M48,48c0,24.3005,19.6995,44,44,44V4c-24.3005,0-44,19.6995-44,44Z'
            ]
        },
        // 1: clover-x
        {
            paths: [
                'M70.3098,48c6.3913-2.4813,12.402-6.1485,15.7746-9.5211,7.8876-7.8875,7.8875-20.6757,0-28.5633-7.8875-7.8875-20.6757-7.8875-28.5632,0-3.3726,3.3726-7.0399,9.3833-9.5211,15.7746-2.4813-6.3913-6.1485-12.402-9.5211-15.7746-7.8875-7.8875-20.6757-7.8875-28.5632,0-7.8875,7.8875-7.8876,20.6757,0,28.5633,3.3726,3.3726,9.3833,7.0398,15.7746,9.5211-6.3913,2.4813-12.402,6.1485-15.7746,9.521-7.8876,7.8876-7.8875,20.6758,0,28.5633,7.8875,7.8875,20.6757,7.8875,28.5632,0,3.3726-3.3726,7.0399-9.3833,9.5211-15.7746,2.4813,6.3913,6.1485,12.402,9.5211,15.7746,7.8875,7.8875,20.6757,7.8875,28.5632,0,7.8875-7.8875,7.8876-20.6757,0-28.5633-3.3726-3.3726-9.3833-7.0398-15.7746-9.521Z'
            ]
        },
        // 2: corner-radius
        {
            paths: [
                'M4,4v88h0c48.601,0,87.9999-39.3989,87.9999-87.9999h0s-88,0-88,0Z'
            ]
        },
        // 3: ellipse-stack
        {
            paths: [
                'M83.2006,60c5.5243,3.3427,8.7994,7.4973,8.7994,12,0,11.0457-19.6995,20-44,20S4,83.0457,4,72c0-4.5027,3.2751-8.6573,8.7994-12-5.5243-3.3427-8.7994-7.4973-8.7994-12s3.2751-8.6573,8.7994-12c-5.5243-3.3427-8.7994-7.4973-8.7994-12C4,12.9543,23.6995,4,48,4s44,8.9543,44,20c0,4.5027-3.2751,8.6573-8.7994,12,5.5243,3.3427,8.7994,7.4973,8.7994,12s-3.2751,8.6573-8.7994,12Z'
            ]
        },
        // 4: leaf-grow
        {
            paths: [
                'M92,36c0,24.3005-19.6995,44-43.9999,44h0s0,0,0,0c-24.3005,0-43.9999-19.6995-43.9999-44,12.6329,0,24.014,5.332,32.0388,13.8586-.4346-12.6086,3.548-25.4454,11.9612-33.8586,8.4132,8.4132,12.3958,21.25,11.9612,33.8586,8.0247-8.5266,19.4058-13.8586,32.0388-13.8586Z'
            ]
        },
        // 5: parallelogram-double
        {
            paths: [
                'M72,44h20l-24,48H4l20-40H4L28,4h64l-20,40Z'
            ]
        },
        // 6: splash
        {
            paths: [
                'M82.2249,30.5474c5.9208-3.3233,9.7751-9.3878,9.7751-16.1776v-.5508c0-5.4229-4.3962-9.8191-9.8192-9.8191h-1.8141c-4.39,0-8.1419,2.945-9.4457,7.1368-3.0387,9.7697-12.1515,16.8632-22.921,16.8632s-19.8823-7.0935-22.921-16.8632c-1.3038-4.1918-5.0557-7.1368-9.4457-7.1368h-1.8141c-5.423,0-9.8192,4.3962-9.8192,9.8191v.5508c0,6.7897,3.8542,12.8542,9.7751,16.1776,6.1018,3.425,10.2249,9.9573,10.2249,17.4526s-4.1231,14.0276-10.2249,17.4525c-5.9208,3.3234-9.7751,9.3879-9.7751,16.1776v.5507c0,5.423,4.3962,9.8192,9.8192,9.8192h.8141c4.39,0,8.1419-2.945,9.4457-7.1369,3.0387-9.7696,12.1515-16.8631,22.921-16.8631.3354,0,.668.0117,1,.0253.332-.0136.6646-.0253,1-.0253,10.7695,0,19.8823,7.0935,22.921,16.8631,1.3038,4.1919,5.0557,7.1369,9.4457,7.1369h.8141c5.423,0,9.8192-4.3962,9.8192-9.8192v-.5507c0-6.7897-3.8542-12.8542-9.7751-16.1776-6.1018-3.4249-10.2249-9.9572-10.2249-17.4525s4.1231-14.0276,10.2249-17.4526Z'
            ]
        },
        // 7: sun-rectangle
        {
            paths: [
                'M92,52h-29.0718l25.1769,14.5359-4,6.9282-25.1769-14.5359,14.5359,25.1769-6.9282,4-14.5359-25.1769v29.0718h-8v-29.0718l-14.5359,25.1769-6.9282-4,14.5359-25.1769-25.1769,14.5359-4-6.9282,25.1769-14.5359H4v-8h29.0718L7.8949,29.4641l4-6.9282,25.1769,14.5359-14.5359-25.1769,6.9282-4,14.5359,25.1769V4h8v29.0718l14.5359-25.1769,6.9282,4-14.5359,25.1769,25.1769-14.5359,4,6.9282-25.1769,14.5359h29.0718v8Z'
            ]
        },
        // 8: triangle-rounded-pattern
        {
            paths: [
                'M4,48V4h44c0,24.3005-19.6995,44-44,44ZM48,4c0,24.3005,19.6995,44,44,44V4h-44ZM4,92c24.3005,0,44-19.6995,44-44H4v44ZM92,92v-44h-44c0,24.3005,19.6995,44,44,44Z'
            ]
        },
        // 9: x shape
        {
            paths: [
                'M73.4225,47.9999c15.2218,18.6479,22.4507,35.9617,16.4949,41.9175s-23.2695-1.2733-41.9175-16.495c-18.6479,15.2217-35.9617,22.4508-41.9175,16.495s1.2731-23.2696,16.4949-41.9175C7.3557,29.352.1267,12.0383,6.0825,6.0825s23.2695,1.2732,41.9175,16.4949C66.6479,7.3557,83.9617.1267,89.9175,6.0825s-1.2731,23.2695-16.4949,41.9174Z'
            ]
        }
    ];

    // Create Path2D objects for better performance
    const path2DShapes = shapePaths.map(shape => {
        return shape.paths.map(pathData => new Path2D(pathData));
    });

    class SVGShape {
        constructor(w, h) {
            this.reset(w, h, true);
        }

        reset(w, h, initial = false) {
            this.shapeIndex = Math.floor(Math.random() * path2DShapes.length);
            this.size = Math.random() * 60 + 30; // 30-90px
            this.scale = this.size / 96; // Original viewBox is 96x96
            
            this.x = initial ? Math.random() * (w + this.size) - this.size/2 : -this.size;
            this.y = Math.random() * h;
            
            this.speedX = Math.random() * 0.6 + 0.2;
            this.speedY = (Math.random() - 0.5) * 0.2;
            
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.01;
            
            this.color = studioColors[Math.floor(Math.random() * studioColors.length)];
            
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            this.wobbleAmount = Math.random() * 15 + 5;
        }

        update(w, h, mouseX, mouseY) {
            this.x += this.speedX;
            this.wobble += this.wobbleSpeed;
            this.y += Math.sin(this.wobble) * 0.3 + this.speedY;
            this.rotation += this.rotationSpeed;

            // Mouse interaction - shapes drift away gently
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120 && dist > 0) {
                const force = (120 - dist) / 120;
                this.x -= (dx / dist) * force * 1.5;
                this.y -= (dy / dist) * force * 1.5;
                this.rotationSpeed += force * 0.002;
            }

            // Reset when out of bounds
            if (this.x > w + this.size) {
                this.reset(w, h);
            }
            if (this.y < -this.size) this.y = h + this.size;
            if (this.y > h + this.size) this.y = -this.size;
        }

        draw(ctx) {
            ctx.save();
            
            // Move to position and apply transforms
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(this.scale, this.scale);
            // Center the shape (original is 96x96)
            ctx.translate(-48, -48);
            
            ctx.fillStyle = this.color;
            
            // Draw all paths for this shape
            const paths = path2DShapes[this.shapeIndex];
            paths.forEach(path => {
                ctx.fill(path);
            });
            
            ctx.restore();
        }
    }

    let svgShapes = [];

    function initStudio() {
        const w = studioCanvas.width || window.innerWidth / 2;
        const h = studioCanvas.height || window.innerHeight;

        svgShapes = [];
        const count = Math.floor((w * h) / 20000); // Density based on area

        for (let i = 0; i < Math.max(count, 25); i++) {
            svgShapes.push(new SVGShape(w, h));
        }

        // Sort by size for layering (bigger behind)
        svgShapes.sort((a, b) => b.size - a.size);
    }

    function animateStudio() {
        const w = studioCanvas.width;
        const h = studioCanvas.height;

        if (w === 0 || h === 0) {
            requestAnimationFrame(animateStudio);
            return;
        }

        // White background
        studioCtx.fillStyle = '#ffffff';
        studioCtx.fillRect(0, 0, w, h);

        svgShapes.forEach(shape => {
            shape.update(w, h, studioMouse.x, studioMouse.y);
            shape.draw(studioCtx);
        });

        requestAnimationFrame(animateStudio);
    }

    // ===============================
    // LAB - Premium deep black with wavy depth particles
    // ===============================
    class DepthParticle {
        constructor(w, h) {
            this.reset(w, h, true);
        }

        reset(w, h, initial = false) {
            // Depth layer (0 = far/dim, 1 = close/bright)
            this.depth = Math.random();
            
            // Size based on depth
            this.baseSize = this.depth * 3 + 0.5;
            this.size = this.baseSize;
            
            // Position
            this.x = Math.random() * w;
            this.y = initial ? Math.random() * h : h + 20;
            
            // Movement - slower for distant particles
            this.baseSpeedY = -(this.depth * 0.4 + 0.1);
            this.speedY = this.baseSpeedY;
            
            // Wave properties
            this.waveOffset = Math.random() * Math.PI * 2;
            this.waveSpeed = Math.random() * 0.02 + 0.01;
            this.waveAmplitude = (1 - this.depth) * 30 + 10;
            
            // Opacity based on depth
            this.baseOpacity = this.depth * 0.6 + 0.1;
            this.opacity = this.baseOpacity;
            
            // Pulse
            this.pulseOffset = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.03 + 0.01;
        }

        update(w, h, mouseX, mouseY, time) {
            this.y += this.speedY;
            this.x += Math.sin(time * this.waveSpeed + this.waveOffset) * (this.waveAmplitude * 0.02);
            this.size = this.baseSize * (1 + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.3);
            
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 200) {
                const force = (200 - dist) / 200;
                this.x += dx * force * 0.02;
                this.y += dy * force * 0.02;
                this.opacity = Math.min(1, this.baseOpacity + force * 0.5);
                this.size = this.baseSize * (1 + force * 0.8);
            } else {
                this.opacity = this.baseOpacity;
            }
            
            if (this.y < -20) {
                this.reset(w, h);
            }
        }

        draw(ctx) {
            if (this.depth > 0.5) {
                ctx.shadowBlur = this.depth * 15;
                ctx.shadowColor = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
            }
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
            
            ctx.shadowBlur = 0;
        }
    }

    class WaveLine {
        constructor(w, h, index, total) {
            this.w = w;
            this.h = h;
            this.yBase = (h / (total + 1)) * (index + 1);
            this.amplitude = 30 + Math.random() * 20;
            this.frequency = 0.003 + Math.random() * 0.002;
            this.speed = 0.0005 + Math.random() * 0.0005;
            this.offset = Math.random() * Math.PI * 2;
            this.opacity = 0.03 + Math.random() * 0.02;
        }

        draw(ctx, time) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.lineWidth = 1;
            
            for (let x = 0; x <= this.w; x += 5) {
                const y = this.yBase + 
                    Math.sin(x * this.frequency + time * this.speed + this.offset) * this.amplitude +
                    Math.sin(x * this.frequency * 2 + time * this.speed * 1.5) * (this.amplitude * 0.3);
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
        }
    }

    class GlowTrail {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 8 + 4;
            this.life = 1;
            this.decay = 0.02 + Math.random() * 0.02;
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1 - 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            this.size *= 0.97;
        }

        draw(ctx) {
            if (this.life <= 0) return;
            
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${this.life * 0.4})`);
            gradient.addColorStop(0.5, `rgba(200, 200, 255, ${this.life * 0.2})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    let depthParticles = [];
    let waveLines = [];
    let glowTrails = [];
    let labTime = 0;
    let lastTrailTime = 0;

    function initLab() {
        const w = labCanvas.width || window.innerWidth / 2;
        const h = labCanvas.height || window.innerHeight;

        depthParticles = [];
        waveLines = [];

        for (let i = 0; i < 150; i++) {
            depthParticles.push(new DepthParticle(w, h));
        }

        depthParticles.sort((a, b) => a.depth - b.depth);

        for (let i = 0; i < 5; i++) {
            waveLines.push(new WaveLine(w, h, i, 5));
        }
    }

    function animateLab() {
        const w = labCanvas.width;
        const h = labCanvas.height;

        if (w === 0 || h === 0) {
            requestAnimationFrame(animateLab);
            return;
        }

        labTime++;

        const bgGradient = labCtx.createRadialGradient(
            w / 2, h / 2, 0,
            w / 2, h / 2, Math.max(w, h)
        );
        bgGradient.addColorStop(0, '#050508');
        bgGradient.addColorStop(1, '#000000');
        labCtx.fillStyle = bgGradient;
        labCtx.fillRect(0, 0, w, h);

        waveLines.forEach(line => {
            line.draw(labCtx, labTime);
        });

        const now = Date.now();
        if (now - lastTrailTime > 50 && labMouse.x > 0 && labMouse.y > 0) {
            glowTrails.push(new GlowTrail(labMouse.x, labMouse.y));
            lastTrailTime = now;
        }

        for (let i = glowTrails.length - 1; i >= 0; i--) {
            glowTrails[i].update();
            glowTrails[i].draw(labCtx);
            if (glowTrails[i].life <= 0) {
                glowTrails.splice(i, 1);
            }
        }

        depthParticles.forEach(p => {
            p.update(w, h, labMouse.x, labMouse.y, labTime);
            p.draw(labCtx);
        });

        if (labMouse.x > 0 && labMouse.y > 0) {
            const mouseGlow = labCtx.createRadialGradient(
                labMouse.x, labMouse.y, 0,
                labMouse.x, labMouse.y, 150
            );
            mouseGlow.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
            mouseGlow.addColorStop(0.3, 'rgba(255, 255, 255, 0.03)');
            mouseGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            labCtx.fillStyle = mouseGlow;
            labCtx.beginPath();
            labCtx.arc(labMouse.x, labMouse.y, 150, 0, Math.PI * 2);
            labCtx.fill();
        }

        requestAnimationFrame(animateLab);
    }

    // Initialize
    setTimeout(() => {
        initStudio();
        initLab();
        animateStudio();
        animateLab();
    }, 100);

    window.addEventListener('resize', () => {
        setTimeout(() => {
            initStudio();
            initLab();
        }, 100);
    });
});
