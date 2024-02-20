import validUrl from 'valid-url';
import { Bot } from "../../models/bot.js";
import { User } from "../../models/user.js";
import pidIsRuning from '../../services/pidIsRuning.js';
import { verifyImg, verifyImgUp, dellImgError, dellImg } from '../../services/image.js';
import { startBotService, killBotService } from '../../services/botServices.js';




export const getBot = async(req, res) => {
    try {
        const bot = await Bot.findById(req.params.id).populate('user')
        // Lógica para obter um usuário por ID
        if(!bot)
            return res.status(404).send({
                error: {
                    success: false,
                    status: 404,
                    title: 'Bot não encontrado',
                    description: `O bot com o ID ${req.params.id} não foi encontrado.`,
                }
            });

        return res.status(200).send({
            success: true,
            status: 200,
            message: 'Bot encontrado com sucesso',
            data: {
              bot: bot,
            },
          });
    } catch (error) {
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
export const getBots = async(req, res) => {
    try {
        const bots = await Bot.find().populate('user');
        if (bots.length === 0) {
            return res.status(404).send({
                success: true,
                status: 404,
                message: 'Nenhum bot cadastrado',
                data: {
                    bots: [],
                },
            });
        }
        return res.status(200).send({
            success: true,
            status: 200,
            message: 'Bots cadastrados',
            data: {
                bots: bots,
            },
        });

    } catch (error) {
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
export const setBot = async(req, res) => {
    try {
        if(verifyImg(req)){
            dellImgError(req.files)
            return res.status(400).send({
                error: {
                    success: false,
                    status: 400,
                    title: 'Erro na imagem',
                    description: 'O formato ou conteúdo da imagem é inválido.',
                }
            });
        }
        const { port, linkPlataforma, linkGrupo } = req.body;
        if(port==27017 || port==3000){
            dellImgError(req.files)
            return res.status(400).send({
                error: {
                    success: false,
                    status: 400,
                    title: 'Porta inválida',
                    description: 'Selecione outra porta para o bot.',
                }
            });
        }
        if(!validUrl.isUri(linkPlataforma) || !validUrl.isUri(linkGrupo)){
            dellImgError(req.files)
            return res.status(400).send({
                error: {
                    success: false,
                    status: 400,
                    title: 'Link inválido',
                    description: 'O link da plataforma ou do grupo é inválido.',
                }
            });
        }
        if(await Bot.findOne({ port })){
            dellImgError(req.files)
            return res.status(400).send({
                error: {
                    success: false,
                    status: 400,
                    title: 'Porta já em uso',
                    description: 'Selecione outra porta, esta já está em uso por outro bot.',
                }
            });
        }
        const user = await User.findById(req.body.user)
        if(!user){
            dellImgError(req.files)
            return res.status(400).send({
                error: {
                    success: false,
                    status: 400,
                    title: 'Usuário inexistente',
                    description: 'O usuário especificado não foi encontrado. Selecione um usuário válido.',
                }
            });
        }
        const bot = await Bot.create({
            ...req.body,
            image1: req.files[0].filename,
            image2: req.files[1].filename
        });
        return res.status(201).send({
            success: true,
            status: 201,
            message: 'Bot cadastrado',
            data: {
                bot: bot,
            }
        });
    } catch (error) {
        dellImgError(req.files)
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
export const updateBot = async(req, res) => {
    try {
        const botId = req.params.id;
        const {linkPlataforma, linkGrupo} = req.body;

        if(!(validUrl.isUri(linkPlataforma) || linkPlataforma==undefined))
            return res.status(400).send({
                error: {
                    success: false,
                    status: 400,
                    title: 'Link para acesso à plataforma inválido',
                    description: 'Certifique-se de fornecer um link válido para acesso à plataforma.',
                }
            });
        if(!(validUrl.isUri(linkGrupo) || linkGrupo==undefined))
            return res.status(400).send({
                error: {
                    success: false,
                    status: 400,
                    title: 'Link para acesso ao grupo inválido',
                    description: 'Certifique-se de fornecer um link válido para acesso ao grupo.',
                }
            });
        const bot = await Bot.findById(botId);

        if (!bot) {
            return res.status(404).send({
                error: {
                    success: false,
                    status: 404,
                    title: 'Bot não encontrado',
                    description: `Não foi possível encontrar um bot com o ID ${botId}.`,
                },
            });
        }
        if (bot.execut){
            return res.status(403).send({
                error: {
                    success: false,
                    status: 403,
                    title: 'Acesso não permitido',
                    description: 'Não é possível alterar os dados de um bot em execução.',
                },
            });
        }
        const botUp = await Bot.findByIdAndUpdate(botId,{
            linkPlataforma,
            linkGrupo

        }, { new: true, runValidators: true});
        return res.status(200).send({
            success: true,
            status: 200,
            message: 'Atualizado com sucesso os links.',
            data: {
                bot: botUp,
            },
        });
    } catch (error) {
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
export const updateBotImg = async(req, res) => {
    try {
        if(req.params.image !== '1' && req.params.image !== '2'){
            dellImgError(req.files)
            return res.status(400).send({
                error: {
                    success: false,
                    status: 400,
                    title: 'Parâmetro de imagem incorreto',
                    description: 'O parâmetro de imagem deve ser 1 ou 2.',
                }
            });
        }
        if(verifyImgUp(req.files[0])){
            dellImgError(req.files)
            return res.status(400).send({
                error: {
                    success: false,
                    status: 400,
                    title: 'Erro na imagem',
                    description: 'O formato ou conteúdo da imagem é inválido.',
                }
            });
        }
        const bot = await Bot.findById(req.params.id)
        if (!bot) {
            dellImgError(req.files);
            return res.status(404).send({
                error: {
                    success: false,
                    status: 404,
                    title: 'Bot não encontrado',
                    description: `Não foi possível encontrar o bot com o ID ${req.params.id}.`,
                },
            });
        }
        if (bot.execut){
            dellImgError(req.files)
            return res.status(403).send({
                error: {
                    success: false,
                    status: 403,
                    title: 'Acesso não permitido',
                    description: 'Não é possível alterar os dados de um bot em execução.',
                },
            });
        }
        var msg = undefined;
        if(req.params.image==='1'){
            msg = 'imagem 1';
            dellImg([bot.image1]);
            bot.image1=req.files[0].filename;
        }
        if(req.params.image==='2'){
            msg = 'imagem 2';
            dellImg([bot.image2]);
            bot.image2=req.files[0].filename;
        }
        await bot.save();
        return res.status(201).send({
            success: true,
            status: 200,
            message: `Atualizado a ${msg} com sucesso.`,
            data: {
                bot: bot,
            }
        });
    } catch (error) {
        dellImgError(req.files)
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
export const deleteBot = async (req, res) => {
    try {
        const bot = await Bot.findById(req.params.id);
        if(!bot) {
            return res.status(404).send({
                error: {
                    success: false,
                    status: 404,
                    title: 'Bot não encontrado',
                    description: `Não foi possível encontrar o bot com o ID ${req.params.id}.`,
                },
            });
        }
        if(bot.execut)
            return res.status(400).send({
                error: {
                    success: false,
                    status: 400,
                    title: 'Operação inválida',
                    description: 'Não é possível excluir um bot em execução.',
                }
            });

        dellImg([bot.image1,bot.image2]);
        await bot.deleteOne()
        return res.status(200).send({
            success: true,
            status: 200,
            message: `Deletado o ${req.params.id} com sucesso.`,
            data: {
                bot: undefined,
            }
        });
    } catch (error) {
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

export const startBot = async(req, res) => {
    try {
        const bot = await Bot.findById(req.params.id)
        if(!bot) {
            return res.status(404).send({
                error: {
                    success: false,
                    status: 404,
                    title: 'Bot não encontrado',
                    description: `Não foi possível encontrar o bot com o ID ${req.params.id}.`,
                },
            });
        }
        if(bot.execut){
            if(await pidIsRuning(bot.pid)){
                return res.status(400).send({
                    error: {
                        success: false,
                        status: 400,
                        title: 'Operação inválida',
                        description: 'O bot está atualmente em execução. Pare o bot antes de iniciar novamente.',
                    }
                });
            }
        }
        const pid = startBotService(bot)

        if(await pidIsRuning(pid)){
            const execut = true;
            bot.execut = execut;
            bot.pid=pid;
            await bot.save();
            
            return res.status(200).send({
                success: true,
                status: 200,
                message: `Bot iniciado com sucesso.`,
                data: {
                    bot: bot,
                }
            });
        }else{
            return res.status(400).send({
                error: {
                    success: false,
                    status: 400,
                    title: 'Falha ao iniciar',
                    description: 'Não foi possível iniciar o bot. Verifique as configurações e tente novamente.',
                },
            });
        }
    } catch (error) {
        return res.status(500).send({
            error: {
              success: false,
              status: 500,
              title: 'Erro interno do servidor',
              description: 'Um erro inesperado ocorreu durante o start do bot. Tente novamente mais tarde.',
            }
        });
    }
}
export const killBot = async(req, res) => {
    try {
        const bot = await Bot.findById(req.params.id);
        if (!bot) {
            return res.status(404).send({
                error: {
                    success: false,
                    status: 404,
                    title: 'Bot não encontrado',
                    description: `Não foi possível encontrar o bot com o ID ${req.params.id}.`,
                },
            });
        }
        if(bot.execut){
            if(await pidIsRuning(bot.pid)){
                killBotService(bot.pid)
                bot.execut=false;
                bot.pid=undefined;
                await bot.save();
                return res.status(200).send({
                    success: true,
                    status: 200,
                    message: `Bot parado com sucesso.`,
                    data: {
                        bot: bot,
                    }
                });
            }else{
                bot.execut=false;
                bot.pid=undefined;
                await bot.save();
                return res.status(200).send({
                    success: true,
                    status: 200,
                    message: `Bot parado (não estava em execução)`,
                    data: {
                        bot: bot,
                    }
                });
            }   
        }else{
            return res.status(200).send({
                success: true,
                status: 200,
                message: `O bot já está parado`,
                data: {
                    bot: bot,
                }
            });
        }
    } catch (error) {
        return res.status(500).send({
            error: {
                success: false,
                status: 500,
                title: 'Erro interno do servidor',
                description: 'Um erro inesperado ocorreu durante a parada do bot. Tente novamente mais tarde.',
            },
        });
    }
}





