import { Client } from "pg";

//registra credenciais para acesso ao banco
async function query(object) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === 'development' ? false : true,
    //se o ambiente estiver em desenvolvimento, não use o ssl.
    //se estiver em produção, use o ssl
    //o ambiente de desenvolvimento não está configurado para usar ssl
  });

  console.log('Credenciais do POSTGRES: ', {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValue(),
  });
  
  
  //tenta fazer a query e retornar o resultado
  try{
    //abre conexão com o banco 
    await client.connect();
    const result = await client.query(object);
    return result;

  } catch (err){
    console.error(err);
    //caso dê erro, mostre
    throw err;
    
  }finally{
    await client.end();
    //sempre finalize a conexão, dando certo ou errado
  }
  
}

export default {
  query: query,
};

function getSSLValue() {
  if(process.env.POSTGRES_CA){
    return {
      ca: process.env.POSTGRES_CA
    }
  }

  return process.env.NODE_ENV === 'development' ? true : false;
}
