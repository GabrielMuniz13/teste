import { spawn, exec } from 'child_process';
export function startBotService(bot){
  // const comando1 = 'ls -l';

  // exec(comando1, (err, stdout, stderr) => {
  //   if (err) {
  //     console.error(`Erro ao executar o comando: ${err.message}`);
  //     return;
  //   }

  //   if (stderr) {
  //     console.error(`Erro no STDERR: ${stderr}`);
  //     return;
  //   }

  //   console.log('Saída do comando:');
  //   console.log(stdout);
  // });
    const comando = 'java';
    const argumentos = [
        '-jar',
        './bots/'+bot.arquivoBot,
        '--server.port='+bot.port,
        '--bot.token=6645580967:AAEdtsD5tF_VnCiPHztR9eWBdTDg_-kzioE',
        '--chat.id='+bot.chatId,
        '--link='+bot.linkPlataforma,
        '--grupo='+bot.linkGrupo,
        '--img1=./uploads/'+bot.image1,
        '--img2=./uploads/'+bot.image2
    ];

    const processo = spawn('nohup', [comando, ...argumentos], {
      detached: true,
      stdio: 'ignore',
    });
    processo.unref();
    return processo.pid
}
export function killBotService(pid){
    const comandoKill = `kill -9 ${pid}`;

    exec(comandoKill, (erro, stdout, stderr) => {
        if (erro) {
            console.error(`Erro ao tentar matar o processo: ${erro.message}`);
            return;
        }
        console.log(`Processo encerrado com sucesso. Saída do comando: ${stdout}`);
    });
}

//java -jar gabriel.jar --server.port=5039 
//--bot.token=6645580967:AAEdtsD5tF_VnCiPHztR9eWBdTDg_-kzioE --chat.id=-4129325858 
//--link=https://go.aff.acelerabet.com/cadastraragora 
//--grupo=https://chat.whatsapp.com/Dufq4EA0h7s3Q4yLGoW7JY

// java -jar ../../bots/java.jar --img1=../../uploads/photo.png 
// --img2=../../uploads/photo2.png --server.port=5039 -
// -bot.token=6645580967:AAEdtsD5tF_VnCiPHztR9eWBdTDg_-kzioE 
// --chat.id=-4129325858 --link=https://go.aff.acelerabet.com/cadastraragora 
// --grupo=https://chat.whatsapp.com/Dufq4EA0h7s3Q4yLGoW7JY

