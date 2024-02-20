// import '../../dotEnvConfigs.js';
// import mongoose from '../database/index.js';
// import { User } from '../models/user.js';


// const user = { 
//     nome: process.env.NOME, 
//     isAdmin: true,
//     usuario: process.env.USUARIO,
//     telefone: '00000000000', 
//     isAdmin: true,
//     password: process.env.PASSWORD,
// };

// const seedUser = async () => {
//     try {
//         const userr = await User.create(user);
//         console.log('Seed concluído com sucesso!');
//     } catch (error) {
//         console.error('Erro durante o seed:', error);
//     } finally {
//         mongoose.connection.close(); // Fecha a conexão com o banco de dados
//     }
// };

// // Executa a função de seed
// seedUser();


import '../../dotEnvConfigs.js';
import mongoose from '../database/index.js';
import { User } from '../models/user.js';

const adminUser = {
    nome: process.env.NOME,
    isAdmin: true,
    usuario: process.env.USUARIO,
    telefone: '00000000000',
    password: process.env.PASSWORD,
};

const seedAdminUser = async () => {
    try {
        const existingAdmin = await User.findOne({ isAdmin: true });

        if (existingAdmin) {
            console.log('Já existe um administrador. Não é necessário criar um novo.');
        } else {
            await User.create(adminUser);
            console.log('Administrador criado com sucesso!');
        }
    } catch (error) {
        console.error('Erro durante o seed:', error);
    } finally {
        mongoose.connection.close(); 
    }
};

seedAdminUser();
