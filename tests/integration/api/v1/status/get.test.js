test("GET to /api/v1/status should return 200", async () => {
  //testa requisição na página
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  //busca corpo json na página
  const responseBody = await response.json();

  //testa data
  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  //testa versão
  expect(responseBody.dependencies.database.version).toEqual("16.0");

  //testa máximo de conexões
  expect(responseBody.dependencies.database.max_connections).toEqual(100);

  //testa conexões abertas
  expect(responseBody.dependencies.database.opened_connections).toEqual(1);

});
