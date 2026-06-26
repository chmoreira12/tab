import { resolve } from "node:path";
import database from "infra/database.js"
import migrationRunner from "node-pg-migrate";

const defaultMigrationOptions = {
  dryRun: true, //apenas simula
  dir: resolve("infra", "migrations"), //caminho tratado
  direction: "up", //executa migrations (aplica mudanças)
  verbose: true, //detalha logs
  migrationsTable: "pgmigrations", //tabela onde salvar as migrations
};

async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const pendinMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });

    return pendinMigrations;
  } finally {
    await dbClient.end();
  }
}

async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    return migratedMigrations;
  } finally {
    await dbClient.end();
  }
}


const migrator = {
    listPendingMigrations,
    runPendingMigrations
}

export default migrator;
