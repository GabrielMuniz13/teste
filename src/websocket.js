import { io } from "./server.js";
import Game from './squarePoint/class/game.js';
import keyPress from './function/keyPress.js';
const games = [];
io.on("connection", (socket) => {

    socket.on('entrarGame', (salaName)=>{
        const index = findIndexArray(salaName);
        if(index != -1){
            if(!games[index].jogoIniciado){
                games[index].adicionarJogador(socket.id);
                iniciar(index);
            }else{
                socket.emit('error', 'partida em andamento')
            }
        }else{
            games.push(new Game(salaName, socket.id));
        }
    });

    socket.on('reload', ()=>{
        const index = findIndexArrayAndSocket(socket.id);
        if(index.salaIndex != -1){
            games[index.salaIndex].reloadGame();
            socket.emit('update', games[index.salaIndex].getSprits(), socket.id);
            socket.emit('j', games[index.salaIndex].jogadores, socket.id);
        }
    });


    socket.on('keydown', key => {
        const index = findIndexArrayAndSocket(socket.id);
        if(index.salaIndex != -1){
            key = keyPress(key);
            if(key.isValid){
                games[index.salaIndex].jogadores[index.jogadorIndex].updateMovimente(key.key, true);
            }
        }
    });
    socket.on('keyup', key => {
        const index = findIndexArrayAndSocket(socket.id);
        if(index.salaIndex != -1){
            key = keyPress(key);
            if(key.isValid){
                games[index.salaIndex].jogadores[index.jogadorIndex].updateMovimente(key.key, false);
            }
        }
    });
});
function iniciar(index){
    games[index].jogoIniciado = true;
    setInterval(t, 1000 * 1.5);

    function t(){
        games[index].adicionarFruta()
    }
}

//busca index da sala
function findIndexArray(salaName){
    return games.findIndex( (element) => element.id === salaName);
}
//busca index da sala com um determinado socket e retorna o index da sala
function findIndexArrayAndSocket(socket){
    for(let i=0; i<games.length; i++){
        const game = games[i].jogadores;
        for(let j=0; j<game.length; j++){
            if(game[j].id === socket){
                return {salaIndex: i, jogadorIndex: j};
            }
        }
    }
    return {salaIndex: -1, jogadorIndex: -1};
}