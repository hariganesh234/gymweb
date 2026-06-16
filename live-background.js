(function() {
    const canvas = document.getElementById('aurora-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Mouse coordinates tracker
    let mouseX = -9999;
    let mouseY = -9999;
    let targetMouseX = -9999;
    let targetMouseY = -9999;
    
    document.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
    });
    
    // Lerp mouse coordinates for buttery smooth movement
    function lerpMouse() {
        if (mouseX === -9999) {
            mouseX = targetMouseX;
            mouseY = targetMouseY;
        } else {
            mouseX += (targetMouseX - mouseX) * 0.08;
            mouseY += (targetMouseY - mouseY) * 0.08;
        }
    }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // 1. Muscle Fiber Bundles (Kinetic Force Vectors)
    const fibers = [];
    const fiberCount = 8;
    for (let i = 0; i < fiberCount; i++) {
        fibers.push({
            xOffset: Math.random() * width,
            speed: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
            frequency: Math.random() * 0.002 + 0.001,
            amplitude: Math.random() * 40 + 20,
            phase: Math.random() * Math.PI * 2,
            color: i % 2 === 0 ? 'rgba(226, 182, 92, 0.06)' : 'rgba(99, 102, 241, 0.04)',
            lineWidth: Math.random() * 1.5 + 0.5
        });
    }

    // 2. Biomechanical Joint Nodes (Skeletal Grid)
    const nodes = [];
    const nodeCount = Math.min(30, Math.floor((width * height) / 45000));
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() * 2 + 1.5,
            baseRadius: Math.random() * 2 + 1.5,
            pulseOffset: Math.random() * Math.PI * 2,
            glowIntensity: 0
        });
    }

    // 3. Kinetic Energy Sparks (Sweat/ATP Sparks traveling along fibers)
    const sparks = [];
    const sparkCount = 40;
    for (let i = 0; i < sparkCount; i++) {
        sparks.push({
            x: Math.random() * width,
            y: Math.random() * height,
            speed: Math.random() * 1.2 + 0.6,
            size: Math.random() * 1.5 + 0.5,
            angle: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.5 + 0.2,
            color: Math.random() < 0.7 ? '#E2B65C' : '#F59E0B' // Gold or Amber
        });
    }

    // Click wave force (contractions)
    let contractionWaves = [];
    document.addEventListener('mousedown', (e) => {
        contractionWaves.push({
            x: e.clientX,
            y: e.clientY,
            radius: 0,
            maxRadius: Math.max(width, height) * 0.6,
            speed: 8,
            opacity: 0.15
        });
    });

    // Background animation frame loop
    function animate() {
        lerpMouse();
        
        // Fading trail adapts to light/dark circadian themes
        const isNight = document.body.classList.contains('night-active');
        ctx.fillStyle = isNight ? 'rgba(6, 7, 7, 0.12)' : 'rgba(245, 247, 246, 0.12)';
        ctx.fillRect(0, 0, width, height);

        const time = Date.now();

        // 1. Draw contraction ripple waves (muscular impulses)
        contractionWaves.forEach((wave, index) => {
            wave.radius += wave.speed;
            wave.opacity -= 0.003;
            
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(226, 182, 92, ${wave.opacity})`;
            ctx.lineWidth = 2.5;
            ctx.stroke();

            if (wave.opacity <= 0 || wave.radius >= wave.maxRadius) {
                contractionWaves.splice(index, 1);
            }
        });

        // 2. Draw Muscle Fiber Bundles (Flowing Bezier Paths)
        fibers.forEach(fiber => {
            fiber.phase += fiber.speed;
            
            ctx.beginPath();
            ctx.strokeStyle = fiber.color;
            ctx.lineWidth = fiber.lineWidth;
            
            ctx.moveTo(fiber.xOffset, 0);
            
            const steps = 12;
            for (let i = 0; i <= steps; i++) {
                const y = (height / steps) * i;
                // Base sine wave
                let x = fiber.xOffset + Math.sin(y * fiber.frequency + fiber.phase) * fiber.amplitude;
                
                // Mouse pull deformation (recruitment)
                if (targetMouseX !== -9999) {
                    const dy = targetMouseY - y;
                    const dx = targetMouseX - x;
                    const dist = Math.abs(dy); // pull fibers horizontally near mouse y
                    if (dist < 200) {
                        const force = (200 - dist) / 200;
                        x += dx * force * 0.18;
                    }
                }
                
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        });

        // 3. Update & Draw Biomechanical Skeletal Nodes
        nodes.forEach((node, i) => {
            // Pulse node size slowly
            node.radius = node.baseRadius + Math.sin(time * 0.002 + node.pulseOffset) * 0.6;
            
            // Kinetic movement
            node.x += node.vx;
            node.y += node.vy;

            // Boundaries bounce
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;

            // Mouse proximity glowing activation
            if (targetMouseX !== -9999) {
                const dx = targetMouseX - node.x;
                const dy = targetMouseY - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    node.glowIntensity += (1 - dist / 180 - node.glowIntensity) * 0.1;
                } else {
                    node.glowIntensity += (0 - node.glowIntensity) * 0.05;
                }
            }

            // Draw joint nodes
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius + (node.glowIntensity * 1.5), 0, Math.PI * 2);
            ctx.fillStyle = node.glowIntensity > 0.1
                ? `rgba(226, 182, 92, ${0.4 + node.glowIntensity * 0.4})`
                : (isNight ? 'rgba(255, 255, 255, 0.15)' : 'rgba(30, 34, 32, 0.15)');
            ctx.fill();

            // Highlight connections (Skeletal linkages)
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = node.x - nodes[j].x;
                const dy = node.y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    const alpha = ((120 - dist) / 120) * (0.05 + Math.max(node.glowIntensity, nodes[j].glowIntensity) * 0.12);
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    
                    // Golden glow for active/engaged skeletal chains
                    ctx.strokeStyle = node.glowIntensity > 0.2 || nodes[j].glowIntensity > 0.2
                        ? `rgba(226, 182, 92, ${alpha})`
                        : (isNight ? `rgba(255, 255, 255, ${alpha * 0.5})` : `rgba(30, 34, 32, ${alpha * 0.5})`);
                    ctx.lineWidth = node.glowIntensity > 0.2 || nodes[j].glowIntensity > 0.2 ? 0.9 : 0.5;
                    ctx.stroke();
                }
            }
        });

        // 4. Update & Draw Kinetic Energy Sparks (moving along flow lines)
        sparks.forEach(spark => {
            // Apply slight sinusoidal weave along path
            spark.y += Math.sin(time * 0.003 + spark.x * 0.01) * 0.2;
            spark.x += Math.cos(spark.angle) * spark.speed;
            spark.y += Math.sin(spark.angle) * spark.speed;

            // Proximity mouse speed-up (kinetic excitation)
            if (targetMouseX !== -9999) {
                const dx = targetMouseX - spark.x;
                const dy = targetMouseY - spark.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    const push = (180 - dist) / 180;
                    spark.x += (dx / dist) * push * 0.8;
                    spark.y += (dy / dist) * push * 0.8;
                }
            }

            // Draw glowing spark
            ctx.beginPath();
            ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
            ctx.fillStyle = spark.color;
            ctx.fill();

            // Reset sparks that go off-screen
            if (spark.x < 0 || spark.x > width || spark.y < 0 || spark.y > height) {
                spark.x = Math.random() * width;
                spark.y = Math.random() * height;
                spark.opacity = Math.random() * 0.5 + 0.2;
            }
        });

        requestAnimationFrame(animate);
    }
    animate();

    // Hover card coordinates tracker (optimized run in event listener)
    const cardSelector = '.glass-card, .case-card, .career-card, .resource-card, .testimonial-card, .about-visual, .class-card, .accordion-item, .metric-card, .story-img-card, .trainer-profile-section, .slot-btn';
    
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll(cardSelector);
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (e.clientX >= rect.left - 120 && e.clientX <= rect.right + 120 &&
                e.clientY >= rect.top - 120 && e.clientY <= rect.bottom + 120) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x-card', `${x}px`);
                card.style.setProperty('--mouse-y-card', `${y}px`);
            }
        });
    });
})();
