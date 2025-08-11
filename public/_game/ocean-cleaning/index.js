const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const gameOverDiv = document.getElementById('gameOver');
        
        // --- Detecção de dispositivo de toque ---
        function isTouchDevice() {
            return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        }

        if (isTouchDevice()) {
            document.body.classList.add('touch-device');
        }

        // --- Funções de Responsividade ---
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (submarine) { // Se o jogo já começou, reposiciona o submarino
                 submarine.y = canvas.height / 2;
            }
        }
        window.addEventListener('resize', resizeCanvas);
        
        // Estado do jogo
        let gameState = {
            running: true,
            trashCollected: 0,
        };
        
        // Submarino
        let submarine = {
            x: 100,
            y: 0, // Será definido no initGame
            width: 60, // Dimensões originais
            height: 30,
            vx: 0,
            vy: 0,
            speed: 0.4, 
            friction: 0.94,
            angle: 0,
            collectRange: 80
        };
        
        let backgroundX = 0;
        const backgroundScrollSpeed = 0.5;
        
        let fish = [], trash = [], particles = [], bubbles = [];
        let keys = {};
        
        // --- Inicialização do Jogo ---
        function initGame() {
            resizeCanvas(); // Define o tamanho inicial do canvas

            submarine.x = 100;
            submarine.y = canvas.height / 2;
            submarine.vx = 0;
            submarine.vy = 0;
            submarine.angle = 0;
            gameState.running = true;
            gameState.trashCollected = 0;
            
            backgroundX = 0;
            
            fish = [];
            trash = [];
            particles = [];
            bubbles = [];
            
            gameOverDiv.style.display = 'none';
            
            for (let i = 0; i < 5; i++) createFish();
            for (let i = 0; i < 15; i++) createTrash();
            for (let i = 0; i < 20; i++) createBubble();
            
            updateUI();
        }
        
        // --- Funções de Criação de Objetos ---
        function createFish() {
            const fishTypes = ['🐟', '🐠', '🐡', '🦈', '🐙', '🦑', '🐢'];
            fish.push({
                x: canvas.width + Math.random() * 200,
                y: 50 + Math.random() * (canvas.height - 100),
                size: 30 + Math.random() * 20,
                speed: 1 + Math.random() * 2,
                type: fishTypes[Math.floor(Math.random() * fishTypes.length)],
                direction: Math.random() > 0.5 ? 1 : -1,
                amplitude: 20 + Math.random() * 30,
                frequency: 0.02 + Math.random() * 0.03,
                phase: Math.random() * Math.PI * 2
            });
        }
        
        function createTrash() {
            const trashTypes = ['🗑️', '🥤', '🍾', '🛍️', '📦', '⚙️', '🔋'];
            trash.push({
                x: canvas.width + Math.random() * canvas.width,
                y: 50 + Math.random() * (canvas.height - 100),
                size: 25 + Math.random() * 10,
                speed: 0.5 + Math.random() * 1,
                type: trashTypes[Math.floor(Math.random() * trashTypes.length)],
                collected: false,
                bobOffset: Math.random() * Math.PI * 2
            });
        }
        
        function createBubble() {
            bubbles.push({
                x: Math.random() * canvas.width,
                y: canvas.height + Math.random() * 100,
                size: 5 + Math.random() * 15,
                speed: 0.5 + Math.random() * 1.5,
                opacity: 0.3 + Math.random() * 0.4
            });
        }
        
        function createExplosion(x, y) {
            for (let i = 0; i < 20; i++) {
                particles.push({
                    x: x, y: y,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    life: 30, maxLife: 30,
                    color: `hsl(${Math.random() * 60 + 10}, 100%, 50%)`
                });
            }
        }
        
        // --- Lógica de Atualização ---
        function update() {
            if (!gameState.running) return;
            
            // Mover submarino (teclado)
            if (keys['w'] || keys['arrowup']) submarine.vy -= submarine.speed;
            if (keys['s'] || keys['arrowdown']) submarine.vy += submarine.speed;
            if (keys['a'] || keys['arrowleft']) submarine.vx -= submarine.speed;
            if (keys['d'] || keys['arrowright']) submarine.vx += submarine.speed;
            
            // Mover submarino (joystick)
            if (joystick.active) {
                submarine.vx += joystick.x * submarine.speed;
                submarine.vy += joystick.y * submarine.speed;
            }

            submarine.vx *= submarine.friction;
            submarine.vy *= submarine.friction;
            submarine.x += submarine.vx;
            submarine.y += submarine.vy;

            if (Math.abs(submarine.vx) > 0.1 || Math.abs(submarine.vy) > 0.1) {
                submarine.angle = Math.atan2(submarine.vy, submarine.vx);
            }
            
            // Limites da tela
            if (submarine.y <= submarine.height/2 || submarine.y >= canvas.height - submarine.height/2) {
                gameOver("Impacto com os limites da missão!");
                return;
            }
            submarine.x = Math.max(submarine.width/2, Math.min(canvas.width - submarine.width/2, submarine.x));
            
            backgroundX = (backgroundX + backgroundScrollSpeed) % canvas.width;

            // Atualizar peixes
            fish.forEach((f, i) => {
                f.x -= f.speed + backgroundScrollSpeed;
                f.phase += f.frequency;
                f.y += Math.sin(f.phase) * f.amplitude * 0.1;
                
                if (checkCollision(submarine, f)) {
                    gameOver("Você atingiu um animal marinho!");
                    return;
                }
                
                if (f.x < -f.size) {
                    fish.splice(i, 1);
                    createFish();
                }
            });
            
            // Atualizar lixo
            trash.forEach((t, i) => {
                if (!t.collected) {
                    t.x -= t.speed + backgroundScrollSpeed;
                    t.bobOffset += 0.05;
                    t.y += Math.sin(t.bobOffset) * 0.5;
                    
                    let distance = Math.hypot(submarine.x - t.x, submarine.y - t.y);
                    
                    if (distance <= submarine.collectRange && (keys['e'] || keys[' '] || keys['collect'])) {
                        t.collected = true;
                        gameState.trashCollected++;
                        updateUI();
                        
                        for (let j = 0; j < 5; j++) {
                            particles.push({
                                x: t.x, y: t.y,
                                vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
                                life: 20, maxLife: 20, color: '#00ff00'
                            });
                        }
                    }
                }
                
                if (t.collected || t.x < -t.size) {
                    trash.splice(i, 1);
                    setTimeout(createTrash, 1000 + Math.random() * 2000);
                }
            });
            
            // Atualizar bolhas
            bubbles.forEach((b, i) => {
                b.y -= b.speed;
                if (b.y < -b.size) {
                    bubbles.splice(i, 1);
                    createBubble();
                }
            });
            
            // Atualizar partículas
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
                if (p.life <= 0) particles.splice(i, 1);
            });
        }
        
        function checkCollision(obj1, obj2) {
            const dx = obj1.x - obj2.x;
            const dy = obj1.y - obj2.y;
            const distance = Math.hypot(dx, dy);
            const combinedRadius = (obj1.width / 2) + (obj2.size / 2);
            return distance < combinedRadius * 0.8; // 0.8 para uma colisão mais justa
        }
        
        // --- Funções de Renderização ---
        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            drawOceanBackground();
            
            bubbles.forEach(b => {
                ctx.globalAlpha = b.opacity;
                ctx.fillStyle = '#ADD8E6';
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;
            
            if (gameState.running) {
                ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(submarine.x, submarine.y, submarine.collectRange, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            if (gameState.running) drawSubmarine();
            
            fish.forEach(f => {
                ctx.font = `${f.size}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(f.type, f.x, f.y);
            });
            
            trash.forEach(t => {
                if (!t.collected) {
                    ctx.font = `${t.size}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(t.type, t.x, t.y);
                    
                    let distance = Math.hypot(submarine.x - t.x, submarine.y - t.y);
                    if (distance <= submarine.collectRange) {
                        ctx.strokeStyle = 'rgba(255, 255, 0, 0.7)';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
            });
            
            particles.forEach(p => {
                ctx.globalAlpha = p.life / p.maxLife;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
            });
            ctx.globalAlpha = 1;
        }
        
        function drawOceanBackground() {
            const drawElements = (offsetX) => {
                ctx.font = 'clamp(20px, 5vw, 40px) Arial';
                ctx.textAlign = 'center';
                for (let i = 0; i < Math.ceil(canvas.width / 160) + 1; i++) {
                    let x = i * 160 + 50 + offsetX;
                    ctx.fillText('🪸', x, canvas.height - 20);
                }
            };
            drawElements(-backgroundX);
            drawElements(-backgroundX + canvas.width);
        }
        
        // --- DESIGN ORIGINAL DO SUBMARINO ---
        function drawSubmarine() {
            const sub = submarine;
            ctx.save();
            ctx.translate(sub.x, sub.y);
            ctx.rotate(sub.angle);

            // Desenhe o submarino em torno de (0,0) que agora é o centro
            ctx.fillStyle = '#FFD700'; // Cor dourada
            
            // Corpo principal
            ctx.fillRect(-sub.width / 2, -sub.height / 2 + 8, sub.width - 10, sub.height - 16);
            
            // Frente pontiaguda
            ctx.beginPath();
            ctx.moveTo(sub.width / 2 - 10, -sub.height / 2 + 8);
            ctx.lineTo(sub.width / 2, 0);
            ctx.lineTo(sub.width / 2 - 10, sub.height / 2 - 8);
            ctx.fill();
            
            // Torre
            ctx.fillRect(-sub.width / 2 + 15, -sub.height / 2, 20, 15);
            
            // Periscópio
            ctx.fillStyle = '#B8860B';
            ctx.fillRect(-sub.width / 2 + 20, -sub.height / 2 - 5, 2, 10);
            
            // Janelas
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(-sub.width / 2 + 8, -sub.height / 2 + 12, 8, 6);
            ctx.fillRect(-sub.width / 2 + 25, -sub.height / 2 + 12, 8, 6);
            
            // Hélice
            ctx.fillStyle = '#696969';
            let propellerAngle = Date.now() * 0.02;
            ctx.save();
            ctx.translate(-sub.width / 2, 0); // Move para a parte traseira do submarino
            ctx.rotate(propellerAngle);
            ctx.fillRect(-8, -2, 16, 4);
            ctx.fillRect(-2, -8, 4, 16);
            ctx.restore();

            ctx.restore();
        }
        
        // --- Controle do Jogo ---
        function gameOver(message) {
            if (!gameState.running) return; // Evita chamadas múltiplas
            gameState.running = false;
            createExplosion(submarine.x, submarine.y);
            document.getElementById('gameOverMessage').textContent = message;
            setTimeout(() => {
                 gameOverDiv.style.display = 'block';
            }, 500);
        }
        
        function updateUI() {
            document.getElementById('trashCount').textContent = gameState.trashCollected;
        }
        
        function gameLoop() {
            update();
            render();
            requestAnimationFrame(gameLoop);
        }
        
        // --- Event Listeners ---
        document.addEventListener('keydown', e => {
            keys[e.key.toLowerCase()] = true;
            if (e.key.toLowerCase() === 'r' && !gameState.running) initGame();
        });
        
        document.addEventListener('keyup', e => {
            keys[e.key.toLowerCase()] = false;
        });

        // --- Controles de Toque ---
        const collectBtn = document.getElementById('btn-collect');
        collectBtn.addEventListener('touchstart', e => { e.preventDefault(); keys['collect'] = true; }, { passive: false });
        collectBtn.addEventListener('touchend', e => { e.preventDefault(); keys['collect'] = false; }, { passive: false });

        // --- Lógica do Joystick ---
        const joystickContainer = document.getElementById('joystick-container');
        const joystickStick = document.getElementById('joystick-stick');
        const joystick = {
            active: false,
            x: 0,
            y: 0,
            startX: 0,
            startY: 0,
            maxDistance: 30 // Raio de movimento do stick
        };

        joystickContainer.addEventListener('touchstart', e => {
            e.preventDefault();
            joystick.active = true;
            const touch = e.changedTouches[0];
            joystick.startX = touch.clientX;
            joystick.startY = touch.clientY;
        }, { passive: false });

        joystickContainer.addEventListener('touchmove', e => {
            e.preventDefault();
            if (!joystick.active) return;
            
            const touch = e.changedTouches[0];
            let dx = touch.clientX - joystick.startX;
            let dy = touch.clientY - joystick.startY;
            
            const distance = Math.hypot(dx, dy);
            const angle = Math.atan2(dy, dx);
            
            // Limita o movimento do stick à base
            const clampedDistance = Math.min(distance, joystick.maxDistance);
            const newX = clampedDistance * Math.cos(angle);
            const newY = clampedDistance * Math.sin(angle);
            
            joystickStick.style.transform = `translate(-50%, -50%) translate(${newX}px, ${newY}px)`;
            
            // Normaliza o output do joystick para -1 a 1
            joystick.x = newX / joystick.maxDistance;
            joystick.y = newY / joystick.maxDistance;

        }, { passive: false });

        joystickContainer.addEventListener('touchend', e => {
            e.preventDefault();
            joystick.active = false;
            joystick.x = 0;
            joystick.y = 0;
            joystickStick.style.transform = 'translate(-50%, -50%)';
        }, { passive: false });


        // Reiniciar com toque na tela de Game Over
        gameOverDiv.addEventListener('click', () => {
            if (!gameState.running) {
                initGame();
            }
        });

        // --- Iniciar Jogo ---
        initGame();
        gameLoop();