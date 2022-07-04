import Game from "./class/game.js"
const game1 = new Game('sas');
game1.adicionarJogador('socketfndfds');
for(let i=0; i<10000; i++){   
    game1.adicionarFruta();
}
console.log(game1.reloadGame());

console.log(game1.jogadores)