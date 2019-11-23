import { Weapon } from './Weapons.js';

class Map {
    constructor(nbOfLines, nbOfColumns, game) {
        this.nbOfLines = nbOfLines;
        this.nbOfColumns = nbOfColumns;
        this.game = game;
        this.weapons = [
            new Weapon("gun", 50, random(0, this.nbOfLines), random(0, this.nbOfColumns)),
            new Weapon("harpoon", 10, random(0, this.nbOfLines), random(0, this.nbOfColumns)),
            new Weapon("knife", 20, random(0, this.nbOfLines), random(0, this.nbOfColumns)),
            new Weapon("sword", 30, random(0, this.nbOfLines), random(0, this.nbOfColumns))
        ];
    }

    createGrid() {
        let indexOfTheLine = 0;
        let numberOfBoxes = this.nbOfLines * this.nbOfColumns;
        let i;
        let j;
        let x = 0;
        let y = 0;

        //create the lines
        for(j = 0; j < this.nbOfLines; j++) {
            const trElt = document.createElement('tr');
            trElt.id = `line-${j}`;
            $('table').append(trElt);
        }
        //create the cells
        for (i=0; i < numberOfBoxes; i++) {
            const tdElt = document.createElement('td');
            tdElt.id = `${x}-${y}`; //each td as a unique id -> his x/y position
            tdElt.innerHTML = i; //just for info
            tdElt.classList.add("free");
            $(tdElt).attr("data-value", i);
            $(`#line-${indexOfTheLine}`).append(tdElt);//pushing into the tr element
            x++;
            
            //if there are 10 colmuns
            if ($(`#line-${indexOfTheLine}`).children().length === 10) {
                indexOfTheLine++; //go to the next line
                x = 0; //for the X position of the cell
                y++; //for the Y position of the cell
            }
        }
    }

    generateGreyBoxes() {
        const tdElts = $('td');
        const min = 10;
        const max = 15;
        const randomNumber = random(min,max);// number of greyed boxes
        
        for(let i = 0; i < randomNumber; i++) {
            let index = random(0, tdElts.length);
            let randomTdElt = tdElts[index];

            //the cell is not free
            while(this.getCellContent(randomTdElt.id) !== 0) {
                index = random(0,tdElts.length);
                randomTdElt = tdElts[index];
            }
            $(randomTdElt).removeClass("free");
            $(randomTdElt).addClass("greyed");

        }
    }

    generateWeapons() {
        this.weapons.forEach(el => {
            let elPos = `${el.x}-${el.y}`;
            //add attribute
            el.pos = elPos;
            let tdEltId = $(`#${el.pos}`);
            
            //if don't work bcs it watch only 1 time and then pass though the verification
            while(this.getCellContent(elPos) !== 0) {
                let newXpos = random(0,10);
                let newYpos = random(0,10);
                el.x = newXpos;
                el.y = newYpos;
                elPos = newXpos+"-"+newYpos;
                el.pos = elPos;
                tdEltId = $(`#${elPos}`);
            }
                tdEltId.addClass(`weapon ${el.name}`);
                tdEltId.attr("data-weapon", el.name);
        })
    }

    createPlayers() {
        this.game.players.forEach(el => {
            let elPos = `${el.x}-${el.y}`;
            el.pos = elPos;
            let tdEltId = $(`#${el.pos}`);
            //if players are next to them
            let cellLeft = el.x - 1 + "-" + el.y;
            let cellRight = el.x + 1 + "-" + el.y;
            let cellUp = el.x + "-" + parseInt(el.y - 1) ;
            let cellDown = el.x + "-" + parseInt(el.y + 1);
            

            //while it's a wall, a weapon or another player next to the pos, we change the position of the element
            while(this.getCellContent(elPos) !== 0 || this.getCellContent(cellLeft) === 3 || this.getCellContent(cellRight) === 3  || this.getCellContent(cellUp) === 3  || this.getCellContent(cellDown) === 3 ) {

                let newXpos = random(0,10);
                let newYpos = random(0,10);
                el.x = newXpos;
                el.y = newYpos;
                elPos = newXpos+"-"+newYpos;
                el.pos = elPos;
                tdEltId = $(`#${elPos}`);
                
            }
            tdEltId.removeClass("free");
            tdEltId.addClass("player");
            tdEltId.attr("data-player", `player${el.number}`);
            tdEltId.addClass(tdEltId.attr("data-player"));
        })
    }

    getCellContent(pos) {
        let posTd = $(`#${pos}`);

        if($(posTd).hasClass("greyed")) {
            return 1
        }
        else if($(posTd).hasClass("weapon")) {
            return 2
        }
        else if($(posTd).hasClass("player")){
            return 3
        }
        else if(pos.match(/-/g).length !== 1) { //if there are 2 " - " in the pos : the pos is out of the map
            return 4
        }
        else {
            return 0
        }
    }

    getPlayerPosition(player) {
        return player.x + "-" + player.y;
    }

    lookAround(pos) {
        let x = parseInt(pos.charAt(0));
        let y = parseInt(pos.charAt(pos.length - 1));

        let xRight = x + 1;
        let xLeft = x - 1;
        let yUp = y - 1;
        let yDown = y + 1;

        let cellUp = `#${x}-${yUp}`;
        let cellRight = `#${xRight}-${y}`;
        let cellDown = `#${x}-${yDown}`;
        let cellLeft = `#${xLeft}-${y}`


        if($(cellUp).hasClass("player") || $(cellRight).hasClass("player") || $(cellDown).hasClass("player") || $(cellLeft).hasClass("player")){
            return 1;
        }

    }

    //Show the possible moves
    displayMoves(player) {
        console.log("----------------displayMoves----------------");
        let x = player.x;
        let y = player.y
        let playerPosition = x + "-" + y;
        let maxMoves = 3;
        let i;

        console.log("INFO : Position du joueur " + player.number + " : " + playerPosition);

        // this.possibleMoves.length = 0;
        for(i = 1; i <= maxMoves; i++) {
            let positionUp = x + "-" + (y - i);

            //Si c'est un joueur ou un mur
            if(this.getCellContent(positionUp) ===  1 || this.getCellContent(positionUp) === 3) {
                break
            } else {
                $(`#${positionUp}`).addClass("green");
            }
        }

        for(i = 1; i <= maxMoves; i++) { 
            let positionRight = (x + i) + "-" + y;

            //Si c'est un joueur ou un mur
            if(this.getCellContent(positionRight) === 1 || this.getCellContent(positionRight) === 3 ) {
                break
            } else {
                $(`#${positionRight}`).addClass("green");
            }
        }

        for(i = 1; i <= maxMoves; i++) {
            let positionDown = x + "-" + (y + i);

            //Si c'est un joueur ou un mur
            if(this.getCellContent(positionDown) === 1 || this.getCellContent(positionDown) === 3 ) {
                break
            } else {
                $(`#${positionDown}`).addClass("green");
            }
        }

        for(i = 1; i <= maxMoves; i++) {
            let positionLeft = (x - i) + "-" + y;

            //Si c'est un joueur ou un mur
            if(this.getCellContent(positionLeft) === 1 || this.getCellContent(positionLeft) === 3 ) {
                break
            } else {
                $(`#${positionLeft}`).addClass("green");
            }
        }
        console.log("----------------END displayMoves----------------");
    }
}

export {Map} 
