// index.js
import './dotEnvConfigs.js';
import express from 'express';
import routes from './src/routes/index.js';


const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(routes);

const port = process.env.PORT || 3000;
// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
