import path from 'path';
import fs from 'fs';
export function verifyImg(req){
    if(req.files.length!=2){
        return true;
    }else{
        for(let i=0; i<2;i++){
            const extname = path.extname(req.files[i].originalname).toLowerCase();
            if (extname !== '.png' && extname !== '.jpeg' && extname !== '.jpg') {
                return true;
            }
        };
    }
    return false;
}
export function verifyImgUp(img){
        const extname = path.extname(img.originalname).toLowerCase();
        if (extname !== '.png' && extname !== '.jpeg' && extname !== '.jpg') {
            return true;
        }else{
            return false;
        }
}
export function dellImgError(imgs){
    if (imgs) {
        imgs.map((f)=>{
            fs.unlinkSync(f.path); // Excluir a imagem
        })
    }
}

export function dellImg(imgs){
    if (imgs) {
        imgs.map((f)=>{
            fs.unlinkSync('uploads/'+f);
        })
    }
}