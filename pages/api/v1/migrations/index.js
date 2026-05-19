import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(req, res) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true, //apenas simula
      dir: join("infra", "migrations"), //caminho tratado
      direction: "up", //executa migrations (aplica mudanças)
      verbose: true, //detalha logs
      migrationsTable: "pgmigrations", //tabela onde salvar as migrations
  }

  if(req.method === 'GET') {
    const migrations = await migrationRunner(defaultMigrationOptions);
    await dbClient.end();
    return res.status(200).json(migrations);    
  };

  if(req.method === 'POST') {
    const migrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false
    });

    await dbClient.end();
    
    if(migrations.length > 0){
      return res.status(201).json(migrations);       
    }
    
    return res.status(200).json(migrations);       
  }

  return res.status(405).end();

}