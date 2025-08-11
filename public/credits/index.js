// Adiciona movimento aos cards quando o mouse se move
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.member-card');
    const x = (e.clientX / window.innerWidth) * 10 - 5;
    const y = (e.clientY / window.innerHeight) * 5 - 2.5;
    
    cards.forEach((card, index) => {
        const delay = index * 0.1;
        setTimeout(() => {
            card.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
        }, delay * 100);
    });
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

// Efeito de entrada animada para os cards
window.addEventListener('load', function() {
    const cards = document.querySelectorAll('.member-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, (index + 1) * 200);
    });
});