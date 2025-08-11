// Elementos da preservação oceânica
const oceanElements = [
    { id: 1, name: 'Baleia', emoji: '🐋', description: 'Maior mamífero marinho' },
    { id: 2, name: 'Polvo', emoji: '🐙', description: 'Invertebrado inteligente' },
    { id: 3, name: 'Tubarão', emoji: '🦈', description: 'Predador dos oceanos' },
    { id: 4, name: 'Golfinho', emoji: '🐬', description: 'Mamífero social' },
    { id: 5, name: 'Estrela-do-mar', emoji: '⭐', description: 'Equinodermo regenerativo' },
    { id: 6, name: 'Tartaruga', emoji: '🐢', description: 'Reptil marinho ancestral' },
    { id: 7, name: 'Cavalo-marinho', emoji: '🦄', description: 'Peixe único' },
    { id: 8, name: 'Coral', emoji: '🪸', description: 'Organismo colonial' }
];

// Variáveis de estado globais
let cards = [];
let flippedCards = [];
let moves = 0;
let matches = 0;
let gameWon = false;
let startTime = null;
let elapsedTime = 0;
let timerInterval;

// Referências aos elementos do DOM
const gameBoard = document.getElementById('game-board');
const movesCount = document.getElementById('moves-count');
const matchesCount = document.getElementById('matches-count');
const elapsedTimeDisplay = document.getElementById('elapsed-time');
const resetButton = document.getElementById('reset-button');
const victoryModal = document.getElementById('victory-modal');
const finalMovesDisplay = document.getElementById('final-moves');
const finalTimeDisplay = document.getElementById('final-time');
const totalElementsDisplay = document.getElementById('total-elements');
const playAgainButton = document.getElementById('play-again-button');

/**
 * Cria e embaralha os pares de cartas para o jogo.
 * @returns {Array} Um array de objetos de cartas embaralhadas.
 */
const createCards = () => {
    const newCards = [];
    oceanElements.forEach(element => {
        newCards.push({ ...element, cardId: `${element.id}-1`, isFlipped: false, isMatched: false });
        newCards.push({ ...element, cardId: `${element.id}-2`, isFlipped: false, isMatched: false });
    });
    return newCards.sort(() => Math.random() - 0.5);
};

/**
 * Formata o tempo em segundos para o formato MM:SS.
 * @param {number} seconds - O tempo em segundos.
 * @returns {string} O tempo formatado.
 */
const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Atualiza a exibição do tempo decorrido.
 */
const updateTimerDisplay = () => {
    elapsedTimeDisplay.textContent = formatTime(elapsedTime);
};

/**
 * Inicia o timer do jogo.
 */
const startTimer = () => {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            elapsedTime++;
            updateTimerDisplay();
        }, 1000);
    }
};

/**
 * Para o timer do jogo.
 */
const stopTimer = () => {
    clearInterval(timerInterval);
    timerInterval = null;
};

/**
 * Renderiza o tabuleiro do jogo e atualiza as estatísticas.
 */
const renderGame = () => {
    gameBoard.innerHTML = ''; // Limpa o tabuleiro existente

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.dataset.cardId = card.cardId;
        cardElement.classList.add(
            'aspect-square', 'rounded-xl', 'cursor-pointer', 'transform', 'transition-all', 'duration-300', 'hover:scale-105'
        );

        // Adiciona classes para virar e combinar
        if (card.isFlipped || card.isMatched) {
            cardElement.classList.add('card-flipped');
        }

        // Cria o conteúdo interno do cartão (frente e verso)
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-front">
                    <!-- Waves Icon for card back -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 20v2H0V20Z"/><path d="M10 20v2H8V20Z"/><path d="M18 20v2H16V20Z"/><path d="M2 10s.5-2 2-2 4 2 6 2 4-2 6-2 4 2 6 2"/><path d="M2 14s.5-2 2-2 4 2 6 2 4-2 6-2 4 2 6 2"/><path d="M2 18s.5-2 2-2 4 2 6 2 4-2 6-2 4 2 6 2"/>
                    </svg>
                </div>
                <div class="card-face card-back ${card.isMatched ? 'card-matched' : ''}">
                    <div class="text-4xl mb-2">${card.emoji}</div>
                    <div class="text-xs font-semibold text-center leading-tight">
                        ${card.name}
                    </div>
                </div>
            </div>
        `;

        cardElement.addEventListener('click', () => handleCardClick(card.cardId));
        gameBoard.appendChild(cardElement);
    });

    // Atualiza as estatísticas exibidas
    movesCount.textContent = moves;
    matchesCount.textContent = `${matches}/${oceanElements.length}`;
    updateTimerDisplay();

    // Exibe ou oculta o modal de vitória
    if (gameWon) {
        stopTimer();
        finalMovesDisplay.textContent = moves;
        finalTimeDisplay.textContent = formatTime(elapsedTime);
        totalElementsDisplay.textContent = oceanElements.length;
        victoryModal.classList.remove('hidden');
    } else {
        victoryModal.classList.add('hidden');
    }
};

/**
 * Lida com o clique em uma carta.
 * @param {string} clickedCardId - O ID da carta clicada.
 */
const handleCardClick = (clickedCardId) => {
    if (!startTime) {
        startTime = Date.now();
        startTimer();
    }

    const clickedCardIndex = cards.findIndex(card => card.cardId === clickedCardId);
    const clickedCard = cards[clickedCardIndex];

    // Ignora se já há 2 cartas viradas, ou se a carta já está virada/combinada
    if (flippedCards.length === 2 || clickedCard.isFlipped || clickedCard.isMatched) {
        return;
    }

    // Vira a carta clicada
    cards[clickedCardIndex].isFlipped = true;
    flippedCards.push(clickedCard);
    renderGame(); // Renderiza para mostrar a carta virada

    if (flippedCards.length === 2) {
        moves++;
        movesCount.textContent = moves; // Atualiza a contagem de jogadas imediatamente

        if (flippedCards[0].id === flippedCards[1].id) {
            // Par encontrado
            setTimeout(() => {
                cards = cards.map(card =>
                    card.id === flippedCards[0].id
                        ? { ...card, isMatched: true, isFlipped: true }
                        : card
                );
                matches++;
                flippedCards = [];
                if (matches === oceanElements.length) {
                    gameWon = true;
                }
                renderGame(); // Renderiza para mostrar o par combinado
            }, 600);
        } else {
            // Não é par, virar de volta
            setTimeout(() => {
                cards = cards.map(card =>
                    flippedCards.some(flipped => flipped.cardId === card.cardId)
                        ? { ...card, isFlipped: false }
                        : card
                );
                flippedCards = [];
                renderGame(); // Renderiza para virar as cartas de volta
            }, 1000);
        }
    }
};

/**
 * Reinicia o jogo para um novo turno.
 */
const resetGame = () => {
    stopTimer();
    cards = createCards();
    flippedCards = [];
    moves = 0;
    matches = 0;
    gameWon = false;
    startTime = null;
    elapsedTime = 0;
    renderGame(); // Renderiza o novo jogo
};

// Event Listeners
resetButton.addEventListener('click', resetGame);
playAgainButton.addEventListener('click', resetGame);

// Inicializa o jogo quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', resetGame);