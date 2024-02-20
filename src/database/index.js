
import mongoose from 'mongoose';
// MONGO_URI=mongodb://admin:gabriel21@mongo:27017/
const conectarBancoDeDados = async () => {
  const mongoUser = process.env.MONGO_USER
  const mongoPass = process.env.MONGO_PASS
  const mongoDatabase =process.env.MONGO_DATABASE
  
  // try {
  //   console.log(process.env.MONGO_URI)
  //   await mongoose.connect(`mongodb://${mongoUser}:${mongoPass}@mongo:2701d7`);
  //   console.log('Conectado ao MongoDB');
  // } catch (error) {
  //   console.error('Erro de conexão com o MongoDB:', error);
  // }
  try {
    await mongoose.connect("mongodb://mongo:27017/api", {
      auth: { username: mongoUser, password: mongoPass},
      authSource: "admin",
    });
    console.log("Connected to mongo db");
  } catch (error) {
    console.error("Error connecting to mongodb", error);
  }
};
conectarBancoDeDados();
export default mongoose;






