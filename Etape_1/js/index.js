import { Weapon }  from './Weapons.js';
import { Player } from './Player.js';
import { Map } from './Map.js';


//generate a random number between min & max
window.random = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

$(document).ready(function() {
    new Map(10,10).init();
});