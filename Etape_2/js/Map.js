import {
    Weapon
} from './Weapons.js';

class Map {
    constructor(nbOfLines, nbOfColumns, nbOfWeapons, game) {
        this.nbOfLines = nbOfLines;
        this.nbOfColumns = nbOfColumns;
        this.nbOfWeapons = nbOfWeapons;
        this.game = game;
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
    }

    // create the structure of the map (<tr> + <td> elements)
    createGrid() {
        let indexOfTheLine = 0;
        const numberOfBoxes = this.nbOfLines * this.nbOfColumns;
        let i;
        let j;
        let x = 0;
        let y = 0;

        //create the lines
        for (j = 0; j < this.nbOfLines; j++) {
            const trElt = document.createElement('tr');
            trElt.id = `line-${j}`;
            $('table').append(trElt);
        }
        //create the cells
        for (i = 0; i < numberOfBoxes; i++) {
            const tdElt = document.createElement('td');
            tdElt.id = `${x}-${y}`; //each td as a unique id -> his x/y position
            // tdElt.innerHTML = i; //just for info
            tdElt.classList.add("free");
            $(tdElt).attr("data-value", i);
            $(`#line-${indexOfTheLine}`).append(tdElt); //pushing into the tr element
            x++;

            //if there are 10 colmuns
            if ($(`#line-${indexOfTheLine}`).children().length === this.nbOfLines) {
                indexOfTheLine++; //go to the next line
                x = 0; //for the X position of the cell
                y++; //for the Y position of the cell
            }
        }
    }

    // generating random walls & avoiding conflicts
    generateWalls() {
        const tdElts = $('td');
        // the number of the walls will be in this interval
        const min = 10;
        const max = 15;
        const randomNumber = random(min, max); // number of walls

        for (let i = 0; i < randomNumber; i++) {
            // selecting a random <td> element
            let index = random(0, tdElts.length);
            let randomTdElt = tdElts[index];

            // while the <td> element is not free
            while (this.getCellContent(randomTdElt.id) !== 0) {
                // reassign a new <td>
                index = random(0, tdElts.length);
                randomTdElt = tdElts[index];
            }

            // managing the cell for the wall
            $(randomTdElt).removeClass("free");
            $(randomTdElt).addClass("greyed");

        }
    }

    // generating random weapons & avoiding conflicts
    generateWeapons() {
        //to treat the object like an array
        const arrayWeapons = [];
        for (const element in this.weapons) {
            arrayWeapons.push(this.weapons[element]);
        }

        //remove the last (=default weapon) bcs it dont't need to be displayed on the map
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

    // creating players & avoiding conflicts
    createPlayers() {
        // get and select the position of each players
        this.game.players.forEach(el => {
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

    // return the content of the cell
    getCellContent(pos) {
        let posTd = $(`#${pos}`);

        if ($(posTd).hasClass("greyed")) {
            return 1
        } else if ($(posTd).hasClass("weapon")) {
            return 2
        } else if ($(posTd).hasClass("player")) {
            return 3
        } else if (pos.match(/-/g).length !== 1) { //if there are 2 " - " in the pos : the pos is out of the map
            return 4
        } else {
            return 0
        }
    }

    // get the position of the wanted player
    getPlayerPosition(player) {
        return player.x + "-" + player.y;
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

    // show the possible moves
    displayMoves(player) {
        let x = player.x;
        let y = player.y
        let maxMoves = 3;
        let i;

        // feature : he shall not pass though a wall =>
        // looking for each cell if it's not a wall or a player
        for (i = 1; i <= maxMoves; i++) {
            let positionUp = x + "-" + (y - i);

            //Si c'est un joueur ou un mur
            if (this.getCellContent(positionUp) === 1 
            || this.getCellContent(positionUp) === 3) {
                break
            } else {
                $(`#${positionUp}`).addClass("green");
            }
        }

        for (i = 1; i <= maxMoves; i++) {
            let positionRight = (x + i) + "-" + y;

            //Si c'est un joueur ou un mur
            if (this.getCellContent(positionRight) === 1 || this.getCellContent(positionRight) === 3) {
                break
            } else {
                $(`#${positionRight}`).addClass("green");
            }
        }

        for (i = 1; i <= maxMoves; i++) {
            let positionDown = x + "-" + (y + i);

            //Si c'est un joueur ou un mur
            if (this.getCellContent(positionDown) === 1 || this.getCellContent(positionDown) === 3) {
                break
            } else {
                $(`#${positionDown}`).addClass("green");
            }
        }

        for (i = 1; i <= maxMoves; i++) {
            let positionLeft = (x - i) + "-" + y;

            //Si c'est un joueur ou un mur
            if (this.getCellContent(positionLeft) === 1 || this.getCellContent(positionLeft) === 3) {
                break
            } else {
                $(`#${positionLeft}`).addClass("green");
            }
        }
    }
}

export {
    Map
}