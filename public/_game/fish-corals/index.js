const defaultGame = {
    fish: null,
    obstacles: [],
    decorations: [],
    bubbles: [],
    score: 0,
    gameRunning: false,
    fishY: 300,
    fishVelocity: 0,
    gravity: 0.6,
    jumpPower: -12,
    gameSpeed: 3,
    obstacleGap: 210,
    lastObstacle: 800
};

let game;

async function fetchGameConfig() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch('https://pastebin.com/raw/MBHpZJkj', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Fetched game config:', data);
        return { ...defaultGame, ...data };
    } catch (error) {
        console.error('Failed to fetch game config, using default:', error);
        clearTimeout(timeoutId);
        return defaultGame;
    }
}

async function init() {
    game = await fetchGameConfig();
    game.fish = document.getElementById('fish');
    createDecorations();
    createBubbles();
    updateFishPosition();
}

function createDecorations() {
    // Criar algas marinhas
    for (let i = 0; i < 8; i++) {
        const seaweed = document.createElement('div');
        seaweed.className = 'seaweed';
        seaweed.style.left = Math.random() * 800 + 'px';
        seaweed.style.height = (60 + Math.random() * 40) + 'px';
        seaweed.style.animationDelay = Math.random() * 3 + 's';
        document.getElementById('gameContainer').appendChild(seaweed);
        game.decorations.push(seaweed);
    }

    // Criar corais decorativos
    for (let i = 0; i < 5; i++) {
        const coral = document.createElement('div');
        coral.className = 'coral';
        coral.style.left = Math.random() * 800 + 'px';
        coral.style.height = (50 + Math.random() * 30) + 'px';
        document.getElementById('gameContainer').appendChild(coral);
        game.decorations.push(coral);
    }
}

function createBubbles() {
    setInterval(() => {
        if (game.gameRunning && game.bubbles.length < 10) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            const size = 10 + Math.random() * 20;
            bubble.style.width = size + 'px';
            bubble.style.height = size + 'px';
            bubble.style.left = Math.random() * 800 + 'px';
            bubble.style.bottom = '0px';
            document.getElementById('gameContainer').appendChild(bubble);
            game.bubbles.push(bubble);

            setTimeout(() => {
                if (bubble.parentNode) {
                    bubble.parentNode.removeChild(bubble);
                    game.bubbles = game.bubbles.filter(b => b !== bubble);
                }
            }, 4000);
        }
    }, 800);
}

function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    game.gameRunning = true;
    game.fishY = 300;
    game.fishVelocity = 0;
    game.score = 0;
    game.obstacles = [];
    game.lastObstacle = 800;
    updateScore();
    gameLoop();
}

function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    // Limpar obstáculos existentes
    game.obstacles.forEach(obs => {
        if (obs.top && obs.top.parentNode) obs.top.parentNode.removeChild(obs.top);
        if (obs.bottom && obs.bottom.parentNode) obs.bottom.parentNode.removeChild(obs.bottom);
    });
    startGame();
}

function jump() {
    if (game.gameRunning) {
        game.fishVelocity = game.jumpPower;
        game.fish.style.transform = 'rotate(-20deg)';
        setTimeout(() => {
            if (game.gameRunning) {
                game.fish.style.transform = 'rotate(0deg)';
            }
        }, 150);
    }
}

function createObstacle() {
    const gapStart = 100 + Math.random() * 300;
    
    const topObstacle = document.createElement('div');
    topObstacle.className = 'obstacle top';
    topObstacle.style.left = '800px';
    topObstacle.style.height = gapStart + 'px';
    
    const bottomObstacle = document.createElement('div');
    bottomObstacle.className = 'obstacle bottom';
    bottomObstacle.style.left = '800px';
    bottomObstacle.style.height = (600 - gapStart - game.obstacleGap) + 'px';
    
    document.getElementById('gameContainer').appendChild(topObstacle);
    document.getElementById('gameContainer').appendChild(bottomObstacle);
    
    game.obstacles.push({
        top: topObstacle,
        bottom: bottomObstacle,
        x: 800,
        scored: false
    });
}

function updateObstacles() {
    // Criar novos obstáculos
    if (game.lastObstacle <= 500) {
        createObstacle();
        game.lastObstacle = 800;
    } else {
        game.lastObstacle -= game.gameSpeed;
    }

    // Mover obstáculos existentes
    for (let i = game.obstacles.length - 1; i >= 0; i--) {
        const obstacle = game.obstacles[i];
        obstacle.x -= game.gameSpeed;
        
        obstacle.top.style.left = obstacle.x + 'px';
        obstacle.bottom.style.left = obstacle.x + 'px';
        
        // Verificar pontuação
        if (!obstacle.scored && obstacle.x < 100) {
            obstacle.scored = true;
            game.score++;
            updateScore();
        }
        
        // Remover obstáculos fora da tela
        if (obstacle.x < -100) {
            obstacle.top.parentNode.removeChild(obstacle.top);
            obstacle.bottom.parentNode.removeChild(obstacle.bottom);
            game.obstacles.splice(i, 1);
        }
        
        // Verificar colisão
        if (checkCollision(obstacle)) {
            gameOver();
            return;
        }
    }
}

function checkCollision(obstacle) {
    const fishLeft = 100;
    const fishRight = 160;
    const fishTop = game.fishY;
    const fishBottom = game.fishY + 40;
    
    const obsLeft = obstacle.x;
    const obsRight = obstacle.x + 80;
    
    if (fishRight > obsLeft && fishLeft < obsRight) {
        const topObsBottom = parseInt(obstacle.top.style.height);
        const bottomObsTop = 600 - parseInt(obstacle.bottom.style.height);
        
        if (fishTop < topObsBottom || fishBottom > bottomObsTop) {
            return true;
        }
    }
    
    return false;
}

function updateFishPosition() {
    game.fishVelocity += game.gravity;
    game.fishY += game.fishVelocity;
    
    // Rotação baseada na velocidade
    const rotation = Math.max(-30, Math.min(30, game.fishVelocity * 2));
    game.fish.style.transform = `rotate(${rotation}deg)`;
    
    game.fish.style.top = game.fishY + 'px';
    
    // Verificar limites da tela
    if (game.fishY < 0 || game.fishY > 560) {
        gameOver();
    }
}

function updateScore() {
    document.getElementById('score').textContent = 'Pontuação: ' + game.score;
}

function gameOver() {
    game.gameRunning = false;
    document.getElementById('finalScore').textContent = 'Pontuação Final: ' + game.score;
    document.getElementById('gameOver').style.display = 'block';
}

function gameLoop() {
    if (!game.gameRunning) return;
    
    updateFishPosition();
    updateObstacles();
    
    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        jump();
    }
});

document.getElementById('gameContainer').addEventListener('click', jump);

// Inicializar o jogo
init();