import { Map } from './Map.js';
import { Player } from './Player.js';

class Game {
    constructor() {
        this.map;
        this.tour = 0;
    }

    initGame() {
        this.map = new Map(10, 10, 10, this);//comme ca on a qu'une instance de Game (mémoire, propriétés qu'on veut recup...)
        this.players = [
            new Player(1, 10, random(0, this.map.nbOfLines), random(0, this.map.nbOfColumns),"../imgs/characters/player1.png", this, "hands"),
            new Player(2, 10, random(0, this.map.nbOfLines), random(0, this.map.nbOfColumns),"../imgs/characters/player2.png", this, "hands")
        ];
        this.map.createGrid();
        this.map.generateWalls();
        this.map.generateWeapons();
        this.map.createPlayers();
        this.map.displayMoves(this.players[0]);
        this.movePlayers();
        this.map.lookAround("7-3");
    }

    getCurrentPlayer() {
        return this.players[this.tour % 2];
    }

    movePlayers() {
        //"on" bcs jQuery still had in memory the green boxes even if i removeClass...
        $(document).on('click', '.green', function(e) {
            const user = this.getCurrentPlayer(); //this.players[0] || [1]
            let oldPosition = this.map.getPlayerPosition(user); // x-y
            let idOftheWantedPosition = $(e.currentTarget)[0].id;
            //the old position
            $(`#${oldPosition}`).removeAttr("data-player");
            $(`#${oldPosition}`).removeClass("player");
            $(`#${oldPosition}`).removeClass(`player${user.number}`)
            $(`#${oldPosition}`).addClass("free");

            //the new cell
            $(e.currentTarget).addClass("player");
            $(e.currentTarget).addClass(`player${user.number}`);
            
            //update x and y of the current player
            user.updatePlayerPosition(user, idOftheWantedPosition);

            if($(e.currentTarget).hasClass("weapon")) {
                let oldWeapon = user.weaponName;
                if(user.weaponName === "default") {
                    user.weaponName = $(e.currentTarget).attr("data-weapon");
                    $(e.currentTarget).removeClass($(e.currentTarget).attr("data-weapon"));
                    $(e.currentTarget).removeClass("weapon");
                    $(e.currentTarget).removeAttr("data-weapon");
                } else {
                    user.weaponName = $(e.currentTarget).attr("data-weapon");
                    $(e.currentTarget).removeClass($(e.currentTarget).attr("data-weapon"));
                    $(e.currentTarget).addClass(oldWeapon);
                    $(e.currentTarget).attr("data-weapon", oldWeapon);
                }
            }


            //desactivate the possibilities cells
            $(".green").each(function(){
                $(this).removeClass("green");
            });

            console.log(user);
            //pass to the next player
            this.tour += 1;
            this.map.displayMoves(this.getCurrentPlayer());

        }.bind(this)); //bind cuz he cant read the method of the class Map
        
    }

    fight() {

    }
}

export {Game}
