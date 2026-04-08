import { Client } from "pg";

//registra credenciais para acesso ao banco
async function query(object) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });

  console.log('Credenciais do POSTGRES: ', {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
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
    throw error;
    
  }finally{
    await client.end();
    //sempre finalize a conexão, dando certo ou errado
  }
  
}

export default {
  query: query,
};
