import mongoose from '../database/index.js';
import bcryptjs from "bcryptjs";

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        maxlength: 40,
        minlength: 4
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
        select: false
    },
    usuario: { 
        type: String,
        required: true,
        unique: true,
        maxlength: 20,
        minlength: 4,
        lowercase: true
    },
    telefone: { 
        type: String,
        required: true,
        maxlength: 15,
        minlength: 10
    },
    password: { 
        type: String,
        required: true,
        maxlength: 20,
        minlength: 4,
        select: false
    }
})

UserSchema.pre('save', async function(next){
    const hash = await bcryptjs.hash(this.password, 10);
    this.password = hash;

    next();
})
export const User = mongoose.model('User', UserSchema);
