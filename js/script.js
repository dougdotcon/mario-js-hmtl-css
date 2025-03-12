/**
 * Mario Jump - Script Principal
 * Jogo inspirado no clássico Super Mario Bros
 */

// Elementos do DOM
const pipe = document.querySelector('.pipe');
const mario = document.querySelector('.mario');
const finalGame = document.querySelector('.final-game');
const musicaGame = document.getElementById("musica-game");
const jumpSound = document.getElementById("jump-sound");
const coinSound = document.getElementById("coin-sound");
const powerupSound = document.getElementById("powerup-sound");
const levelUpSound = document.getElementById("level-up-sound");
const musicaGameJoin = document.getElementById("musica-game-join");
const pontosElemento = document.getElementById("pontos");
const vidasElemento = document.getElementById("lives-count");
const nivelElemento = document.getElementById("nivel");
const btnReiniciarJogo = document.getElementById('reiniciar-jogo');
const btnToggleSound = document.getElementById('toggle-sound');
const soundOnIcon = document.querySelector('.sound-on');
const soundOffIcon = document.querySelector('.sound-off');

// Configurações do jogo
let pontos = 0;
let vidas = 3;
let nivel = 1;
let velocidadeJogo = 1.1;
let isGameOver = false;
let ultimoPulo = 0;
let isSoundOn = true;
let isPowerUpActive = false;
let powerUpTimeout = null;
const delayEntrePulos = 500; // 500ms entre pulos
const pontosParaProximoNivel = 1000;

// Configurações de objetos
const objetosConfig = {
    moeda: {
        chance: 0.005, // 0.5% de chance por frame
        valor: 100,
        elemento: null
    },
    powerUp: {
        chance: 0.001, // 0.1% de chance por frame
        duracao: 10000, // 10 segundos
        elemento: null
    }
};

// Recupera recordes do localStorage
let pontuacaoRecorde = document.querySelector('#pontuacao-recorde');
let getRecorde = localStorage.getItem('pontuacaoRecorde') || 0;
pontuacaoRecorde.textContent = getRecorde;

let areaRecorde = document.querySelector('#nome-jogador');
let nomeJogador = localStorage.getItem('nomeJogador') || 'Jogador';
areaRecorde.textContent = nomeJogador;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa elementos
    inicializarElementos();
    
    // Eventos
    btnReiniciarJogo.addEventListener('click', reiniciarJogo);
    document.querySelector('#reiniciar-jogo-recorde').addEventListener('click', salvarRecorde);
    btnToggleSound.addEventListener('click', toggleSound);
    
    // Eventos de controle
    document.addEventListener('keydown', jump);
    document.addEventListener('touchstart', jump);
    
    // Configura o volume inicial dos áudios
    const audioElements = [musicaGameJoin, musicaGame, jumpSound, coinSound, powerupSound, levelUpSound];
    audioElements.forEach(audio => {
        if (audio) {
            audio.volume = isSoundOn ? 1 : 0;
        }
    });
    
    // Inicia o loop principal
    requestAnimationFrame(gameLoop);
});

/**
 * Inicializa elementos do jogo
 */
function inicializarElementos() {
    // Cria elemento para moeda
    objetosConfig.moeda.elemento = document.createElement('img');
    objetosConfig.moeda.elemento.src = './img/coin.png';
    objetosConfig.moeda.elemento.classList.add('objeto', 'moeda');
    objetosConfig.moeda.elemento.style.display = 'none';
    document.querySelector('.game-board').appendChild(objetosConfig.moeda.elemento);
    
    // Cria elemento para power-up
    objetosConfig.powerUp.elemento = document.createElement('img');
    objetosConfig.powerUp.elemento.src = './img/mushroom.png';
    objetosConfig.powerUp.elemento.classList.add('objeto', 'power-up');
    objetosConfig.powerUp.elemento.style.display = 'none';
    document.querySelector('.game-board').appendChild(objetosConfig.powerUp.elemento);
    
    // Adiciona estilos CSS para os novos elementos
    const style = document.createElement('style');
    style.textContent = `
        .objeto {
            position: absolute;
            z-index: 5;
            animation: pipe-animation 2s infinite linear;
        }
        .moeda {
            width: 30px;
            height: 30px;
            bottom: 50px;
        }
        .power-up {
            width: 40px;
            height: 40px;
            bottom: 0;
        }
        .mario.powered-up {
            filter: drop-shadow(0 0 10px gold);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Alterna o som do jogo
 */
function toggleSound() {
    isSoundOn = !isSoundOn;
    
    // Lista de todos os elementos de áudio
    const audioElements = [
        musicaGameJoin,
        musicaGame,
        jumpSound,
        coinSound,
        powerupSound,
        levelUpSound
    ];
    
    if (isSoundOn) {
        soundOnIcon.classList.remove('hiden');
        soundOffIcon.classList.add('hiden');
        
        // Restaura o volume de todos os elementos de áudio
        audioElements.forEach(audio => {
            if (audio) {
                audio.volume = 1;
                // Retoma a música de fundo se estiver pausada
                if (audio === musicaGameJoin && !isGameOver) {
                    audio.play();
                }
            }
        });
    } else {
        soundOnIcon.classList.add('hiden');
        soundOffIcon.classList.remove('hiden');
        
        // Muta todos os elementos de áudio
        audioElements.forEach(audio => {
            if (audio) {
                audio.volume = 0;
                // Pausa a música de fundo
                if (audio === musicaGameJoin) {
                    audio.pause();
                }
            }
        });
    }
}

/**
 * Salva o recorde do jogador
 */
function salvarRecorde() {
    let nomeAdcionar = document.querySelector('#nome-jogador-inicio');
    localStorage.setItem('nomeJogador', nomeAdcionar.value);
    areaRecorde.textContent = nomeAdcionar.value;
    location.reload();
}

/**
 * Reinicia o jogo
 */
function reiniciarJogo() {
    location.reload();
}

/**
 * Atualiza o placar do jogo
 */
function atualizarPlacar() {
    pontosElemento.textContent = pontos;
    vidasElemento.textContent = vidas;
    nivelElemento.textContent = nivel;
    
    // Verifica se passou de nível
    if (pontos >= nivel * pontosParaProximoNivel) {
        passarDeNivel();
    }
}

/**
 * Passa para o próximo nível
 */
function passarDeNivel() {
    nivel++;
    nivelElemento.textContent = nivel;
    
    // Aumenta a velocidade do jogo
    velocidadeJogo = Math.max(velocidadeJogo - 0.1, 0.5);
    pipe.style.animation = `pipe-animation ${velocidadeJogo}s infinite linear`;
    
    // Efeitos visuais e sonoros
    if (window.lottieAnimations) {
        window.lottieAnimations.showLevelUpEffect(nivel);
    }
    
    if (isSoundOn && levelUpSound) {
        levelUpSound.play();
    }
}

/**
 * Faz o Mario pular
 * @param {Event} event - Evento de teclado ou toque
 */
function jump(event) {
    if (isGameOver) return;
    
    const agora = Date.now();
    if (agora - ultimoPulo < delayEntrePulos) return;
    ultimoPulo = agora;
    
    if ((event.type === 'keydown' && event.key === ' ') || event.type === 'touchstart') {
        mario.classList.add('jump');
        mario.classList.add('jumping');
        
        if (isSoundOn && jumpSound) {
            jumpSound.play();
        }
        
        setTimeout(() => {
            mario.classList.remove('jump');
            mario.classList.remove('jumping');
        }, 500);
    }
}

/**
 * Perde uma vida
 */
function perderVida() {
    // Se estiver com power-up ativo, não perde vida
    if (isPowerUpActive) {
        desativarPowerUp();
        return;
    }
    
    vidas--;
    vidasElemento.textContent = vidas;
    
    if (vidas <= 0) {
        gameOver();
    } else {
        // Reinicia posição do Mario e do cano
        pipe.style.animation = 'none';
        pipe.offsetHeight;
        pipe.style.animation = `pipe-animation ${velocidadeJogo}s infinite linear`;
        pipe.style.left = '';
        
        mario.src = './img/mario.gif';
        mario.style.width = '150px';
        mario.style.bottom = '0';
        mario.classList.remove('jump');
    }
}

/**
 * Finaliza o jogo
 */
function gameOver() {
    isGameOver = true;
    pipe.style.animation = 'none';
    pipe.style.left = `${pipe.offsetLeft}px`;
    
    mario.src = './img/game-over.png';
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';
    mario.style.bottom = `${parseInt(window.getComputedStyle(mario).bottom)}px`;
    
    // Adiciona a imagem final do jogo
    const finalGameContainer = document.querySelector('.final-game-container');
    if (!finalGameContainer) {
        const container = document.createElement('div');
        container.classList.add('final-game-container');
        document.querySelector('.game-board').appendChild(container);
    }
    
    finalGame.style.display = 'block';
    finalGame.src = './img/fina2.png';
    
    if (isSoundOn) {
        musicaGameJoin.pause();
        musicaGame.play();
    }
    
    if (pontos > getRecorde) {
        localStorage.setItem('pontuacaoRecorde', pontos);
        document.querySelector('#coleta-dados-esconde').classList.remove('hiden');
    }
}

/**
 * Cria um objeto aleatório (moeda ou power-up)
 */
function criarObjetoAleatorio() {
    if (isGameOver) return;
    
    // Chance de criar uma moeda
    if (Math.random() < objetosConfig.moeda.chance) {
        const moeda = objetosConfig.moeda.elemento;
        moeda.style.display = 'block';
        moeda.style.right = '-30px';
        moeda.style.animation = `pipe-animation ${velocidadeJogo * 1.2}s infinite linear`;
    }
    
    // Chance de criar um power-up
    if (Math.random() < objetosConfig.powerUp.chance) {
        const powerUp = objetosConfig.powerUp.elemento;
        powerUp.style.display = 'block';
        powerUp.style.right = '-40px';
        powerUp.style.animation = `pipe-animation ${velocidadeJogo * 1.5}s infinite linear`;
    }
}

/**
 * Verifica colisão com objetos
 */
function verificarColisaoObjetos() {
    if (isGameOver) return;
    
    const marioPosition = parseInt(window.getComputedStyle(mario).bottom);
    const marioLeft = parseInt(window.getComputedStyle(mario).left);
    const marioRight = marioLeft + mario.offsetWidth;
    
    // Verifica colisão com moeda
    const moeda = objetosConfig.moeda.elemento;
    if (moeda.style.display !== 'none') {
        const moedaLeft = moeda.offsetLeft;
        const moedaRight = moedaLeft + moeda.offsetWidth;
        
        if (
            moedaRight >= marioLeft && 
            moedaLeft <= marioRight && 
            Math.abs(parseInt(window.getComputedStyle(moeda).bottom) - marioPosition) < 50
        ) {
            // Coletou a moeda
            moeda.style.display = 'none';
            pontos += objetosConfig.moeda.valor;
            atualizarPlacar();
            
            // Efeitos visuais e sonoros
            if (window.lottieAnimations) {
                window.lottieAnimations.playCoinAnimation(moedaLeft, parseInt(window.getComputedStyle(moeda).top));
                window.lottieAnimations.showCoinCollectEffect(moedaLeft, parseInt(window.getComputedStyle(moeda).top), objetosConfig.moeda.valor);
            }
            
            if (isSoundOn && coinSound) {
                coinSound.play();
            }
        }
    }
    
    // Verifica colisão com power-up
    const powerUp = objetosConfig.powerUp.elemento;
    if (powerUp.style.display !== 'none') {
        const powerUpLeft = powerUp.offsetLeft;
        const powerUpRight = powerUpLeft + powerUp.offsetWidth;
        
        if (
            powerUpRight >= marioLeft && 
            powerUpLeft <= marioRight && 
            Math.abs(parseInt(window.getComputedStyle(powerUp).bottom) - marioPosition) < 50
        ) {
            // Coletou o power-up
            powerUp.style.display = 'none';
            ativarPowerUp();
            
            // Efeitos visuais e sonoros
            if (window.lottieAnimations) {
                window.lottieAnimations.playPowerupAnimation(powerUpLeft, parseInt(window.getComputedStyle(powerUp).top));
            }
            
            if (isSoundOn && powerupSound) {
                powerupSound.play();
            }
        }
    }
}

/**
 * Ativa o power-up
 */
function ativarPowerUp() {
    isPowerUpActive = true;
    mario.classList.add('powered-up');
    
    // Limpa o timeout anterior se existir
    if (powerUpTimeout) {
        clearTimeout(powerUpTimeout);
    }
    
    // Define o timeout para desativar o power-up
    powerUpTimeout = setTimeout(() => {
        desativarPowerUp();
    }, objetosConfig.powerUp.duracao);
}

/**
 * Desativa o power-up
 */
function desativarPowerUp() {
    isPowerUpActive = false;
    mario.classList.remove('powered-up');
    
    if (powerUpTimeout) {
        clearTimeout(powerUpTimeout);
        powerUpTimeout = null;
    }
}

/**
 * Loop principal do jogo
 */
function gameLoop() {
    if (!isGameOver) {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = parseInt(window.getComputedStyle(mario).bottom);
        
        // Colisão com o cano
        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
            perderVida();
        } else {
            pontos++;
            atualizarPlacar();
        }
        
        // Cria objetos aleatórios
        criarObjetoAleatorio();
        
        // Verifica colisão com objetos
        verificarColisaoObjetos();
        
        // Continua o loop
        requestAnimationFrame(gameLoop);
    }
}

// Inicia o jogo
atualizarPlacar();

