import { Map } from './Map.js';
import { Player } from './Player.js';

class Game {
    constructor() {
        this.map;
        this.tour = 0;
        this.user;
        this.textToPrompt = ""; //needed to display the correct damages (divided by 2 if the player is defending)
    }
    
    //generate map, grid, walls, weapons, players, etc.
    initGame() {
        this.map = new Map(10, 10, 10, this);//comme ca on a qu'une instance de Game (mémoire, propriétés qu'on veut recup...)
        this.players = [
            new Player(1, 10, random(0, this.map.nbOfLines), random(0, this.map.nbOfColumns),"../imgs/characters/player1.png", this, this.map, "default", 100, false),
            new Player(2, 10, random(0, this.map.nbOfLines), random(0, this.map.nbOfColumns),"../imgs/characters/player2.png", this, this.map, "default", 100, false)
        ];
        this.map.createGrid();
        this.map.generateGreyBoxes();
        this.map.generateWeapons();
        this.map.createPlayers();
        this.map.displayMoves(this.players[0]);
        this.movePlayers();
        $("#weapon-p1").html(this.map.weapons[this.players[0].weaponName].nameFR);
        $("#weapon-p2").html(this.map.weapons[this.players[1].weaponName].nameFR);
        $("#life-p1").html(this.players[0].life);
        $("#life-p2").html(this.players[1].life);
    }

    //return which player must play
    getCurrentPlayer() {
        if(this.tour % 2 === 0 ) {
            //pair
            return this.players[0];
        } else {
            return this.players[1];
        }
        //1%2 = .5
        //2%2 = 0
        //3%2 = 1
        //4%2 = 2
        //5%2 = 1
        //...
    }

    //on click on the position
    movePlayers() {
        //"on" bcs jQuery still had in memory the green boxes even if i removeClass...
        $(document).on('click', '.green', function(e) {
            this.user = this.getCurrentPlayer(); //this.players[0] || [1]
            let oldPosition = this.map.getPlayerPosition(this.user); // x-y
            let idOftheWantedPosition = $(e.currentTarget)[0].id;

            //the old position
            $(`#${oldPosition}`).removeAttr("data-player");
            $(`#${oldPosition}`).removeClass("player");
            $(`#${oldPosition}`).removeClass(`player${this.user.number}`)
            $(`#${oldPosition}`).addClass("free");

            //the new cell
            $(e.currentTarget).addClass("player");
            $(e.currentTarget).addClass(`player${this.user.number}`);
            
            //update x and y of the current player 
            this.user.updatePlayerPosition(this.user, idOftheWantedPosition);


            if($(e.currentTarget).hasClass("weapon")) {
                let oldWeapon = this.user.weaponName;

                //if it's the first weapon 
                if(this.user.weaponName === "default") {
                    this.user.weaponName = $(e.currentTarget).attr("data-weapon");
                    $(e.currentTarget).removeClass($(e.currentTarget).attr("data-weapon"));
                    $(e.currentTarget).removeClass("weapon");
                    $(e.currentTarget).removeAttr("data-weapon");
                } else {
                    this.user.weaponName = $(e.currentTarget).attr("data-weapon");
                    $(e.currentTarget).removeClass($(e.currentTarget).attr("data-weapon"));
                    $(e.currentTarget).addClass(oldWeapon);
                    $(e.currentTarget).attr("data-weapon", oldWeapon);
                }


                this.user.damages = this.map.weapons[this.user.weaponName].damages;
                
                $(`#weapon-p${this.user.number}`).html(this.map.weapons[this.user.weaponName].nameFR + ` (${this.map.weapons[this.user.weaponName].damages} dommages)`);
            }

            //desactivate the possibilities cells
            $(".green").each(function(){
                $(this).removeClass("green");
            });
            console.log(this.user);
            //pass to the next player
            this.tour += 1;
            this.map.displayMoves(this.getCurrentPlayer());

            //looking if they are next to each others
            if(this.map.lookAround(idOftheWantedPosition, 1) === 1) {
                this.fight();
            };
            
        }.bind(this)); //bind cuz he cant read the method of the class Map
        
    }

    //check if one of the players is dead, to stop the game
    isOneOfThemDead() {
        this.players.forEach( pl => {
            if(pl.life <= 0 ) {
                if(pl.number === 2) {
                    alert("Le joueur 1 gagne la partie");
                } else {
                    alert("Le joueur 2 gagne la partie");
                }
                window.location.reload(true); //reloading the game
            }
        })
    }

    //fight till the end of the game
    fight() {
        this.user = this.getCurrentPlayer();
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        //Displaying an alert
        swalWithBootstrapButtons.fire({
            title: "COMBAT !",
            text: `Combattez-vous jusqu'à la mort ! Joueur ${this.user.number}, c'est à vous d'attaquer avec votre ${this.map.weapons[this.user.weaponName].nameFR}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Je veux l'attaquer !",
            cancelButtonText: 'Je préfère me défendre...',
            reverseButtons: true,
            allowOutsideClick: false
        })
        .then((result) => {
            if (result.value) { //if he clicked on "Je veux l'attaquer"
                //Checking if one of them is defending
                this.user.attack();
                //Display a new (confirmation) alert
                swalWithBootstrapButtons.fire(
                `Coup porté !`,
                this.textToPrompt, //to display exactly the damages according to the user isDefendig attribute
                `success`
                ).then( () => {  //on click on the button " OK "
                    //check if a player is dead or not
                    this.isOneOfThemDead();
                    //if no one is dead, we pass to the other player and fight again
                    this.tour += 1;
                    this.fight();
                })
                
            }// on click on "Je préfère me défendre..." 
            else if (result.dismiss === Swal.DismissReason.cancel) {
                //Displaying an alert
                swalWithBootstrapButtons.fire(
                'Défense activée !',
                'Les dégats reçus sont réduits.',
                'error'
                ).then( () => { //on click on " OK "
                    //changing the state of the player
                    this.user.defense();
                    //pass to the next player and fight again
                    this.tour += 1;
                    this.fight();
                })
            }
        })
    }
}

export {Game}
