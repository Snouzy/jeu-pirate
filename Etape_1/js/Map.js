import { Weapon } from './Weapons.js';
import { Player } from './Player.js';

class Map {
    constructor(nbOfLines, nbOfColumns) {
        this.nbOfLines = nbOfLines;
        this.nbOfColumns = nbOfColumns;

        this.weapons = [
            new Weapon("gun", 50, random(0, this.nbOfLines), random(0, this.nbOfColumns), "../imgs/guns/gun.png"),
            new Weapon("harpoon", 50, random(0, this.nbOfLines), random(0, this.nbOfColumns), "../imgs/guns/harpoon.png"),
            new Weapon("knife", 50, random(0, this.nbOfLines), random(0, this.nbOfColumns), "../imgs/guns/knife.png"),
            new Weapon("sword", 50, random(0, this.nbOfLines), random(0, this.nbOfColumns), "../imgs/guns/sword.png")
        ];
        this.players = [
            new Player(1, 10, random(0, this.nbOfLines), random(0, this.nbOfColumns),"../imgs/characters/player1.png"),
            new Player(2, 10, random(0, this.nbOfLines), random(0, this.nbOfColumns),"../imgs/characters/player2.png")
        ]
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
        let randomTd = tdElts[Math.floor(Math.random() * tdElts.length)];
        
        let i;
        for(i = 0; i < randomNumber; i++) {
            
            while(this.getCellContent(randomTd.id) !== 0) {
                let newRandomTd = tdElts[Math.floor(Math.random() * tdElts.length)];
                randomTd = newRandomTd;
            }
            randomTd.className += "greyed";
        }
    }

    generateWeapons() {
        this.weapons.forEach(el => {
            let elPos = `${el.x}-${el.y}`;
            el.pos = elPos;
            let tdEltId = $(`#${el.pos}`);
            
            while(this.getCellContent(elPos) !== 0) {
                let newXpos = random(0,10);
                let newYpos = random(0,10);
                el.x = newXpos;
                el.y = newYpos;
                elPos = newXpos+"-"+newYpos;
                el.pos = elPos;
                tdEltId = $(`#${elPos}`);
            }
            tdEltId.addClass("weapon");
            tdEltId.css("background", `url(${el.src})`);
            tdEltId.css("background-size", `100% 100%`);
            tdEltId.css("background-repeat", `no-repeat`);
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
        else {
            return 0
        }
    }

    createPlayers() {
        this.players.forEach(el => {
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

                console.log("No place for the player " + el.number);
                console.log("His position was " + el.pos);

                let newXpos = random(0,10);
                let newYpos = random(0,10);
                el.x = newXpos;
                el.y = newYpos;
                elPos = newXpos+"-"+newYpos;
                el.pos = elPos;
                tdEltId = $(`#${elPos}`);
                console.log("His new position is : " + el.pos);
                
            }
            tdEltId.addClass("player");
            tdEltId.css("background", `url(${el.src})`);
            tdEltId.css("background-size", `100% 100%`);
            tdEltId.css("background-repeat", `no-repeat`);
        })
    }

    init() {
        this.createGrid();
        this.generateGreyBoxes();
        this.generateWeapons();
        console.log("----------------createPlayers----------------");
        this.createPlayers();
        console.log("----------------END CreatePlayers----------------")
    }
}

export { Map }
