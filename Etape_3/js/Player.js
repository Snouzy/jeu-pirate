class Player {
    //ajouter life et weapon
    constructor(number, damages, x, y, src, game, map, weaponName, life, isDefending){
        this.number = number;
        this.damages = damages;
        this.x = x ;
        this.y = y;
        this.src = src;
        this.game = game;
        this.map = map;
        this.weaponName = weaponName;
        this.life = life;
        this.isDefending = isDefending;
    }

    //when a player moved
    updatePlayerPosition(player, newPos) { //7-1
        const x = parseInt(newPos.charAt(0));
        const y = parseInt(newPos.charAt(newPos.length - 1));
        player.x = x;
        player.y = y;
    }

    //change the state of the player
    defense() {
        this.isDefending = true;
    }

    //updating player life according to the equipped weapon 
    //and the opponent isDefending attribute
    attack() {
        const userWeaponNameInFrench = this.map.weapons[this.weaponName].nameFR;
        this.game.textToPrompt = `Votre attaque grâce à votre ${userWeaponNameInFrench} fait <b>${this.damages} de dégâts</b> sur l'adversaire`;

        if(this.number === 2) { //P2
            const player1 = this.game.players[0];
            if(player1.isDefending) {
                player1.life -= (this.damages / 2);
                player1.isDefending = !player1.isDefending;
                this.game.textToPrompt = `Votre attaque grâce à votre ${userWeaponNameInFrench} fait <b>${this.damages/2} de dégâts</b> sur l'adversaire`;
            } else {
                player1.life -= this.damages;
            }
        } else { //P1 
            const player2 = this.game.players[1];
            if(player2.isDefending) {
                player2.life -= (this.damages / 2);
                player2.isDefending = !player2.isDefending;
                this.game.textToPrompt = `Votre attaque grâce à votre ${userWeaponNameInFrench} fait <b>${this.damages/2} de dégâts</b> sur l'adversaire`;
            } else {
                player2.life -= this.damages;
            }
        }
        //updating lifebar (color, number and animation)
        this.game.players.forEach( player => {
            const playerLifeBar = `#life-bar-p${player.number}`;
            player.life <= 75 ? $(playerLifeBar).addClass("yellow") : "";
            player.life <= 50 ? $(playerLifeBar).addClass("orange") : "";
            player.life <= 25 ? $(playerLifeBar).addClass("red") : "";
            $(playerLifeBar).css("width", this.game.players[player.number - 1].life + "%");
            $(`#life-p${player.number}`).html(this.game.players[player.number - 1].life);
        })
    }
    
    
}

export { Player }