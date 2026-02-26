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
  
  //abre conexão com o banco
  await client.connect();
  
  //tenta fazer a query e retornar o resultado
  try{
    const result = await client.query(object);
    return result;

  } catch (err){
    console.log(err);
    //caso dê erro, mostre

  }finally{
    await client.end();
    //sempre finalize a conexão, dando certo ou errado
  }
  
}

export default {
  query: query,
};
