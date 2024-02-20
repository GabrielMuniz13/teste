import  { User }  from "../../models/user.js";
import { Bot } from "../../models/bot.js";
import { dellImg } from "../../services/image.js";

export const setUser = async (req, res) => {
    try {
        const { usuario, nome, telefone, password } = req.body;

        if( await User.findOne({ usuario }))
            return res.status(409).send({
                error: {
                    success: false,
                    status: 409,
                    title: 'Usuário já existe',
                    description: `O usuário ${usuario} já está registrado. Escolha outro nome de usuário.`,
                }
            });
  
        const user = await User.create({
            usuario,
            nome,
            telefone,
            password
        });

        user.password = undefined;

        return res.status(201).send({
            success: true,
            status: 201,
            message: 'Usuário registrado com sucesso',
            data: {
                user
            }
        });
    } catch (error) {
        return res.status(500).send({
            error: {
                success: false,
                status: 500,
                title: 'Erro interno do servidor',
                description: 'Um erro inesperado ocorreu durante o registro do usuário. Tente novamente mais tarde.',
            }
        });
    }
}
export const getUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).send({
                error: {
                    success: false,
                    status: 404,
                    title: 'Usuário não encontrado',
                    description: `Não foi possível encontrar o usuário com o ID ${req.params.id}.`,
                }
            });
        }

        return res.status(200).send({
            success: true,
            status: 200,
            message: 'Usuário encontrado com sucesso',
            data: {
                user
            }
        });
    } catch (error) {
        return res.status(500).send({
            error: {
                success: false,
                status: 500,
                title: 'Erro interno do servidor',
                description: 'Um erro inesperado ocorreu ao buscar o usuário. Tente novamente mais tarde.',
            },
        });
    }
  
}
export const getUsers = async(req, res) => {
    try {
        const users = await User.find();

        if (users.length === 0) {
            return res.status(404).send({
                error: {
                    success: false,
                    status: 404,
                    title: 'Nenhum usuário encontrado',
                    description: 'Não há usuários cadastrados no momento.',
                }
            });
        }
        return res.status(200).send({
            success: true,
            status: 200,
            message: 'Lista de usuários recuperada com sucesso',
            data: {
                users
            }
        });
    } catch (error) {
        return res.status(500).send({
            error: {
                success: false,
                status: 500,
                title: 'Erro interno do servidor',
                description: 'Um erro inesperado ocorreu ao buscar a lista de usuários. Tente novamente mais tarde.',
            },
        });
    }
}
export const updateUser = async(req, res) => {
    try {
        const { nome, telefone, password } = req.body;
        const userId = req.params.id;
        const user = await User.findByIdAndUpdate(userId,{
            nome,
            telefone,
            password
        }, { new: true, runValidators: true});
        if (!user) {
            return res.status(404).send({
                error: {
                    success: false,
                    status: 404,
                    title: 'Usuário não encontrado',
                    description: `Não foi possível encontrar o usuário com o ID ${userId}.`,
                }
            });
        }
        return res.status(200).send({
            success: true,
            status: 200,
            message: 'Usuário atualizado com sucesso',
            data: {
                user
            }
        });
    } catch (error) {
        return res.status(500).send({
            error: {
                success: false,
                status: 500,
                title: 'Erro interno do servidor',
                description: 'Um erro inesperado ocorreu ao buscar o usuário. Tente novamente mais tarde.',
            },
        });
    }
}
export const deleteUser = async(req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({
                error: {
                    success: false,
                    status: 404,
                    title: 'Usuário não encontrado',
                    description: `Não foi possível encontrar o usuário com o ID ${userId}.`,
                }
            });
        }

        if (user.isAdmin) {
            return res.status(403).send({
                error: {
                    success: false,
                    status: 403,
                    title: 'Acesso negado',
                    description: 'Não é permitido excluir um administrador.',
                }
            });
        }



        const bots = await Bot.find({ user: userId}).exec();
        if(bots.length === 0){
            await User.findByIdAndDelete(userId)
            return res.send({
                success: true,
                status: 200,
                message: 'Usuário excluído com sucesso',
            });
        }else{
            for (const bot of bots) {
                if (bot.execut) {
                    return res.status(400).send({
                        error: {
                            success: false,
                            status: 400,
                            title: 'Exclusão do usuário falhou',
                            description: `Não é possível excluir o usuário ${userId} porque o bot ${bot.pid} está atualmente em execução.`,
                        }
                    });
                }
            }
            bots.map((b)=>{
                dellImg([b.image1, b.image2]);
            })
            await Bot.deleteMany({ user: userId})
            await User.findByIdAndDelete(userId)
            return res.send({
                success: true,
                status: 200,
                message: 'Usuário excluído com sucesso',
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error: {
                success: false,
                status: 500,
                title: 'Erro interno do servidor',
                description: 'Um erro inesperado ocorreu. Tente novamente mais tarde.',
            }
        });
    }
}

