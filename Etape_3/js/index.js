import { Game } from "./Game.js";

//generate a random number between min & max
window.random = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};


$(document).ready(function() {
    Swal.fire(
        'Bienvenue !',
        `<b>Règles du jeu :</b> <br> <br>Sur un air marin, deux joueurs positionnés aléatoirement sans se toucher s'affrontent dans un combat mortel. <br><br>
        Des obstacles seront de la partie, eux aussi positionnés aléatoirement.
        Pour que le combat soit le plus exitant possible, 4 armes aux dégâts variables seront positionnées aléatoirement sur la carte.
        Les joueurs pourront se déplacer chacun leur tour dans l'une des quatres directions suivantes : nord, est, sud, ouest mais uniquement de trois à six cases sauf dans le cas où il y aurait un obstacle ou un des bords de la carte. <br><br>
        Si un joueur se positionne sur une case contenant une arme, il prend l'arme de la case et pose son arme actuelle sur celle-ci, sauf s'il n'a que son coup de poing (qu'il gardera avec lui...).
        <br><br>
        Lorsque que les deux joueurs sont côte à côte, le combat commencer et
        chaque joueur attaque chacun son tour. <br>
        Les dégâts infligés dépendent de l’arme possédée par le joueur. <br>
        Le joueur peut choisir d’attaquer ou de se défendre contre le prochain coup.
        Lorsque le joueur se défend, il encaisse 50% de dégâts en moins qu’en temps normal. <br><br>
        Dès que les points de vie d’un joueur (initialement à 100) tombent à 0, celui-ci a perdu. Un message s’affiche et la partie est terminée.`,

        'info'
    )
    new Game().initGame();
});
