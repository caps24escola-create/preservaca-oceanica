// Adiciona movimento extra aos peixes quando o mouse se move
document.addEventListener('mousemove', function(e) {
    const fish = document.querySelector('.fish');
    const x = (e.clientX / window.innerWidth) * 20 - 10;
    const y = (e.clientY / window.innerHeight) * 10 - 5;
    
    fish.style.transform = `translate(${x}px, ${y}px)`;
});

// Cria mais bolhas dinamicamente
function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.style.left = Math.random() * 100 + '%';
    bubble.style.width = bubble.style.height = (Math.random() * 30 + 10) + 'px';
    bubble.style.animationDuration = (Math.random() * 3 + 4) + 's';
    bubble.style.animationDelay = Math.random() * 2 + 's';
    
    document.body.appendChild(bubble);
    
    setTimeout(() => {
        bubble.remove();
    }, 8000);
}

// Cria nova bolha a cada 3 segundos
setInterval(createBubble, 3000);