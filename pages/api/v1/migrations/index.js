import migrationRunner from "node-pg-migrate";
//o módulo node-pg-migrate executa migrations no banco postgres
//a grosso modo, serve para configurar as migrations no endpoint
//e gerenciar o banco

import { join } from "node:path";
//este módulo serve para trabalhar com caminhos de pastas
//em sistemas operacionais variados, por exemplo:
//um caminho em linux é infra/migrations, mas no windows
//é infra\migrations, então para que não quebre de um
//sistema operacional para outro, usa-se o join.

export default async function migrations(req, res) {
  
  if(req.method === 'GET') {
    const migrations = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL, //url do banco
      dryRun: true, //apenas simula
      dir: join("infra", "migrations"), //caminho tratado
      direction: "up", //executa migrations (aplica mudanças)
      verbose: true, //detalha logs
      migrationsTable: "pgmigrations", //tabela onde salvar as migrations
    });
    return res.status(200).json(migrations);    
  };

  if(req.method === 'POST') {
    const migrations = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL, //url do banco
      dryRun: false, //apenas simula
      dir: join("infra", "migrations"), //caminho tratado
      direction: "up", //executa migrations (aplica mudanças)
      verbose: true, //detalha logs
      migrationsTable: "pgmigrations", //tabela onde salvar as migrations
    });
    return res.status(200).json(migrations);       
  }

  return res.status(405).end();

}