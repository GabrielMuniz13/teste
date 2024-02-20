
import jsonwebtoken from 'jsonwebtoken';
export const userAuth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader)
        return res.status(401).send({
            error: {
                success: false,
                status: 401,
                title: 'Token não fornecido',
                description: 'É necessário fornecer um token para acessar esta rota. Certifique-se de incluir o token no cabeçalho da requisição.',
            },
        });
    
    const parts = authHeader.split(' ');
    if(!parts.length === 2)
        return res.status(401).send({
            error: {
                success: false,
                status: 401,
                title: 'Erro no token',
                description: 'O token fornecido apresenta um erro. Verifique se o token está correto.',
            },
        });
    const [scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({
            error: {
                success: false,
                status: 401,
                title: 'Formato de token incorreto',
                description: 'O formato do token fornecido é inválido. Certifique-se de usar o formato correto.',
            },
        });

    jsonwebtoken.verify(token, process.env.JWT_SECRET,(err, decoded) => {
        if(err)
            return res.status(401).send({
                error: {
                    success: false,
                    status: 401,
                    title: 'Token inválido',
                    description: 'O token fornecido é inválido. Faça login novamente para obter um novo token.',
                },
            });
        if(decoded.type)
            return res.status(401).send({
                error: {
                    success: false,
                    status: 401,
                    title: 'Rota de usuário comum',
                    description: 'Você não possui as permissões necessárias para acessar esta rota.',
                },
            });
        req.userId = decoded.id;
        return next();
    })       
}
export const adminAuth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader)
        return res.status(401).send({
            error: {
                success: false,
                status: 401,
                title: 'Token não fornecido',
                description: 'É necessário fornecer um token para acessar esta rota. Certifique-se de incluir o token no cabeçalho da requisição.',
            },
        });
    
    const parts = authHeader.split(' ');
    if(!parts.length === 2)
        return res.status(401).send({
            error: {
                success: false,
                status: 401,
                title: 'Erro no token',
                description: 'O token fornecido apresenta um erro. Verifique se o token está correto.',
            },
        });
    const [scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({
            error: {
                success: false,
                status: 401,
                title: 'Formato de token incorreto',
                description: 'O formato do token fornecido é inválido. Certifique-se de usar o formato correto.',
            },
        });

    jsonwebtoken.verify(token, process.env.JWT_SECRET,(err, decoded) => {
        if(err)
            return res.status(401).send({
                error: {
                    success: false,
                    status: 401,
                    title: 'Token inválido',
                    description: 'O token fornecido é inválido. Faça login novamente para obter um novo token.',
                },
            });
        if(!decoded.type)
            return res.status(401).send({
                error: {
                    success: false,
                    status: 401,
                    title: 'Acesso não permitido',
                    description: 'Você não possui as permissões necessárias para acessar esta rota. Certifique-se de utilizar um token de administrador válido.',
                },
            });
        req.userId = decoded.id;
        return next();
    })       
}

