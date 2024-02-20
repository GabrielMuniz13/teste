import validUrl from 'valid-url';
import { Bot } from "../../models/bot.js";
import { verifyImgUp, dellImgError, dellImg } from '../../services/image.js';
import { startBotService, killBotService } from '../../services/botServices.js';
import pidIsRuning from '../../services/pidIsRuning.js';
export const getBots = async(req, res) => {
    // Lógica para obter usuários
    try {
        const userBots = await Bot.find({ user: req.userId });
        if (userBots.length === 0) {
            return res.status(200).send({
                success: true,
                status: 200,
                message: 'Usuário não possui bots associados',
                data: {
                    bots: []
                }
            });
        }

        return res.status(200).send({
            success: true,
            status: 200,
            message: 'Bots encontrados com sucesso',
            data: {
                bots: userBots
            }
        });

    } catch (error) {
        return res.status(500).send({
            error: {
                success: false,
                status: 500,
                title: 'Erro interno do servidor',
                description: 'Um erro inesperado ocorreu ao buscar os bots do usuário. Tente novamente mais tarde.',
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
        const bot = await Bot.findOne({
            _id: req.params.id,
            user: req.userId
        })
        if (!bot)
            return res.status(404).send({
                error: {
                    success: false,
                    status: 404,
                    title: 'Bot não encontrado',
                    description: `Não foi possível encontrar o bot com o ID ${botId} associado ao usuário ${req.userId}.`,
                },
            });
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
        const botUp = await Bot.findOneAndUpdate({
            _id: botId,
            user: req.userId
        },{
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
                description: 'Um erro inesperado ocorreu ao atualizar o bot. Tente novamente mais tarde.',
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
                    description: 'Certifique-se de fornecer um parâmetro de imagem válido (1 ou 2).',
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
        const bot = await Bot.findOne({
            _id: req.params.id,
            user: req.userId
        })
        if (!bot){
            dellImgError(req.files)
            return res.status(404).send({
                error: {
                    success: false,
                    status: 404,
                    title: 'Bot não encontrado',
                    description: `Não foi possível encontrar o bot com o ID ${req.params.id} associado ao usuário ${req.userId}.`,
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
            msg=1;
            dellImg([bot.image1]);
            bot.image1=req.files[0].filename;
        }
        if(req.params.image==='2'){
            msg=2;
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
                description: 'Um erro inesperado ocorreu ao atualizar as imagens do bot. Tente novamente mais tarde.',
            }
        });
    }
}

export const startBot = async(req, res) => {
    try {
        const bot = await Bot.findOne({
            _id: req.params.id,
            user: req.userId
        })
        if(!bot)
            return res.status(404).send({
                error: {
                    success: false,
                    status: 404,
                    title: 'Bot não encontrado',
                    description: `Não foi possível encontrar o bot com o ID ${botId} associado ao usuário ${req.userId}.`,
                },
            });
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
        const bot = await Bot.findOne({
            _id: req.params.id,
            user: req.userId
        })
        if(!bot)
            return res.status(404).send({
                error: {
                    success: false,
                    status: 404,
                    title: 'Bot não encontrado',
                    description: `Não foi possível encontrar o bot com o ID ${req.params.id} associado ao usuário ${req.userId}.`,
                },
            });
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