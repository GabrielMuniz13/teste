import random from '../../function/random.js';

class Jogador {
    WIDTH = 37;
    SPEED = 3.5;
    cor = '#000000';
    speedBonus = 1;
    score = 0;
    movement= [false, false, false, false];
    constructor(widthCanvas, id) {
        this.canvasWidth = widthCanvas;
        this.x = random( widthCanvas, this.WIDTH);
        this.y = random( widthCanvas, this.WIDTH);
        this.id=id;
    }

    updateMovimente(key, b){
        if(key === 0 && key !== 1){
            this.movement[key] = b;
            this.updatePosition();
        }
        //Direita
        if(key === 1 && key !== 0){
            this.movement[key] = b;
            this.updatePosition();
        }
        //Para Cima
        if(key === 2 && key !== 3){
            this.movement[key] = b;
            this.updatePosition();
        }
        //Para Baixo
        if(key === 3 && key !== 2){
            this.movement[key] = b;
            this.updatePosition();
        }
    }

    updatePosition(){
        if(this.movement[0] && this.x > 0){
            this.x-=this.SPEED*this.speedBonus;
        }
        if(this.movement[1]  && this.x < (this.canvasWidth - this.WIDTH)){
            this.x+=this.SPEED*this.speedBonus;
        }
        if(this.movement[2] && this.y > 0){
            this.y-=this.SPEED*this.speedBonus;
        }
        if(this.movement[3] && this.y < (this.canvasWidth - this.WIDTH)){
            this.y+=this.SPEED*this.speedBonus;
        }
    }

    toScore(pontos){
        this.score+=pontos;
    }
    updateSpeedBonus(speedBonus){
        this.speedBonus = speedBonus;
    }
}

export default Jogador;