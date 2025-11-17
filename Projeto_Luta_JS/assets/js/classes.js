class Character {
    _life = 1;
    maxLife = 1;
    attack = 0;
    defense = 0;
    
    // NOVO: Propriedade para controlar o ataque por turno
    turnosRestantes = 1; 

    constructor(name) {
        this.name = name;
    }

    get life() {
        return this._life;
    }

    set life(newLife) {
        this._life = newLife < 0 ? 0 : newLife;
    }

    // NOVO: Método para preparar o personagem para o próximo turno
    prepararNovoTurno() {
        if (this.life > 0) {
            this.turnosRestantes = 1;
        }
    }
    
    // NOVO: Método para recuperar vida (Usado na Defesa)
    recuperarVida(amount) {
        const vidaAntes = this.life;
        this.life = Math.min(this.maxLife, this.life + amount);
        return this.life - vidaAntes; // Retorna o valor real recuperado
    }
}


class Knight extends Character {
    constructor(name) {
        super(name);
        this.life = 100;
        this.attack = 10;
        this.defense = 8;
        this.maxLife = this.life;
    }
}

class Sorcerer extends Character {
    constructor(name) {
        super(name);
        this.life = 80;
        this.attack = 15;
        this.defense = 3;
        this.maxLife = this.life;
    }
}


class LittleMonster extends Character {
    constructor() {
        super("Little Monster");
        this.life = 40;
        this.attack = 4;
        this.defense = 4;
        this.maxLife = this.life;
    }
}

class BigMonster extends Character {
    constructor() {
        super("Big Monster");
        this.life = 120;
        this.attack = 16;
        this.defense = 6;
        this.maxLife = this.life;
    }
}


// NOVO: Classe Log para gerenciar as mensagens coloridas
class Log {
    ul = null;

    constructor(ulElement) {
        this.ul = ulElement;
    }

    // Requisito: Definir diferentes cores para as mensagens
    addMessage(msg, type = 'system') {
        let li = document.createElement('li');
        // Usa `<b>` para garantir que o nome do personagem se destaque em negrito
        li.innerHTML = msg.replace(/(\*\*[^*]+\*\*)/g, '<b>$1</b>'); 
        li.classList.add('log-message', type); 
        
        this.ul.prepend(li);
        this.ul.scrollTop = 0; 
    }
}


// NOVO: Classe Stage com a Lógica de Batalha (Core do Desafio)
class Stage {
    constructor(fighter1, fighter2, fighter1El, fighter2El, log) {
        this.fighter1 = fighter1;
        this.fighter2 = fighter2;
        this.fighter1El = fighter1El;
        this.fighter2El = fighter2El;
        this.log = log;

        this.update();
        this.fighter1El.querySelector('.attackButton').addEventListener('click', () => this.doAttack(this.fighter1, this.fighter2));
        this.fighter2El.querySelector('.attackButton').addEventListener('click', () => this.doAttack(this.fighter2, this.fighter1));
    }

    update() {
        // Atualiza o Fighter 1 (Heroi)
        this.fighter1El.querySelector('.name').innerHTML = `${this.fighter1.name} (${this.fighter1.life.toFixed(0)} HP)`;
        let f1Pct = (this.fighter1.life / this.fighter1.maxLife) * 100;
        this.fighter1El.querySelector('.bar').style.width = `${f1Pct}%`;

        // Atualiza o Fighter 2 (Monstro)
        this.fighter2El.querySelector('.name').innerHTML = `${this.fighter2.name} (${this.fighter2.life.toFixed(0)} HP)`;
        let f2Pct = (this.fighter2.life / this.fighter2.maxLife) * 100;
        this.fighter2El.querySelector('.bar').style.width = `${f2Pct}%`;

        // Desabilita botões se estiver morto ou se já usou o turno
        this.fighter1El.querySelector('.attackButton').disabled = this.fighter1.life <= 0 || this.fighter1.turnosRestantes <= 0;
        this.fighter2El.querySelector('.attackButton').disabled = this.fighter2.life <= 0 || this.fighter2.turnosRestantes <= 0;
    }

    doAttack(attacking, defended) {
        let logType = attacking instanceof Knight || attacking instanceof Sorcerer ? 'hero' : 'monster';

        // --- Requisito: Adicionar mensagens (Morto não ataca) ---
        if (attacking.life <= 0) {
            this.log.addMessage(`${attacking.name} está morto e não pode atacar!`, 'system');
            return;
        }

        // --- Requisito: Permitir que cada um ataque no máximo 1x por turno ---
        if (attacking.turnosRestantes <= 0) {
            this.log.addMessage(`${attacking.name} já atacou neste turno. Clique no ataque do adversário!`, 'system');
            return;
        }

        // --- Requisito: Adicionar mensagens (Atacando cachorro morto) ---
        if (defended.life <= 0) {
            this.log.addMessage(`⚠️ **${attacking.name}** ataca... mas **${defended.name}** já está derrotado! (Cachorro morto não morde)`, 'system');
            attacking.turnosRestantes--; // Consome o turno
            this.update();
            return;
        }

        attacking.turnosRestantes--; // Consome o turno
        
        const attackFactor = (0.7 + Math.random() * 0.6).toFixed(2); // Fator de dano entre 0.7 e 1.3
        let actualAttack = Math.floor(attacking.attack * attackFactor);
        let realDamage = actualAttack - defended.defense;
        realDamage = realDamage < 0 ? 0 : realDamage;

        this.log.addMessage(`**${attacking.name}** ataca **${defended.name}** com ${actualAttack} de força.`, logType);

        if (realDamage > 0) {
            defended.life -= realDamage;
            this.log.addMessage(`**${defended.name}** perdeu **${realDamage}** de vida! Restante: ${defended.life.toFixed(0)}`, defended instanceof LittleMonster || defended instanceof BigMonster ? 'monster' : 'hero');
        } 
        
        // --- Requisito: Ataque fraco (dano abaixo de 1) e Caso defenda, recupera um pouco de vida ---
        else { 
            // Dano real foi 0
            
            const recoveryAmount = Math.floor(defended.maxLife * 0.05); // Recupera 5%
            const recovered = defended.recuperarVida(recoveryAmount);

            this.log.addMessage(`🛡️ **${defended.name}** defendeu completamente o ataque!`, defended instanceof LittleMonster || defended instanceof BigMonster ? 'monster' : 'hero');
            this.log.addMessage(`**${defended.name}** recuperou **${recovered}** de vida por ter defendido o ataque fraco!`, 'system');

            // --- Requisito: Ganhe 1 turno extra (devido ao ataque fraco) ---
            attacking.turnosRestantes++; 
            this.log.addMessage(`⭐ O ataque de **${attacking.name}** foi fraco. **+1 Turno Extra!**`, logType);
        }
        
        // Final da batalha
        if (defended.life <= 0) {
            this.log.addMessage(`💀 **${defended.name}** foi derrotado! **FIM DE JOGO**!`, 'system');
        }
        
        // Reseta o turno do defensor para que ele possa atacar em seguida
        defended.prepararNovoTurno();

        this.update();
    }
    
    start() {
        this.log.addMessage("⚔️ Batalha iniciada! Clique no botão para começar a atacar. O jogo é por turnos.", 'system');
        this.update();
    }
}       