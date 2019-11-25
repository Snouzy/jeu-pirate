import { Weapon } from './Weapons.js';

class Map {
    constructor(nbOfLines, nbOfColumns, nbOfWeapons, game) {
        this.nbOfLines = nbOfLines;
        this.nbOfColumns = nbOfColumns;
        this.nbOfWeapons = nbOfWeapons;
        this.game = game;
        this.weapons = {
            "gun" : new Weapon("gun", 50, random(0, this.nbOfLines), random(0, this.nbOfColumns), "pistolet"),
            "harpoon" : new Weapon("harpoon", 20, random(0, this.nbOfLines), random(0, this.nbOfColumns), "harpon"),
            "knife" : new Weapon("knife", 30, random(0, this.nbOfLines), random(0, this.nbOfColumns), "couteau"),
            "sword" : new Weapon("sword", 40, random(0, this.nbOfLines), random(0, this.nbOfColumns), "épée"),
            "default" : new Weapon("default", 10, null, null, "coup de poing")
        };
    }

    //create the structure of the map (<tr> + <td> elements)
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
            // tdElt.innerHTML = i; //just for info
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

    //generating random walls(barrels) & avoiding conflicts
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

    //generating random weapons & avoiding conflicts
    generateWeapons() {
        //to treat the object like an array
        const arrayWeapons = [];
        for(const element in this.weapons) {
            arrayWeapons.push(this.weapons[element]);
        }

        //remove the last (=default weapon) bcs it dont't need to be displayed on the map
        arrayWeapons.pop();
        
        for(let i = 0; i < this.nbOfWeapons; i++) {
            let randomIndexWeapon = random(0, arrayWeapons.length);
            let randomWeapon = arrayWeapons[randomIndexWeapon];

                let elPos = `${randomWeapon.x}-${randomWeapon.y}`;
                //add attribute
                randomWeapon.pos = elPos;
                //select the id
                let tdEltId = $(`#${randomWeapon.pos}`);
                
                //"if" don't work bcs it watch only 1 time and then pass though the verification
                while(this.getCellContent(elPos) !== 0) {
                    let newXpos = random(0,10); //10 = the maximum x(width) grid
                    let newYpos = random(0,10); //10 = the maximum y(height) grid
                    randomWeapon.x = newXpos;
                    randomWeapon.y = newYpos;
                    elPos = newXpos+"-"+newYpos;
                    randomWeapon.pos = elPos;
                    tdEltId = $(`#${elPos}`);
                }
                tdEltId.addClass(`weapon ${randomWeapon.name}`);
                tdEltId.attr("data-weapon", randomWeapon.name);
        }
    }

    //creating players & avoiding conflicts
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
            

            //while the pos is not free OR the pos is free but it's next to a player
            while(this.getCellContent(elPos) !== 0 || this.lookAround(elPos, 1) === 1 ) {

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

    //return the content of the cell
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

    //get the position of the wanted player
    getPlayerPosition(player) {
        return player.x + "-" + player.y; //return a string
    }

    //Look "nbOfCells" further than the "pos"
    lookAround(pos, nbOfCells) {
        const x = parseInt(pos.charAt(0));
        const y = parseInt(pos.charAt(pos.length - 1));

        const xRight = x + nbOfCells;
        const xLeft = x - nbOfCells;
        const yUp = y - nbOfCells;
        const yDown = y + nbOfCells;

        const cellUp = `${x}-${yUp}`;
        const cellRight = `${xRight}-${y}`;
        const cellDown = `${x}-${yDown}`;
        const cellLeft = `${xLeft}-${y}`;

        //if there is a player at the number of cells in paramaters compared to the pos in the parameter
        if(this.getCellContent(cellUp) === 3 || this.getCellContent(cellRight) === 3 || this.getCellContent(cellDown) === 3 || this.getCellContent(cellLeft) === 3){
            return 1;
        }

    }

    //Show the possibles moves
    displayMoves(player) {
        let x = player.x;
        let y = player.y
        let maxMoves = 3;
        let i;
        
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
    }
}

export {Map} 