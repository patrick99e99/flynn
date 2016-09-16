if (typeof Game == "undefined") {
   var Game = {};  // Create namespace
}

Game.Points = {
    SHIP:   [6,0,-3,-3,-2,0,-3,3,6,0],
    SHIPB:  [0,-6,1,-3,2,-4,3,2,0,1,-3,2,-2,-4,-1,-3,0,-6],
    POINTY_SHIP: [3,0,5,-2,1,-1,2,-3,-3,-6,0,-3,-1,-1,-2,-1,-1,0,-2,1,-1,1,0,3,-3,6,2,3,1,1,5,2,3,0],
    ABSTRACT: [5,-1,5,1,2,2,2,-2,-2,2,-2,-2,-5,-1,-5,1,-2,2,2,2,-2,-2,-1,-5,1,-5,2,-2,-2,-2,-2,2,-1,5,1,5,2,2,2,-2,5,-1],
    STAR_WING: [7,0,4,-2,2,-1,0,-2,1,-4,-1,-2,-2,-2,-2,-1,-1,0,-2,1,-2,2,-1,2,1,4,0,2,2,1,4,2,7,0],
    RESPAWN: [1,-2,0,-6,-1,-2,-3,-3,-2,-1,-6,0,-2,1,-3,3,-1,2,0,6,1,2,3,3,2,1,6,0,2,-1,3,-3,1,-2],
};