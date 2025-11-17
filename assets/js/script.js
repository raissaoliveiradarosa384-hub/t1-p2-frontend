// A primeira linha do script.js deve ser assim:
let log = new Log(document.querySelector(".log"));


// allow user to choose hero type (Knight or Sorcerer)
const heroChoice = (function(){
const c = prompt('Escolha seu herói: Meliodas ou King (digite exatamente Meliodas ou King)', 'Sorcerer');
if(c && c.toLowerCase().startsWith('M')) return 'Knight';
return 'Sorcerer';
})();


let charName = prompt('Nome do seu herói?', 'Meliodas') || 'Meliodas';
let char;
if(heroChoice === 'Knight') char = new Knight(charName);
else char = new Sorcerer(charName);


// create a monster (you can change to BigMonster if you want a harder fight)
const monsters = [new LittleMonster(), new BigMonster()];
let monster = monsters[Math.floor(Math.random() * monsters.length)]


// --- Desafio Extra: Adicionar GIF dos personagens e monstros ---
const charEl = document.querySelector('#char');
const monsterEl = document.querySelector('#monster');

// GIFs (Substituído imagens estáticas por GIFs)
// Fonte dos GIFs: Gifs de domínio público ou comuns de jogos/pixel art
const KNIGHT_GIF = "https://media.tenor.com/LDXPUUlSSj0AAAAM/seven-deadly-sins-meliodas.gif";
const SORCERER_GIF = 'https://tenor.com/pt-BR/view/seven-deadly-sins-king-fairy-king-gif-20428465';
const MONSTER_GIF = 'https://tenor.com/pt-BR/view/arthur-pendragon-arthurpendragon-7ds-gif-15325690588768066197';

const charImgSrc = heroChoice === 'Knight' ? KNIGHT_GIF : SORCERER_GIF; 
const monsterImgSrc = MONSTER_GIF; 

// Cria e insere a imagem/GIF do herói
const charImgEl = document.createElement('img');
charImgEl.src = charImgSrc;
charImgEl.style.width = '120px'; // Ajustado para GIFs
charImgEl.style.height = 'auto';
charEl.prepend(charImgEl);

// Cria e insere a imagem/GIF do monstro
const monsterImgEl = document.createElement('img');
monsterImgEl.src = monsterImgSrc;
monsterImgEl.style.width = '120px'; // Ajustado para GIFs
monsterImgEl.style.height = 'auto';
monsterEl.prepend(monsterImgEl);


const stage = new Stage(
char,
monster,
charEl,
monsterEl,
log
);


stage.start();


// OPTIONAL: small helper to add CSS for log colors if the project doesn't already have it
(function injectLogStyles(){
const style = document.createElement('style');
style.innerHTML = `
.log-message.hero{ color: #0b64d6; font-weight: 600; }
.log-message.monster{ color: #d60b0b; font-weight: 600; }
.log-message.system{ color: #1aa31a; font-weight: 600; }
.log { max-height: 260px; overflow-y: auto; }
#char img, #monster img { display: block; margin: 10px auto; } /* Centraliza as imagens */
`;
document.head.appendChild(style);
})();
