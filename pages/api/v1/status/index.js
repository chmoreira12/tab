function status(req, res) {
  res.status(200).json({ chave: "Olá, aqui é o status!" });
}

export default status;
