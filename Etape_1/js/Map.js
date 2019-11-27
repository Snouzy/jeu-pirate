import { Weapon } from './Weapons.js';
import { Player } from './Player.js';

class Map {
    constructor(nbOfLines, nbOfColumns, nbOfWeapons) {
        this.nbOfLines = nbOfLines;
        this.nbOfColumns = nbOfColumns;
        this.nbOfWeapons = nbOfWeapons;
        this.weapons = {
            gun: new Weapon(
                "gun",
                50,
                random(0, this.nbOfLines),
                random(0, this.nbOfColumns),
            ),
            harpoon: new Weapon(
                "harpoon",
                20,
                random(0, this.nbOfLines),
                random(0, this.nbOfColumns),
            ),
            knife: new Weapon(
                "knife",
                30,
                random(0, this.nbOfLines),
                random(0, this.nbOfColumns),
            ),
            sword: new Weapon(
                "sword",
                40,
                random(0, this.nbOfLines),
                random(0, this.nbOfColumns),
            ),
            default: new Weapon("default", 10, null, null, "coup de poing")
        };
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
            // tdElt.innerHTML = i; //just for info
            $(`#line-${indexOfTheLine}`).append(tdElt);//pushing into the tr element
            x++;
            
            //if there are 10 colmuns
            if ($(`#line-${indexOfTheLine}`).children().length === this.nbOfLines) {
                indexOfTheLine++; //go to the next line
                x = 0; //for the X position of the cell
                y++; //for the Y position of the cell
            }
        }
    }

    generateWalls() {
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
        //to treat the object like an array
        const arrayWeapons = [];
        for (const element in this.weapons) {
            arrayWeapons.push(this.weapons[element]);
        }

        // remove the last (=default weapon) bcs it dont't need to be displayed on the map
        arrayWeapons.pop();

        // loop 'till the nb of weapons is not achieved
        for (let i = 0; i < this.nbOfWeapons; i++) {
            // selecting a random weapon
            const randomIndexWeapon = random(0, arrayWeapons.length);
            const randomWeapon = arrayWeapons[randomIndexWeapon];

            let elPos = `${randomWeapon.x}-${randomWeapon.y}`;
            // adding attribute "pos"
            randomWeapon.pos = elPos;
            // selecting the cell id by the attribute "pos"
            let tdEltId = $(`#${randomWeapon.pos}`);

            //"if" statement won't work bcs it watch only 1 time and then pass though the verification
            while (this.getCellContent(elPos) !== 0) {
                //picking a new pos
                let newXpos = random(0, 10); //10 = the maximum x(width) grid
                let newYpos = random(0, 10); //10 = the maximum y(height) grid

                //assignatate the new pos to the weapon
                randomWeapon.x = newXpos;
                randomWeapon.y = newYpos;
                elPos = newXpos + "-" + newYpos;
                randomWeapon.pos = elPos;

                //selecting a new cell to the weapon
                tdEltId = $(`#${elPos}`);
            }
            //giving class & attribute to the weapon's cell
            tdEltId.addClass(`weapon ${randomWeapon.name}`).attr("data-weapon", randomWeapon.name);
        }
    }

    createPlayers() {
        // get and select the position of each players
        this.players.forEach(el => {
            let elPos = `${el.x}-${el.y}`;
            el.pos = elPos;
            let tdEltId = $(`#${el.pos}`);

            // while the pos is not free OR the pos is free but it's next to a player
            while (
                this.getCellContent(elPos) !== 0 ||
                this.lookAround(elPos, 1) === 1
            ) {
                let newXpos = random(0, 10);
                let newYpos = random(0, 10);
                el.x = newXpos;
                el.y = newYpos;
                elPos = newXpos + "-" + newYpos;
                el.pos = elPos;
                tdEltId = $(`#${elPos}`);
            }

            // managing the cell for player
            tdEltId.removeClass("free");
            tdEltId.addClass("player");
            tdEltId.attr("data-player", `player${el.number}`);
            tdEltId.addClass(tdEltId.attr("data-player"));
        });
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

    // look "nbOfCells" further than the "pos"
    lookAround(pos, nbOfCells) {
        //get the x and y of the pos
        const x = parseInt(pos.charAt(0));
        const y = parseInt(pos.charAt(pos.length - 1));

        // preparing the x and y around the "pos" by the "nbOfCells"
        const yUp = y - nbOfCells;
        const xRight = x + nbOfCells;
        const yDown = y + nbOfCells;
        const xLeft = x - nbOfCells;

        // selecting the cells
        const cellUp = `${x}-${yUp}`;
        const cellRight = `${xRight}-${y}`;
        const cellDown = `${x}-${yDown}`;
        const cellLeft = `${xLeft}-${y}`;

        //if there is a player at the number of cells in paramaters compared to the pos in the parameter
        if (
            this.getCellContent(cellUp) === 3 ||
            this.getCellContent(cellRight) === 3 ||
            this.getCellContent(cellDown) === 3 ||
            this.getCellContent(cellLeft) === 3
        ) {
            return 1;
        }
    }

    init() {
        this.createGrid();
        this.generateWalls();
        this.createPlayers();
        this.generateWeapons();
    }
}

export { Map }
