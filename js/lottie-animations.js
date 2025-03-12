/**
 * Gerenciador de animações Lottie para o jogo Mario Jump
 * Este arquivo contém as configurações e funções para carregar e controlar animações Lottie
 */

// URLs das animações Lottie (de CDNs públicos)
const LOTTIE_ANIMATIONS = {
    coin: 'https://assets5.lottiefiles.com/packages/lf20_Ht77kFLXYX.json',
    powerup: 'https://assets5.lottiefiles.com/packages/lf20_khzniaya.json',
    star: 'https://assets5.lottiefiles.com/packages/lf20_Gy5rBh.json',
    trophy: 'https://assets5.lottiefiles.com/packages/lf20_lc46h4dr.json',
    levelUp: 'https://assets5.lottiefiles.com/packages/lf20_qdgj2kp1.json'
};

// Instâncias das animações
let coinAnimation = null;
let powerupAnimation = null;
let starAnimation = null;
let trophyAnimation = null;
let levelUpAnimation = null;

// Inicializa as animações quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa as animações
    initLottieAnimations();
});

/**
 * Inicializa todas as animações Lottie
 */
function initLottieAnimations() {
    // Animação de moeda
    coinAnimation = lottie.loadAnimation({
        container: document.getElementById('coin-animation'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: LOTTIE_ANIMATIONS.coin
    });

    // Animação de power-up
    powerupAnimation = lottie.loadAnimation({
        container: document.getElementById('powerup-animation'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: LOTTIE_ANIMATIONS.powerup
    });

    // Animação de estrela
    starAnimation = lottie.loadAnimation({
        container: document.getElementById('star-animation'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: LOTTIE_ANIMATIONS.star
    });

    // Animação de troféu para o modal de recorde
    trophyAnimation = lottie.loadAnimation({
        container: document.getElementById('trophy-animation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: LOTTIE_ANIMATIONS.trophy
    });
}

/**
 * Reproduz a animação de moeda em uma posição específica
 * @param {number} x - Posição X
 * @param {number} y - Posição Y
 */
function playCoinAnimation(x, y) {
    const coinElement = document.getElementById('coin-animation');
    coinElement.style.left = `${x}px`;
    coinElement.style.top = `${y}px`;
    coinElement.style.display = 'block';
    
    coinAnimation.goToAndPlay(0);
    
    coinAnimation.addEventListener('complete', () => {
        coinElement.style.display = 'none';
    }, { once: true });
}

/**
 * Reproduz a animação de power-up em uma posição específica
 * @param {number} x - Posição X
 * @param {number} y - Posição Y
 */
function playPowerupAnimation(x, y) {
    const powerupElement = document.getElementById('powerup-animation');
    powerupElement.style.left = `${x}px`;
    powerupElement.style.top = `${y}px`;
    powerupElement.style.display = 'block';
    
    powerupAnimation.goToAndPlay(0);
    
    powerupAnimation.addEventListener('complete', () => {
        powerupElement.style.display = 'none';
    }, { once: true });
}

/**
 * Reproduz a animação de estrela em uma posição específica
 * @param {number} x - Posição X
 * @param {number} y - Posição Y
 */
function playStarAnimation(x, y) {
    const starElement = document.getElementById('star-animation');
    starElement.style.left = `${x}px`;
    starElement.style.top = `${y}px`;
    starElement.style.display = 'block';
    
    starAnimation.goToAndPlay(0);
    
    starAnimation.addEventListener('complete', () => {
        starElement.style.display = 'none';
    }, { once: true });
}

/**
 * Mostra o efeito de aumento de nível
 * @param {number} level - Novo nível
 */
function showLevelUpEffect(level) {
    const levelUpElement = document.getElementById('level-up-effect');
    levelUpElement.textContent = `NÍVEL ${level}!`;
    levelUpElement.classList.add('active');
    
    setTimeout(() => {
        levelUpElement.classList.remove('active');
    }, 2000);
}

/**
 * Mostra o efeito de coleta de moeda
 * @param {number} x - Posição X
 * @param {number} y - Posição Y
 * @param {number} value - Valor da moeda
 */
function showCoinCollectEffect(x, y, value) {
    const coinEffectElement = document.getElementById('coin-collect-effect');
    coinEffectElement.textContent = `+${value}`;
    coinEffectElement.style.left = `${x}px`;
    coinEffectElement.style.top = `${y}px`;
    coinEffectElement.classList.add('active');
    
    setTimeout(() => {
        coinEffectElement.classList.remove('active');
    }, 1000);
}

// Exporta as funções para uso no script principal
window.lottieAnimations = {
    playCoinAnimation,
    playPowerupAnimation,
    playStarAnimation,
    showLevelUpEffect,
    showCoinCollectEffect
}; 