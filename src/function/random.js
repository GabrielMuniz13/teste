export default function random (widthCanvas, widthSprite){
    return Math.floor(Math.random() * (widthCanvas - widthSprite));
}