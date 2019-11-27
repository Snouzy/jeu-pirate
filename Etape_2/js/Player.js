class Player {
    //ajouter life et weapon
    constructor(number, damage, x, y, src, game, weaponName){
        this.number = number;
        this.damage = damage;
        this.x = x ;
        this.y = y;
        this.src = src;
        this.game = game;
        this.weaponName = weaponName;
    }

    updatePlayerPosition(player, newPos) { //7-1
        let x = parseInt(newPos.charAt(0));
        let y = parseInt(newPos.charAt(newPos.length - 1));
        player.x = x;
        player.y = y;
    }
    
}

export { Player }