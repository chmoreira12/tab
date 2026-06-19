import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();
router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandler);

const defaultMigrationOptions = {
  dryRun: true, //apenas simula
  dir: resolve("infra", "migrations"), //caminho tratado
  direction: "up", //executa migrations (aplica mudanças)
  verbose: true, //detalha logs
  migrationsTable: "pgmigrations", //tabela onde salvar as migrations
};

async function getHandler(req, res) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const pendinMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });

    return res.status(200).json(pendinMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(req, res) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    if (migratedMigrations.length > 0) {
      return res.status(201).json(migratedMigrations);
    }

    return res.status(200).json(migratedMigrations);
  } finally {
    await dbClient.end();
  }
}
