const dotenv = require("dotenv");
//módulo para definir o arquivo das variáveis de ambiente
const nextJest = require("next/jest");
//módulo que faz com que o jest transpile o import e entenda variáveis de ambiente

dotenv.config({
    path: '.env.development'
    //define arquivo de variáveis de ambiente
})

const createJestConfig = nextJest();
const jestConfig = createJestConfig({
    moduleDirectories: ["node_modules", "<rootDir>"]
});

module.exports = jestConfig;