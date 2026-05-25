import { Client } from "pg";

//registra credenciais para acesso ao banco
async function query(object) {
  let client;
  try {
    //abre conexão com o banco
    client = await getNewClient();
    const result = await client.query(object);
    return result;
  } catch (err) {
    console.error(err);
    //caso dê erro, mostre
    throw err;
  } finally {
    await client.end();
    //sempre finalize a conexão, dando certo ou errado
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValue(),
  });
  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;

function getSSLValue() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "production" ? true : false;
}
