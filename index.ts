import "module-alias/register";
import "reflect-metadata";

import server from "@config/server";

server.listen(process.env.APP_PORT, () => {
  console.log(`Servidor inicializado na porta ${process.env.APP_PORT}!`);
});

export default server;
