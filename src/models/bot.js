import mongoose from '../database/index.js';


const BotSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    linkPlataforma: {
        type: String,
        required: true
    },
    linkGrupo: {
        type: String,
        required: true
    },
    port: {
        type: String,
        required: true,
        unique: true,
        min: 4
    },
    chatId: {
        type: String,
        required: true
    },
    botToken: {
        type: String,
        required: true,
        default: "6645580967:AAEdtsD5tF_VnCiPHztR9eWBdTDg_-kzioE"
    },
    typeBot:{
        type: String,
        required: true
    },
    arquivoBot:{
        type: String,
        required: true
    },
    pid:{
        type: Number
    },
    execut:{
        type: Boolean,
        required:true,
        default:false
    },
    image1:{
        type: String,
        required:true
    },
    image2:{
        type: String,
        required:true
    }
    
})

export const Bot = mongoose.model('Bot', BotSchema);
