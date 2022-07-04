import Fruta from './fruta.js';
import Jogador from './jogador.js';

class Game{
    WIDTH_CANVAS = 600;
    jogadores = [];
    frutas = [];
    jogoIniciado = false;
    constructor(id, socket) {
        this.id = id;
        this.adicionarJogador(socket);
    }

    reloadGame(){
        this.jogadores.map(j => {
            j.updatePosition();
        });
        this.frutaColised();
    }

    frutaColised(){
        for(let i=0; i<this.jogadores.length;i++){
            for(let j=0; j<this.frutas.length; j++){
                if (this.jogadores[i].x < this.frutas[j].x + this.frutas[j].WIDTH &&
                    this.jogadores[i].x + this.jogadores[i].WIDTH > this.frutas[j].x &&
                    this.jogadores[i].y < this.frutas[j].y + this.frutas[j].WIDTH &&
                    this.jogadores[i].y + this.jogadores[i].WIDTH > this.frutas[j].y) 
                    {
                        this.jogadores[i].toScore(this.frutas[j].ponto);
                        this.jogadores[i].updateSpeedBonus(this.frutas[j].speed);

                        this.removerFruta(j);
                }
            }
        }
    }

    getSprits(){
        return this.jogadores.concat(this.frutas);
    }
    adicionarJogador(socket){
        this.jogadores.push(new Jogador(this.WIDTH_CANVAS, socket))
    }
    removerJogador(jogador){
        this.jogador.splice(jogador, 1)
    }
    adicionarFruta(){
        this.frutas.push(new Fruta(this.WIDTH_CANVAS))
    }
    removerFruta(fruta){
        this.frutas.splice(fruta, 1)
    }
}
export default Game;


