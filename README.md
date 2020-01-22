## Démo
https://jeu-pirate.snouzy.com

## Consignes

Réalisez un jeu de combat en JS POO. Celui-ci se jouera à deux, sur un même navigateur, au tour par tour. Les deux joueurs pourront se déplacer sur une carte de 10x10 cases et se battre entre eux lorsqu'ils se croisent.

### La carte

Créez une carte de 10x10 représentant le monde du jeu. Son initialisation sera aléatoire à chaque chargement de nouvelle partie. Chaque case peut être soit :

-   Vide
-   Inaccessible (grisée)

### [](https://github.com/ame-OpenClassrooms/JS---Jeu-tour-par-tour#les-armes)Les armes

Sur la carte, un nombre limité d'armes (4 maximum) sera placé aléatoirement et pourra être récolté par les joueurs qui passeraient dessus.

Vous inventerez au moins 4 types d'arme dans le jeu, avec des dégâts différents. L'arme par défaut qui équipe les joueurs doit infliger 10 points de dégâts. Chaque arme a un nom et un visuel associé.

### [](https://github.com/ame-OpenClassrooms/JS---Jeu-tour-par-tour#le-placement-initial)Le placement initial

Le placement des deux joueurs est lui aussi aléatoire sur la carte au chargement de la partie. Ils ne doivent pas se toucher.

### [](https://github.com/ame-OpenClassrooms/JS---Jeu-tour-par-tour#les-d%C3%A9placements)Les déplacements

A chaque tour, un joueur peut se déplacer d’une à trois cases (horizontalement ou verticalement) avant de terminer son tour.

### [](https://github.com/ame-OpenClassrooms/JS---Jeu-tour-par-tour#le-changement-darmes)Le changement d'armes

Si un joueur passe sur une case contenant une arme, il laisse son arme actuelle sur place et la remplace par la nouvelle.

### [](https://github.com/ame-OpenClassrooms/JS---Jeu-tour-par-tour#la-rencontre-entre-2-joueurs)La rencontre entre 2 joueurs

Si les joueurs se croisent sur des cases adjacentes (horizontalement ou verticalement), un combat à mort s’engage.
