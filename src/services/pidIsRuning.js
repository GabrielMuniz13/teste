import psList from 'ps-list';

async function isProcessRunning(pid) {
    const processes = await psList();
    return processes.some(process => process.pid === pid);
}

export default async function pidIsRuning(targetPID){
    return await isProcessRunning(targetPID)
    .then(result => {
        if (result) {
            console.log(`O processo com PID ${targetPID} está em execução.`);
            return true;
        } else {
            console.log(`O processo com PID ${targetPID} não está em execução.`);
            return false;
        }
    })
    .catch(error => {
        console.error(`Erro ao verificar o processo: ${error.message}`);
        return false;
    });
}


