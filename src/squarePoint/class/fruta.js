import random from '../../function/random.js';

class Fruta {
    WIDTH = 10;
    constructor(widthCanvas) {
        this.x = random( widthCanvas, this.WIDTH);
        this.y = random( widthCanvas, this.WIDTH);

        const dados = generate();

        this.speed = dados.speed;
        this.cor = dados.cor;
        this.ponto = dados.ponto;

    }
}
//8, 9, 10 -> chance de ficar super lento --- vermelho
// 5, 6, 7 -> chance de ficar lento ou rapido --- verde
// 1 a 4 -> velocidade normal --- preto
function generate(){
    const ponto = generatePonto();
    if(ponto<5){
        //preto
        return {
            ponto: ponto,
            cor: '#000000',
            speed: 1
        }
    }else if(ponto<8){
        //verde
        return {
            ponto: ponto,
            cor: '#008000',
            speed: Math.random() * (2 - 0.4) + 0.4
        }
    }else{
        //vermelho
        return {
            ponto: ponto,
            cor: '#FF0000',
            speed: Math.random() * (0.7 - 0.1) + 0.1
        }
    }
    
}

function generatePonto(){
    let pontos = [];
    for (let i = 0; i < 10 ; i++) {
        if(i<6){
            pontos.push(1);
        }else{
            const p = Math.floor(Math.random() * 10 + 1);
            pontos.push(p);
        }
    }
    pontos = embaralha(pontos);
    const i = Math.floor(Math.random() * 10)
    return pontos[i];
}

function embaralha(arrayPontos) {
    for (let index = arrayPontos.length; index; index--) {
        const indexAleatorio = Math.floor(Math.random() * index);
        const elemento = arrayPontos[index - 1];
        arrayPontos[index - 1] = arrayPontos[indexAleatorio]; 
        arrayPontos[indexAleatorio] = elemento;
    }
    return arrayPontos;
}
export default Fruta;