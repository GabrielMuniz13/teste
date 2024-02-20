import multer from "multer";
import path from 'path';



const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.resolve("uploads"));
    },
    filename: (req, file, callback)=>{
        const time = new Date().getTime();
        callback(null, `${time}_${file.originalname}`);
    }

})

export const upload = multer({ storage: storage })