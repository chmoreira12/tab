import { createRouter } from "next-connect";
import database from "infra/database.js";
import controller from "infra/controller.js";
import authorization from "models/authorization";

const router = createRouter();
router.use(controller.injectAnonymousOrUser);
router.get(getHandler);

export default router.handler(controller.errorHandler);

async function getHandler(req, res) {
  const userTryingToGet = req.context.user;
  //busca data em formato ISO
  const updatedAt = new Date().toISOString();

  //busca versão no banco de dados
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  //busca número máximo de conexões
  const databaseMaxConnections = await database.query("SHOW max_connections;");
  const databaseMaxConnectionsValue =
    databaseMaxConnections.rows[0].max_connections;

  //busca quantidade atual de conexões ao banco
  //prevenção contra SQL Injection
  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  const statusObject = {
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  };

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:status",
    statusObject,
  );

  //envia response para a página
  res.status(200).json(secureOutputValues);
}
