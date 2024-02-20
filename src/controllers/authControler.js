import  { User }  from "../models/user.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

function generateToken(user, type){
    return jsonwebtoken.sign({ id:user, type:type}, process.env.JWT_SECRET, {
        expiresIn: 86400
    })
    
}

export const authenticate = async (req, res) => {
    try {
        const { usuario, password } = req.body
        const user = await User.findOne({ usuario }).select('+password isAdmin');
        
        if(!user)
            return res.status(400).send({ error:'Dados incorretos' })
        if(!await bcryptjs.compare(password, user.password))
            return res.status(400).send({ error:'Dados incorretos' })

        user.password=undefined;
        const token = generateToken(user.id, user.isAdmin);

        return res.send({ user, token })
    } catch (error) {
        console.log(error)
        return res.status(400).send({ error: "Authenticate failed" })
    }
}

